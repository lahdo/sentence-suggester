import json
from suggester import Text


def suggest(words, numberOfWords=2, **kwargs):
    if(len(words) < numberOfWords):
        return []
    else:
        return predict(" ".join(words))

def predict(beginning, **kwargs):
    text_model = get_default_model()

    predictions = []

    for i in range(5):
        prediction = text_model.make_predictions(beginning)

        if(prediction):
            predictions.append(prediction)

    return list(set(predictions)) # remove duplicates

def get_books_models()
    with open('./models/sherlock_corpus.json') as data_file:
        model_json = json.load(data_file)

    return Text.from_json(model_json)

def get_default_model()
    models = []

    for i in range(20):
        with open('./models/book_models/%s.json' % str(i+1)) as data_file:
            models.append(Text.from_json(json.load(data_file)))

    return markovify.combine(models)