import markovify
import json
from suggester import Text

def smoke_test():
    # Get raw text as string.
    with open("sherlock.txt") as f:
        text = f.read()

    # Build the model.
    text_model = markovify.Text(text, state_size=2)

    # Print five randomly-generated sentences
    for i in range(5):
        print(text_model.make_sentence())

    # Print three randomly-generated sentences of no more than 140 characters
    for i in range(3):
        print(text_model.make_short_sentence(140))

def prepare_model():
    # Get raw text as string.
    with open("sherlock.txt") as f:
        text = f.read()

    # Build the model.
    text_model = markovify.Text(text, state_size=2)

    model_json = text_model.to_json()

    with open('sherlock_corpus.json', "w") as outfile:
        json.dump(model_json, outfile)

def prepare_clean_json():
    with open('sherlock_corpus.json') as data_file:
        model_json = json.load(data_file)
        clean_json = json.loads(model_json)

        clean_json2 = json.loads(clean_json['chain'])

    with open('sherlock_corpus_clean.json', "w") as outfile:
        json.dump(clean_json2, outfile)

def smoke_test_ready_model():
    with open('sherlock_corpus.json') as data_file:
        model_json = json.load(data_file)

    text_model = markovify.Text.from_json(model_json)

    # Print five randomly-generated sentences
    for i in range(5):
        print(text_model.make_sentence())

    # Print three randomly-generated sentences of no more than 140 characters
    for i in range(3):
        print(text_model.make_short_sentence(140))

def suggest(beginning, **kwargs):
    with open('sherlock_corpus.json') as data_file:
        model_json = json.load(data_file)

#     text_model = markovify.Text.from_json(model_json)
    text_model = Text.from_json(model_json)

    for i in range(5):
        print(text_model.make_predictions(beginning))


# smoke_test()
# prepare_model()
# prepare_clean_json()
# smoke_test_ready_model()
suggest('the other', max_overlap_ratio=100, max_overlap_total=100, test_output=False)