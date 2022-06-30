
## TODO

- rich content https://search.google.com/test/rich-results
- projects page
x - rename /me in /about
- better third person description
x- tag system: add tags in html of each blogpostentry,
  use them to filter at runtime
- analitics https://grafana.com/grafana/dashboards/13865
- add strict transport security header, feature policy header

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


