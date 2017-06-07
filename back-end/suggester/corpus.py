from .redis import StrictRedis
from operator import itemgetter
from suggester.input import Input
from suggester.modes import Mode

MARKERS = {
    "END": "___END__"
}

class Corpus(object):
    """
    A Markov chain representing processes that have both beginnings and ends.
    For example: Sentences.
    """

    def __init__(self, models):
        self.letter_model = "letters"
        self.models = models
        self.redis_instance = StrictRedis(host='localhost', port=6379, db=0)
        self.MAX_N = 5
        self.N_GRAM_WEIGHT = 1000

    def make_predictions(self, beginning,
                         number_of_sentence_predictions=5,
                         max_number_of_words_predictions=4,
                         number_of_combinations=4):

        mode = Mode.detect_mode(beginning)
        space = True if mode == Mode.SPACE_AT_THE_END else False

        beginning = list(filter(None, beginning)) # Remove spaces

        mapping = {
            Mode.NO_MODE: lambda *x: [],
            Mode.FIRST_WORD: self.handle_first_word,
            Mode.NO_SPACE_AT_THE_END: self.handle_no_space,
            Mode.SPACE_AT_THE_END: self.handle_space
        }

        predictions = mapping[mode](beginning,
                                    number_of_sentence_predictions,
                                    max_number_of_words_predictions,
                                    number_of_combinations)

        processed_predictions = self.process_predictions(predictions, number_of_sentence_predictions, beginning, space)

        return processed_predictions

    def handle_first_word(self,
                      beginning,
                      number_of_sentence_predictions=5,
                      max_number_of_words_predictions=4,
                      number_of_combinations=4):

        first_word = beginning[0]
        second_word = ""

        input = Input([first_word, second_word])

        predictions = self.predict_next_word(input, number_of_sentence_predictions)

        return predictions

    def handle_space(self,
                      beginning,
                      number_of_sentence_predictions=5,
                      max_number_of_words_predictions=4,
                      number_of_combinations=4):
        inputs = []

        if (len(beginning)> 1):  # At least two words
            range_for_loop = self.calculate_range(beginning)

            for index in range_for_loop:
                words = (beginning[-1:index:-1])[::-1]
                input = Input(words)
                inputs.append(input)
        else:
            input = Input([beginning[-1]])
            inputs.append(input)

        predictions = \
                self.process(inputs, number_of_combinations, max_number_of_words_predictions)

        return predictions

    def handle_no_space(self,
                      beginning,
                      number_of_sentence_predictions=5,
                      max_number_of_words_predictions=4,
                      number_of_combinations=4):
        inputs = []
        predictions = []

        if (len(beginning) > 1):  # At least two words
            range_for_loop = self.calculate_range(beginning)

            input = Input([beginning[-2], beginning[-1]])

            possible_words = self.predict_next_word(input, number_of_sentence_predictions)

            inputs.append(input)

            for word in possible_words:
                for index in range_for_loop:
                    words = (beginning[-2:index:-1])[::-1] + [word.words[0]]
                    input = Input(words, word.score)
                    inputs.append(input)

            predictions = \
                self.process(inputs, number_of_combinations, max_number_of_words_predictions)

        return predictions

    def calculate_range(self, beginning):
        number_of_provided_words = len(beginning)
        number_of_words_in_input = self.MAX_N+2 if self.MAX_N < number_of_provided_words else number_of_provided_words+2
        return range(-3, -number_of_words_in_input, -1)

    def process(self, inputs, number_of_combinations, max_number_of_words_predictions):
        all_predictions = []

        for input in inputs:
            predictions = self.make_sentence_predictions(input, number_of_combinations, max_number_of_words_predictions)
            all_predictions += (predictions)

        return all_predictions

    def predict_next_word(self, beginning, number_of_sentence_predictions):
        first_word = beginning.words[0]
        second_word = beginning.words[1] if len(beginning.words) > 1 else ""

        words = self.predict_next_letters(first_word, second_word)
        predictions = [Input([item[0]], item[1]) for item in words[:number_of_sentence_predictions]]

        return predictions

    def predict_next_letters(self, first_word, second_word):
        key_name = self.generate_key(self.letter_model, [first_word, second_word])

        words = self.predict_words(key_name, number_of_words=10)

        words = [(item[0].decode("utf-8"), item[1]) for item in words]
        return words

    def process_predictions(self, predictions, number_of_sentence_predictions, beginning, space):
        print("No of sentences ", len(predictions))

        sorted_sentences_predictions = sorted(predictions, key=lambda x: x.score, reverse=True)

        if len(sorted_sentences_predictions) > number_of_sentence_predictions:
            predictions = sorted_sentences_predictions[:number_of_sentence_predictions]
        else:
            predictions = [] + sorted_sentences_predictions

        predictions = self.clean_predictions(predictions)

        return self.normalize_prediction(predictions, beginning, space)

    def normalize_prediction(self, predictions, beginning, space):
        normalized_predictions = [item.words for item in predictions] # Get only words, without scores
        normalized_predictions = self.remove_beginning(normalized_predictions, beginning, space)

        # return [" ".join(item[2:]) for item in normalized_predictions]
        # [item[0:] for item in normalized_predictions]
        return normalized_predictions

    def remove_beginning(self, predictions, beginning, space):
        possible_inputs = []
        range_for_loop = self.calculate_range(beginning)

        if(space and len(beginning) == 1):
            possible_inputs.append([beginning[0]])
        elif(space):
            for index in range_for_loop:
                possible_inputs.append((beginning[-1:index:-1])[::-1])
        else:
            for index in range_for_loop:
                possible_inputs.append((beginning[-2:index:-1])[::-1])

        for index, prediction in enumerate(predictions):
            for input in possible_inputs[::-1]:
                if(prediction[0:len(input):1] == input):
                    predictions[index] = prediction[len(input):]
                    break

        return predictions

    def make_sentence_predictions(self, input, number_of_combinations, max_number_of_words_predictions):
        initial_len = len(input.words)

        sentences = self.run_predictions_cycle(input,
                                               number_of_combinations,
                                               max_number_of_words_predictions,
                                               initial_len)

        for _ in range(max_number_of_words_predictions - 1):
            enhanced_sentences = []
            for sentence in sentences:
                result = self.run_predictions_cycle(sentence, number_of_combinations, max_number_of_words_predictions,
                                                    initial_len)
                enhanced_sentences = enhanced_sentences + result

            sentences = enhanced_sentences

        return sentences

    def clean_predictions(self, predictions):
        for prediction in predictions:
            for word in prediction.words:
                if word == MARKERS["END"]:
                    prediction.words.remove(word)
        return predictions

    def move_window(self, input, window_width):
        return input[-window_width:]  # return last "window_width" elements

    def run_predictions_cycle(self, input, number_of_combinations, max_number_of_words_predictions, initial_len):
        sentence_predictions = []

        beginning = self.move_window(input.words, window_width=initial_len)

        key_name = self.generate_key(self.models, beginning)

        possible_words = self.predict_words(key_name, number_of_combinations)
        possible_words_len = len(possible_words)

        for i in range(possible_words_len) if possible_words_len < number_of_combinations else range(
                number_of_combinations):
            sentence = [] + input.words
            sentence.append(possible_words[i][0].decode("utf-8"))

            score = input.score + possible_words[i][1] + len(beginning)*self.N_GRAM_WEIGHT

            prediction = Input(sentence, score)
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
        if (len(words) > 1 and words[1] == ""):
            key = model + "__" + words[0]
        else:
            key = model + "__" + '::'.join(words)

        return key
