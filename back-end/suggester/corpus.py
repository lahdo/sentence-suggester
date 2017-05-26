from .redis import StrictRedis
from operator import itemgetter

class Corpus(object):
    """
    A Markov chain representing processes that have both beginnings and ends.
    For example: Sentences.
    """

    def __init__(self, models):
        self.models = models
        self.redis_instance = StrictRedis(host='localhost', port=6379, db=0)

    def make_predictions(self, beginning, number_of_sentence_predictions=5, max_number_of_words_predictions=4):

        input = [beginning, float(0)]

        sentences_predictions = \
            self.make_sentence_predictions(input, number_of_sentence_predictions, max_number_of_words_predictions)

        sorted_sentences_predictions = sorted(sentences_predictions, key=itemgetter(1), reverse=True)

        if len(sorted_sentences_predictions) > number_of_sentence_predictions:
            predictions = sorted_sentences_predictions[:number_of_sentence_predictions]
        else:
            predictions = [] + sorted_sentences_predictions

        return self.normalize_prediction(predictions)

    def normalize_prediction(self, predictions):
        normalized_predictions = [item[0] for item in predictions]

        return [" ".join(item) for item in normalized_predictions]

    def make_sentence_predictions(self, input, number_of_sentence_predictions, max_number_of_words_predictions):

        initial_len = len(input[0])

        sentences = self.run_predictions_cycle(input, number_of_sentence_predictions, max_number_of_words_predictions, initial_len)

        all = []

        print("First: ", sentences)

        for _ in range(max_number_of_words_predictions-1):
            enhanced_sentences = []
            for sentence in sentences:
                result = self.run_predictions_cycle(sentence, number_of_sentence_predictions, max_number_of_words_predictions, initial_len)
                enhanced_sentences = enhanced_sentences + result

            sentences = enhanced_sentences

        return sentences

    def move_window(self, input, window_width):
        return input[-window_width:]#return last "window_width" elements
        # return [input[0][-window_width:], input[1]] #return last "window_width" elements

    def run_predictions_cycle(self, input, number_of_sentence_predictions, max_number_of_words_predictions, initial_len):
        sentence_predictions = []

        beginning = self.move_window(input[0], window_width=initial_len)

        key_name = self.generate_key(self.models, beginning)

        possible_words = self.predict_words(key_name)
        possible_words_len = len(possible_words)

        for i in range(possible_words_len) if possible_words_len < number_of_sentence_predictions else range(number_of_sentence_predictions):
            sentence = [] + input[0]
            sentence.append(possible_words[i][0].decode("utf-8"))

            score = input[1] + possible_words[i][1]

            prediction = [sentence, score]

            sentence_predictions.append(prediction)

        # for __ in range(max_number_of_words_predictions):

        return sentence_predictions

    def make_single_prediction(self, beginning, max_number_of_words_in_prediction):
        # for model in self.models:
        prediction = [] + beginning
        key_name = self.generate_key(self.models, beginning)

        for _ in range(max_number_of_words_in_prediction):
            possible_words = self.predict_words(key_name)

            prediction.append(possible_words[0][0].decode("utf-8"))

            key_name = self.generate_key(self.models, prediction[1:])

            possible_words = self.predict_words(key_name)

            prediction.append(possible_words[0][0].decode("utf-8"))

        prediction = " ".join(prediction)

        return prediction

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
