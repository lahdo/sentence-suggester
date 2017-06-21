import markovify
import json
from suggester import Text, CorpusBuilder, LetterCorpusBuilder
import redis
import autocomplete
from gensim.summarization import keywords


def smoke_test():
    # Get raw text as string.
    with open("./models/raw/sherlock.txt") as f:
        text = f.read()

    # Build the model.
    text_model = markovify.Text(text, state_size=2)

    # Print five randomly-generated sentences
    for i in range(5):
        print(text_model.make_sentence())

    # Print three randomly-generated sentences of no more than 140 characters
    for i in range(3):
        print(text_model.make_short_sentence(140))

def prepare_model(raw_text, output_file):
    # Get raw text as string.
    with open(raw_text) as f:
        text = f.read()

    # Build the model.
    text_model = markovify.Text(text, state_size=2)

    model_json = text_model.to_json()

    with open(output_file, "w") as outfile:
        json.dump(model_json, outfile)

def prepare_clean_json():
    with open('./models/sherlock_corpus.json') as data_file:
        model_json = json.load(data_file)
        clean_json = json.loads(model_json)

        clean_json2 = json.loads(clean_json['chain'])

    with open('./models/sherlock_corpus_clean.json', "w") as outfile:
        json.dump(clean_json2, outfile)

def smoke_test_ready_model():
    with open('./models/sherlock_corpus.json') as data_file:
        model_json = json.load(data_file)

    text_model = markovify.Text.from_json(model_json)

    # Print five randomly-generated sentences
    for i in range(5):
        print(text_model.make_sentence())

    # Print three randomly-generated sentences of no more than 140 characters
    for i in range(3):
        print(text_model.make_short_sentence(140))

def suggest(beginning, **kwargs):
    with open('./models/sherlock_corpus.json') as data_file:
        model_json = json.load(data_file)

#     text_model = markovify.Text.from_json(model_json)
    text_model = Text.from_json(model_json)

    for i in range(5):
        print(text_model.make_predictions(beginning))

def handle_csv():
    import csv
    import json

    csvfile = open('./models/corpus.csv', 'r', encoding="latin-1")
    jsonfile = open('./models/news3.txt', 'w')

    fieldnames = ("body","title","last_crawl_date","id")
    # reader = csv.DictReader(csvfile, fieldnames)

    reader = csv.reader(csvfile, delimiter=',')

    for row in reader:
        print(row[1])
        print(row[2])
#         print(row[1], file=jsonfile)
#         print(row[2], file=jsonfile)

def prepare_books_models():
    for i in range(20):
        prepare_model("./models/books/%s.txt" % str(i+1), "./models/book_models/%s.json" % str(i+1))

def prepare_books_redis_models(state_size=2):
    for i in range(20):
        prepare_redis_model("./models/books/%s.txt" % str(i+1), "books", state_size)

def prepare_wiki_model():
    prepare_model("./models/wiki/wikipedia_partial.txt", "./models/wiki_models/wikipedia_partial.json")

def convert_csv():
    import json

    with open('./models/news.json', 'r') as data_file:
        model = json.load(data_file)

    for item in model:
        print(model["last_crawl_date"])
        print(model["title"])

def redis_test():
    r = redis.StrictRedis(host='localhost', port=6379, db=0)
    r.set('foo', 'bar')
    print(r.get('foo'))

def prepare_redis_model(raw_text, model_name, state_size=2):
    # Get raw text as string.
    with open(raw_text) as f:
        text = f.read()

    # Build the model.
    text_model = markovify.Text(text, state_size=state_size)

    corpus = CorpusBuilder(text_model=text_model, model_name=model_name, state_size=state_size)
    corpus.build()

def prepare_redis_letter_model(raw_text, model_name, state_size=1):
    # Get raw text as string.
    with open(raw_text) as f:
        text = f.read()

    # Build the model.
    text_model = markovify.Text(text, state_size=state_size)

    corpus = LetterCorpusBuilder(text_model=text_model, model_name=model_name, state_size=state_size)
    corpus.build()

def prepare_redis_model_from_source(json_model, model_name, state_size=2):
    with open(json_model) as data_file:
        model_json = data_file.read().replace("\\", r"\\") #  json.load(data_file)

    # text_model = markovify.Text.from_json(model_json)

    text_model = Text.from_json(model_json)

    corpus = CorpusBuilder(text_model=text_model, model_name=model_name, state_size=state_size)
    corpus.build()

def prepare_books_redis_letter_model():
    for i in range(20):
        prepare_redis_letter_model("./models/books/%s.txt" % str(i+1), "letters", 1)

def test_autocomplete(beginning, letters):
    autocomplete.load()
    print(autocomplete.predict(beginning,letters))

def gensim_keywords():
    text = "Recently, I registered with the GP across the road from my flat. I’ve lived there for a year. I had put off registering beforehand due to a severe allergy to bureaucracy.  Last year, I wanted to go see a specialist. I snored at my private healthcare provider’s response that I first needed to have a consultation with my doctor… Safe to say it never happened. ‘Access’, in healthcare, tends to mean availability of care, and often comes down to the affordability of the care, and the size of the audience that have access to it. My anecdotes are obviously examples of minor friction, rather than any ‘real’ issues with access to healthcare, but in the ‘on demand’ world we live in, where easy sign-up and zero-friction on-boarding is king, access also means getting the right medical ‘product’ at the time you need it. This is the advancement in healthcare that I’m most excited about. Products are now being delivered directly to the patient – which is preferable to leaving them at the mercy of the doctor’s calendar." \
           "The new meaning of ‘over the counter’ In grocery stores fifty years ago, there used to be a clear divide between the consumers and the goods. Groceries could be accessed only through the shop clerk, who was the gatekeeper. It was useful to have someone from whom to advice, but over time, it became clear that it was a far better to be allowed to make their own decisions. The same switch is now happening in healthcare. Due to the improved access to information in the ‘WebMD’ era, people often have an idea of what is wrong with them when they are ill. Also, they are generally health-conscious, and therefore keen to ensure they remain healthy today’ so they don’t become a patient tomorrow. Due to this change in behavior and improved access to information, there is now room in the market for consumer-grade healthcare products and digital tools to ensure these products are available to large audiences, in new ways. Those who successfully build consumer products and brands in healthcare will win big in the next few years. Medical data is ripe for change. Our data is currently hidden in disparate patient records, but is becoming our own again thanks to platforms like PatientsKnowBest (full disclosure, Balderton is invested). Digital tools are also changing how we manage diseases. Behavior change programs are being turned into products, and scaled across a previously impossible large number of patients. This is particularly powerful when tackling healthcare problems that affect a nation of people, and emanate from poor lifestyle."

    print('Keywords: ')

    pos_filter = ['JJ', 'CC', 'CD', 'DT', 'JJ', 'EX', 'RB', 'WRB', 'WP$', 'WP', 'VB']
    print(keywords(text, ratio=0.1, pos_filter=pos_filter, split=True))


def ner():
    import spacy
    en_nlp = spacy.load('en')
    en_doc = en_nlp(u'Donald John Trump (born June 14, 1946) is the 45th and current President of the United States. Before entering politics, he was a businessman and television personality. '
                    u'Trump was born and raised in Queens, New York City, and earned an economics degree from the Wharton School. Later, he took charge of The Trump Organization, the real estate and construction firm founded by his paternal grandmother, which he ran for 45 years until 2016. During his real estate career, Trump built, renovated, and managed numerous office towers, hotels, casinos, and golf courses. Besides real estate, he started several side ventures and has licensed the use of his name for the branding of various products and properties. He produced and hosted The Apprentice, a reality television series on NBC, from 2004 to 2015. His net worth was estimated to be $3.5 billion as of 2017, making him the 544th richest person in the world.'
                    u'Trump first publicly expressed interest in running for political office in 1987. He won two Reform Party presidential primaries in 2000, but withdrew his candidacy early on. In June 2015, he launched his campaign for the 2016 presidential election and quickly emerged as the front-runner among seventeen candidates in the Republican primaries. His remaining opponents all suspended their campaigns by the end of May 2016, and in July he was formally nominated at the Republican National Convention along with Indiana governor Mike Pence as his running mate. His campaign received extensive media coverage. Many of his public statements were controversial or false. Trump won the general election on November 8, 2016, in a surprise victory against Democratic opponent Hillary Clinton, and commenced his presidency on January 20, 2017. He became the oldest and wealthiest person ever to assume the presidency, the first without prior military or government service, and the fifth to have won election while losing the popular vote. His political positions have been described by scholars and commentators as populist, protectionist, and nationalist.')

    for ent in en_doc.ents:
        print(ent.text + ' ' + ent.label_)
        # if ent.label_ == 'PRODUCT':
            # yield ent

# smoke_test()
# prepare_model("./models/raw/sherlock.txt", "./models/sherlock_corpus.json")
# prepare_model("./models/news3.txt", "./models/news_corpus.json")
# prepare_books_models()
# prepare_wiki_model()
# prepare_clean_json()
# smoke_test_ready_model()
# suggest('the other', max_overlap_ratio=100, max_overlap_total=100, test_output=False)
# handle_csv()
# convert_csv()

# redis_test()
# prepare_redis_model('./models/marcin_rapacz.txt', "rapacz", 1)
# prepare_redis_letter_model('./models/books/1.txt', "letter", 1)
# prepare_redis_model_from_source('./models/news.json', "news")
# prepare_books_redis_models()
# prepare_books_redis_letter_model()
# test_autocomplete('without','the')
# gensim_keywords()
# prepare_books_redis_models(4)
ner()