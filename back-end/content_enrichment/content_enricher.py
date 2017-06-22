import wikipedia


# https://github.com/goldsmith/Wikipedia

def search_wikipedia(query):
    results = []
    keyword = query['keyword']

    wiki_pages_names = wikipedia.search(keyword)

    if (len(wiki_pages_names)):
        for wiki_page_name in wiki_pages_names:
            try:
                summary = wikipedia.summary(wiki_page_name)
                wiki_page = wikipedia.page(wiki_page_name)

                results.append(
                    {
                        "summary": summary,
                        "title": wiki_page.title,
                        "url": wiki_page.url,
                        "images": wiki_page.images
                    })
            except wikipedia.exceptions.DisambiguationError as e:
                a=1
                # print e.options

    return results
