from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer


def analyze(query):
    sentiments = []
    text = query['text']

    blob = TextBlob(text)

    for sentence in blob.sentences:

        sentiments.append({
            "sentence": str(sentence),
            "sentiment": sentence.sentiment
        })

        print(sentence.sentiment)

    return sentiments