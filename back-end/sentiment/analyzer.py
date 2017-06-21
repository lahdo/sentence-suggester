from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer


def analyze(query):
    sentiments = []
    text = query['text']
    general_score = {
        "polarity": 0,
        "subjectivity": 0
    }

    blob = TextBlob(text)

    for sentence in blob.sentences:
        sentiments.append({
            "sentence": str(sentence),
            "sentiment": sentence.sentiment
        })

        general_score["polarity"] += sentence.sentiment[0]
        general_score["subjectivity"] += sentence.sentiment[1]

    general_score["polarity"] = general_score["polarity"] / len(blob.sentences)
    general_score["subjectivity"] = general_score["subjectivity"] / len(blob.sentences)

    result = {
        "sentiments": sentiments,
        "general_score": general_score
    }

    return result
