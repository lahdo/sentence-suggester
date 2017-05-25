from .redis import StrictRedis


class Corpus(object):
    """
    A Markov chain representing processes that have both beginnings and ends.
    For example: Sentences.
    """

    def __init__(self, models):
        self.models = models
        self.redis_instance = StrictRedis(host='localhost', port=6379, db=0)

    def make_predictions(self, beginning, number_of_predictions=5, max_number_of_words_in_prediction=4):
        predictions = []

        for _ in range(number_of_predictions):
            prediction = self.make_single_prediction(beginning, max_number_of_words_in_prediction)
            predictions.append(prediction)

        return predictions

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
                                           desc=False,
                                           withscores=True)

        return words

    def generate_key(self, model, words):
        """
        model_name__word_1::word_2
        """
        return model + "__" + '::'.join(words)
