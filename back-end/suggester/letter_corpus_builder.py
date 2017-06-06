import string
from .redis import StrictRedis
from suggester import CorpusBuilder
from suggester.corpus import MARKERS


class LetterCorpusBuilder(CorpusBuilder):
    """
    A Markov chain representing processes that have both beginnings and ends.
    For example: Sentences.
    """

    def __init__(self, text_model, model_name, state_size=1):
        """
        `corpus`: A list of lists, where each outer list is a "run"
        of the process (e.g., a single sentence), and each inner list
        contains the steps (e.g., words) in the run. If you want to simulate
        an infinite process, you can come very close by passing just one, very
        long run.

        `state_size`: An integer indicating the number of items the model
        uses to represent its state. For text generation, 2 or 3 are typical.
        """
        super().__init__(text_model, model_name, state_size=1)
        self.remove_punct_map = dict.fromkeys(map(ord, string.punctuation))

    def build(self):
        self.build_1_gram()
        self.build_2_gram()

    def build_1_gram(self):
        for words in self.text_model.chain.model:
            for item in list(self.text_model.chain.model[words].items()):
                if(item[0] != MARKERS["END"]):
                    word = (item[0].translate(self.remove_punct_map),item[1])

                    for index, letter in enumerate(word[0]):
                        key = self.generate_key([word[0][0:index+1].lower()])
                        self.add_to_redis(key, word[0], 1)
                        # print(key + " " + word[0].lower() + " " + str(1))

    def build_2_gram(self):
        for words in self.text_model.chain.model:
            for item in list(self.text_model.chain.model[words].items()):
                if(item[0] != MARKERS["END"]):
                    first_word = words[0].translate(self.remove_punct_map)
                    second_word = (item[0].translate(self.remove_punct_map),item[1])

                    for index, letter in enumerate(second_word[0]):
                        key = self.generate_key([first_word.lower(), second_word[0][0:index+1].lower()])
                        self.add_to_redis(key, second_word[0], second_word[1])
                        # print(key + " " + second_word[0].lower() + " " + str(second_word[1]))