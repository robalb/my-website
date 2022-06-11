---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import ReactComponent from '../../components/ReactComponent.jsx'
title: Hello world!
publishDate: Sep 12, 2020
name: robalb
author: Alberto Ventafridda
value: 128
description: Just a Hello World Post!
tags: ["writeup", "web"]
---

This is a simple markdown post
Lorem ipsum

<ReactComponent name={frontmatter.name}  client:load />



Do variables work {frontmatter.value * 2}?

[this is a link](https://asdasd.as)

asd a
sd asd asda sdasd asd asdasdasd asd adsads ads 

## and now for something different

asdasd asdasdasasd asdasd asdasda asd `codeinli` asd asdasdasd asdasd asdasda
as a asasas asdasdasd asd sdsdss dsadasd asd

asdasd *asdasd* asdasda sd as

- asdasd
- wd d asd
- asdasd

```js
// Example JavaScript

const x = 7;
function returnSeven() {
  return x;
}

```

```bash
alias k='kubectl'

```

```vim
nnoremap q qq

```
