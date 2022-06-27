
## TODO

- self-host google fonts
x- write third person description, put it as default
  in headers

- pipeline: add autocommit (bonus: debug autocommit in morse)

- fix headers not sent in 404 (add always directive)

- rich content https://search.google.com/test/rich-results


## headers, titles, third person descritption

###all pages:
 canonical: [pageurl]
og:type: website
og:url: [pageurl]
twitter:card content=summary
og:site_name: halb.it

###homepage

title, og:title, twitter:title: Alberto Ventafridda

description, og:description, twitter:description: [thidr person descr]


###page (/about /uses /writing /projects) => [page]

title, og:title, twitter:title: [pagetitle] - Alberto Ventafridda

description, og:description, twitter:description: [pagedescr] page for alberto ventafridda's blog

###article

og:type: article

title, og:title, twitter:title: [article title]
description, og:description, twitter:description: [article description (exact copy of article subtitle if exists)]


