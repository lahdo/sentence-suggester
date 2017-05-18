import json
from suggester import Text


def suggest(words, numberOfWords=2, **kwargs):
    if(len(words) < numberOfWords):
        return []
    else:
        return predict(" ".join(words))

def predict(beginning, **kwargs):
    with open('sherlock_corpus.json') as data_file:
        model_json = json.load(data_file)

    text_model = Text.from_json(model_json)

    predictions = []

    for i in range(5):
        prediction = text_model.make_predictions(beginning)

        if(prediction):
            predictions.append(prediction)

    return list(set(predictions)) # remove duplicates
