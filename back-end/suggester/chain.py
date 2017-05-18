import markovify
import random
import bisect
from markovify.chain import BEGIN, END, accumulate
import operator

# NOT_IN_MODEL = "___NOT_IN_MODEL__"

class Chain(markovify.chain.Chain):
    def move(self, state):
        """
        Given a state, choose the next item at random.
        """
        cumdist = []
        choices = []

        if state == tuple([ BEGIN ] * self.state_size):
            choices = self.begin_choices
            cumdist = self.begin_cumdist
        else:
            if state in self.model:
                choices, weights = zip(*self.model[state].items())
                cumdist = list(accumulate(weights))
        # selection = sorted(self.model[state].items(), key=operator.itemgetter(1),reverse=True)[0][0]
        if len(cumdist):
            r = random.random() * cumdist[-1]
            selection = choices[bisect.bisect(cumdist, r)]
            return selection
        else:
            return END

    def gen(self, init_state=None):
        """
        Starting either with a naive BEGIN state, or the provided `init_state`
        (as a tuple), return a generator that will yield successive items
        until the chain reaches the END state.
        """
        state = init_state or (BEGIN,) * self.state_size
        while True:
            next_word = self.move(state)
            if next_word == END: break
            yield next_word
            state = tuple(state[1:]) + (next_word,)

    def walk(self, init_state=None):
        """
        Return a list representing a single run of the Markov model, either
        starting with a naive BEGIN state, or the provided `init_state`
        (as a tuple).
        """
        # import pdb; pdb.set_trace()
        return list(self.gen(init_state))