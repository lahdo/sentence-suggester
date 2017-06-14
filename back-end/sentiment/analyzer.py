from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer


def analyze(query):
    sentiments = []
    text = query['text']

    blob = TextBlob(text, analyzer=NaiveBayesAnalyzer())

    for sentence in blob.sentences:
        sentiments.append({
            "sentence": str(sentence),
            "sentiment": str(sentence.sentiment)
        })

    return sentiments