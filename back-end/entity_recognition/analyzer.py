from entity_recognition import spacy_loader
from collections import defaultdict

def analyze(query):
    entities = defaultdict(list)
    text = query['text']

    en_doc = spacy_loader.en_nlp(text)

    for ent in en_doc.ents:
        entities[ent.label_].append(ent.text)

    return entities