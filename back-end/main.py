import markovify
import json
from suggester import Text, CorpusBuilder
import redis


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

def prepare_books_redis_models():
    for i in range(20):
        prepare_redis_model("./models/books/%s.txt" % str(i+1), "books")

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
    text_model = markovify.Text(text, state_size=2)

    corpus = CorpusBuilder(text_model=text_model, model_name=model_name, state_size=2)
    corpus.build()



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
prepare_redis_model('./models/news/news.txt', "news")
# prepare_books_redis_models()