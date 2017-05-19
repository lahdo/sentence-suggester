import markovify
import json
from suggester import Text

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
        # print(row[1])
        # print(row[2])
        print(row[1], file=jsonfile)
        print(row[2], file=jsonfile)

        # json.dump(row, jsonfile)
        # jsonfile.write('\n')
# ...     spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
# ...     for row in spamreader:
# ...         print(', '.join(row))


def convert_csv():
    import json

    with open('./models/news.json', 'r') as data_file:
        model = json.load(data_file)

    for item in model:
        print(model["last_crawl_date"])
        print(model["title"])

    # with open('./models/raw/news.txt', 'w') as text_file:
    #     for item in model:
    #         print(model["last_crawl_date"])
    #         print(model["title"])
    #
    #     text_file.write("Purchase Amount: %s" % TotalAmount)



    # fieldnames = ("body","title","last_crawl_date","id")
    # reader = csv.DictReader(csvfile, fieldnames)
    # for row in reader:
    #     json.dump(row, jsonfile)
    #     jsonfile.write('\n')

# smoke_test()
# prepare_model("./models/raw/sherlock.txt", "./models/sherlock_corpus.json")
prepare_model("./models/news3.txt", "./models/news_corpus.json")
# prepare_clean_json()
# smoke_test_ready_model()
# suggest('the other', max_overlap_ratio=100, max_overlap_total=100, test_output=False)
# handle_csv()
# convert_csv()