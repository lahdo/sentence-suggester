import markovify
from markovify.splitters import split_into_sentences
from .chain import Chain, BEGIN, END
from unidecode import unidecode
from markovify.text import DEFAULT_MAX_OVERLAP_RATIO, DEFAULT_MAX_OVERLAP_TOTAL, DEFAULT_TRIES, ParamError

class Text(markovify.Text):

    def test(self):
        """
        Returns the underlying data as a Python dict.
        """
        print("Test")

    @classmethod
    def from_dict(cls, obj):
        return cls(
            None,
            state_size=obj["state_size"],
            chain=Chain.from_json(obj["chain"]),
            parsed_sentences=obj["parsed_sentences"]
        )

    def make_predictions(self, beginning, **kwargs):
        """
        Tries making a prediction that begins with `beginning` string,
        which should be a string of one or two words known to exist in the
        corpus. **kwargs are passed to `self.predict`.
        """
        split = self.word_split(beginning)
        word_count = len(split)
        if word_count == self.state_size:
            init_state = tuple(split)
        elif word_count > 0 and word_count < self.state_size:
            init_state = tuple([ BEGIN ] * (self.state_size - word_count) + split)
        else:
            err_msg = "`make_predictions` for this model requires a string containing 1 to {0} words. Yours has {1}: {2}".format(self.state_size, word_count, str(split))
            raise ParamError(err_msg)

        return self.predict(init_state, **kwargs)

    def predict(self, init_state=None, **kwargs):
        """
        Attempts `tries` (default: 10) times to generate a valid sentence,
        based on the model and `test_sentence_output`. Passes `max_overlap_ratio`
        and `max_overlap_total` to `test_sentence_output`.

        If successful, returns the sentence as a string. If not, returns None.

        If `init_state` (a tuple of `self.chain.state_size` words) is not specified,
        this method chooses a sentence-start at random, in accordance with
        the model.

        If `test_output` is set as False then the `test_sentence_output` check
        will be skipped.

        If `max_words` is specified, the word count for the sentence will be
        evaluated against the provided limit.
        """
        tries = kwargs.get('tries', DEFAULT_TRIES)

        for _ in range(tries):
            if init_state != None:
                if init_state[0] == BEGIN:
                    prefix = list(init_state[1:])
                else:
                    prefix = list(init_state)
            else:
                prefix = []

            predictions = self.chain.walk(init_state)

            if(len(predictions)):
                words = prefix + predictions
            else:
                words = []

            return self.word_join(words)