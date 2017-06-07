from enum import Enum

class Mode(object):
    NO_MODE = 0
    FIRST_WORD = 1
    SPACE_AT_THE_END = 2
    NO_SPACE_AT_THE_END = 3

    @staticmethod
    def detect_mode(beginning):
        length = len(beginning)
        if (length == 1):
            # First word in a sentence, ex. "th" or "this"
            return Mode.FIRST_WORD
            # Word + " " + word, ex. "this is"
        elif (length and beginning[-1] == ""):
            return Mode.SPACE_AT_THE_END
            # Word + " " + word + " ", ex. "this is "
        elif (length and beginning[-1] != ""):
            return Mode.NO_SPACE_AT_THE_END
        else:
            return Mode.NO_MODE