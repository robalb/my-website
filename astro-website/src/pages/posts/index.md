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
---

This is a simple markdown post

<ReactComponent name={frontmatter.name}  client:load />



Do variables work {frontmatter.value * 2}?

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
