---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import ReactComponent from '../../components/ReactComponent.jsx'
title: Hello world!
publishDate: 12 Sep 2021
name: robalb
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
