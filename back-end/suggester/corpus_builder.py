from .redis import StrictRedis


class CorpusBuilder(object):
    """
    A Markov chain representing processes that have both beginnings and ends.
    For example: Sentences.
    """
    def __init__(self, text_model, model_name, state_size=2):
        """
        `corpus`: A list of lists, where each outer list is a "run"
        of the process (e.g., a single sentence), and each inner list
        contains the steps (e.g., words) in the run. If you want to simulate
        an infinite process, you can come very close by passing just one, very
        long run.

        `state_size`: An integer indicating the number of items the model
        uses to represent its state. For text generation, 2 or 3 are typical.
        """
        self.text_model = text_model
        self.model_name = model_name
        self.state_size = state_size
        self.redis_instance = StrictRedis(host='localhost', port=6379, db=0)

    def build(self):
        for words in self.text_model.chain.model:
            key = self.generate_key(words)
            for item in list(self.text_model.chain.model[words].items()):
                self.add_to_redis(key, item[0], item[1])

    def generate_key(self, words):
        """
        model_name__word_1::word_2
        """
        return self.model_name + "__" + '::'.join(words)

    def add_to_redis(self, key, name, score):
        self.redis_instance.zadd(key, name, score, incr=True)