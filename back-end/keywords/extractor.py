from gensim import summarization


def extract(query):
    text = query['text']
    ratio = query['ratio']
    pos_filter = ['NN', 'JJ']
    #[
        # 'JJ',
        # 'CC',
        # 'CD',
        # 'DT',
        # 'JJ',
        # 'EX',
        # 'RB',
        # 'WRB',
        # 'WP$',
        # 'WP',
        # 'VB',
        # 'FW'
    #]
    # summarization.keywords.WINDOW_SIZE = 4

    # http://bdewilde.github.io/blog/2014/09/23/intro-to-automatic-keyphrase-extraction/
    return summarization.keywords(text, ratio=ratio, pos_filter=pos_filter, split=True, lemmatize=True)