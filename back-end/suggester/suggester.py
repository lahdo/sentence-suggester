import json
import markovify
from suggester import Text, Corpus


def suggest(query, numberOfWords=2, **kwargs):
    if (len(query['words']) < numberOfWords):
        return []
    else:
        return predict(query)


def predict(query, **kwargs):
    jargon = query['jargon']
    words = query['words']

    corpus = Corpus(models=get_models(jargon))

    predictions = corpus.make_predictions(beginning=words,
                                          number_of_sentence_predictions=4,
                                          max_number_of_words_predictions=4,
                                          number_of_combinations=7)

    return list(set(predictions))  # remove duplicates


def get_default_model():
    return DEFAULT_MODEL['key']


def get_models(jargon):
    selected_model = get_default_model()

    try:
        if (jargon == 'default'):
            return selected_model['key']
        else:
            for model in MODELS:
                if (MODELS[model]['name'] == jargon):
                    selected_model = MODELS[model]['key']
            return selected_model
    except ValueError:
        return selected_model


MODELS = {
    'wiki_partial': {
        'name': 'Wikipedia',
        'key': 'wiki',
    },
    'sherlock': {
        'name': 'Sherlock',
        'key': 'sherlock',
    },
    'news': {
        'name': 'News',
        'key': 'news',
    },
    'books': {
        'name': 'Books',
        'key': 'books',
    },
}

DEFAULT_MODEL = MODELS['sherlock']
