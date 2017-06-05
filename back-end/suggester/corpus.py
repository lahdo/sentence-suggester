from .redis import StrictRedis
from operator import itemgetter
import autocomplete

MARKERS = {
    "END": "___END__"
}

MODES = {
    "FIRST_WORD": "FIRST_WORD",
    "SPACE_AT_THE_END": "SPACE_AT_THE_END",
    "NO_SPACE_AT_THE_END": "NO_SPACE_AT_THE_END"
}

class Corpus(object):
    """
    A Markov chain representing processes that have both beginnings and ends.
    For example: Sentences.
    """

    def __init__(self, models):
        self.models = models
        self.redis_instance = StrictRedis(host='localhost', port=6379, db=0)

    def make_predictions(self, beginning,
                         number_of_sentence_predictions=5,
                         max_number_of_words_predictions=4,
                         number_of_combinations=4):

        predictions = []

        mode = self.detect_mode(beginning)
        inputs = []

        if(mode == MODES["FIRST_WORD"]): # Predict just next word
            predictions = self.predict_next_word(beginning, number_of_sentence_predictions)

        elif(mode == MODES["SPACE_AT_THE_END"]):
            if(len(beginning)+1 > 4): # At least two words
                inputs.append([[beginning[-4], beginning[-2]], float(0)])

                predictions = \
                    self.process(inputs, number_of_combinations, max_number_of_words_predictions)

        elif(mode == MODES["NO_SPACE_AT_THE_END"]):
            if(len(beginning)+1 > 3): # At least two words
                inputs.append([[beginning[-3], beginning[-1]], float(0)])

                possible_words = self.predict_next_word([[beginning[-3], beginning[-1]], float(0)], number_of_sentence_predictions)

                for word in possible_words:
                    inputs.append([[beginning[-3], word[0][0]], word[1]])


                predictions = \
                    self.process(inputs, number_of_combinations, max_number_of_words_predictions)

        processed_predictions = self.process_predictions(predictions, number_of_sentence_predictions)

        return processed_predictions

    def process(self, inputs, number_of_combinations, max_number_of_words_predictions):
        all_predictions = []

        for input in inputs:
            predictions = self.make_sentence_predictions(input, number_of_combinations, max_number_of_words_predictions)
            all_predictions += (predictions)

        return all_predictions

    def detect_mode(self, beginning):
        length = len(beginning)
        if(length == 1):
            # First word in a sentence, ex. "th" or "this"
            return MODES["FIRST_WORD"]
            # Word + " " + word, ex. "this is"
        elif(length and beginning[-1] == ""):
            return MODES["SPACE_AT_THE_END"]
            # Word + " " + word + " ", ex. "this is "
        elif(length and beginning[-1] != ""):
            return MODES["NO_SPACE_AT_THE_END"]

    def predict_next_word(self, beginning, number_of_sentence_predictions):
        first_word = beginning[0][0]
        second_word = beginning[0][1] if len(beginning[0]) > 1 else ""

        words = self.predict_next_letters(first_word, second_word)
        return [[[item[0]], item[1]] for item in words[:number_of_sentence_predictions]]

    def predict_next_letters(self, first_word, second_word):
        autocomplete.load()
        return autocomplete.predict(first_word,second_word)

    def process_predictions(self, predictions, number_of_sentence_predictions):
        print("No of sentences ", len(predictions))

        sorted_sentences_predictions = sorted(predictions, key=itemgetter(1), reverse=True)

        if len(sorted_sentences_predictions) > number_of_sentence_predictions:
            predictions = sorted_sentences_predictions[:number_of_sentence_predictions]
        else:
            predictions = [] + sorted_sentences_predictions

        return self.normalize_prediction(predictions)

    def normalize_prediction(self, predictions):
        normalized_predictions = [item[0] for item in predictions]

        # return [" ".join(item[2:]) for item in normalized_predictions]
        return [item[0:] for item in normalized_predictions]

    def make_sentence_predictions(self, input, number_of_combinations, max_number_of_words_predictions):
        initial_len = len(input[0])

        sentences = self.run_predictions_cycle(input,
                                               number_of_combinations,
                                               max_number_of_words_predictions,
                                               initial_len)

        for _ in range(max_number_of_words_predictions-1):
            enhanced_sentences = []
            for sentence in sentences:
                result = self.run_predictions_cycle(sentence, number_of_combinations, max_number_of_words_predictions, initial_len)
                enhanced_sentences = enhanced_sentences + result

            sentences = enhanced_sentences

        sentences = self.clean_sentences(sentences)
        # sentences = self.remove_input_words(sentences, initial_len)

        return sentences

    def clean_sentences(self, sentences):
        for sentence in sentences:
            for word in sentence[0]:
                if word == MARKERS["END"]:
                    sentence[0].remove(word)
        return sentences

    def remove_input_words(self, sentences, number_of_words):
        for sentence in sentences:
            del sentence[0][0:number_of_words]
        return sentences

    def move_window(self, input, window_width):
        return input[-window_width:]#return last "window_width" elements

    def run_predictions_cycle(self, input, number_of_combinations, max_number_of_words_predictions, initial_len):
        sentence_predictions = []

        beginning = self.move_window(input[0], window_width=initial_len)

        key_name = self.generate_key(self.models, beginning)

        possible_words = self.predict_words(key_name, number_of_combinations)
        possible_words_len = len(possible_words)

        for i in range(possible_words_len) if possible_words_len < number_of_combinations else range(number_of_combinations):
            sentence = [] + input[0]
            sentence.append(possible_words[i][0].decode("utf-8"))

            score = input[1] + possible_words[i][1]

            prediction = [sentence, score]
            sentence_predictions.append(prediction)

        return sentence_predictions

    def predict_words(self, key_name, number_of_words=5):
        words = self.redis_instance.zrange(name=key_name,
                                           start=0,
                                           end=number_of_words,
                                           desc=True,
                                           withscores=True)

        return words

    def generate_key(self, model, words):
        """
        model_name__word_1::word_2
        """
        return model + "__" + '::'.join(words)
