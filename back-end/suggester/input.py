

class Input(object):
    """
    A Markov chain representing processes that have both beginnings and ends.
    For example: Sentences.
    """

    def __init__(self, words, initial_score=0):
        self.words = words
        self.score = float(initial_score)

    def __getitem__(self, key):
        return self.words[key]