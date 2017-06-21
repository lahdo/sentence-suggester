from ner import spacy_loader
from collections import defaultdict

def analyze(query):
    entities = defaultdict(list)
    text = query['text']

    en_doc = spacy_loader.en_nlp(text)

    for ent in en_doc.ents:
        entities[ent.label_].append(ent.text)
        # entities.append({
        #     "text": ent.text,
        #     "label": ent.label_
        # })

    return entities