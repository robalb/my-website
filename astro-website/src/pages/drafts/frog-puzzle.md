---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import Picture from '../../components/Picture.astro'
  import Froggle from '../../components/froggle/Froggle.astro'
title: Solving kid's puzzles with bruteforce and bloom filters
publishDate: 2023-09-19
description: 
tags: ['programming']
permalink: https://halb.it/posts/the-story-of-the-frog-puzzle/
---

This is the story of that time I couldn't solve a kid's puzzle, so I recreated it to share that feeling with others.
It's also the story of my first steps into the world of c wasm development.

There is a very nice puzzle board game that is designed to teach logic
to children. It works like this: you win when you drag the star into one of the green holes. You can only drag the star over tiles that are not empty. The game below can be solved in two moves, try it! 

<Froggle prevBt={false} nextBt={false} showLevel={false} level={2}/>

there are also draggable items, that can help you move the star where you want

<Froggle prevBt={false} nextBt={false} showLevel={false} level={4}/>



