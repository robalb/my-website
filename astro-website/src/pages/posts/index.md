---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import ReactComponent from '../../components/ReactComponent.jsx'
title: Hello world!
publishDate: Sep 12, 2022
name: robalb
author: Alberto Ventafridda
value: 128
description: Just a Hello World Post!
tags: ["writeup", "web"]
---

This is a simple markdown post
It's been a while since I've written anything due to some personal concerns that I might write about later, but don't worry, I'm still around and I'm still coding. Recently, I went to Texas and bought a three-row diatonic button accordion. Diatonic accordions are popular for a lot of different types of folk music, which is generally learned by ear. This is good for me, because I don't really know how to read music anyway.

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
