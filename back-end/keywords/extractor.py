from gensim.summarization import keywords


def extract(query):
    text = query['text']
    ratio = query['ratio']
    pos_filter = ['JJ', 'CC', 'CD', 'DT', 'JJ', 'EX', 'RB', 'WRB', 'WP$', 'WP', 'VB']

    return keywords(text, ratio=ratio, pos_filter=pos_filter, split=True)