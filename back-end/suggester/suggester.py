import json
from suggester import Text
import markovify


def suggest(query, numberOfWords=2, **kwargs):
    if(len(query['words']) < numberOfWords):
        return []
    else:
        return predict(query)

def predict(query, **kwargs):
    beginning = " ".join(query['words'])
    jargon = query['jargon']

    text_model = get_model(jargon)

    predictions = []

    for i in range(3):
        prediction = text_model.make_predictions(beginning)

        if(prediction):
            predictions.append(prediction)

    return list(set(predictions)) # remove duplicates

def get_default_model():
    return DEFAULT_MODEL['model']

def get_model(jargon):
    selected_model = get_default_model()

    try:
        if(jargon == 'default'):
            return selected_model()
        else:
            for model in MODELS:
                if(MODELS[model]['name'] == jargon):
                    selected_model = MODELS[model]['model']
            return selected_model()
    except ValueError:
        return selected_model()

def get_books_models():
    models = []

    for i in range(5):#20
        with open('./models/book_models/%s.json' % str(i+1)) as data_file:
            models.append(Text.from_json(json.load(data_file)))

    return markovify.combine(models)

def get_sherlock_model():
    with open('./models/sherlock_corpus.json') as data_file:
        model_json = json.load(data_file)

    return Text.from_json(model_json)

def get_wiki_partial_model():
    with open('./models/wiki_models/wikipedia_partial.json') as data_file:
        model_json = json.load(data_file)

    return Text.from_json(model_json)

def get_news_model():
    # with open('./models/news_models/news.json') as data_file:
    #     model_json = json.load(data_file)
    #
    # return Text.from_json(model_json)
    return ''


MODELS = {
    'wiki_partial': {
        'name': 'Wikipedia',
        'model': get_wiki_partial_model,
    },
    'sherlock': {
        'name': 'Sherlock',
        'model': get_sherlock_model,
    },
    'news': {
        'name': 'News',
        'model': get_news_model,
    },
    'books': {
        'name': 'Books',
        'model': get_books_models,
    },
}

DEFAULT_MODEL = MODELS['books']