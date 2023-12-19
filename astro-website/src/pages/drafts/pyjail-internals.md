---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import PictureThemed from '../../components/PictureThemed.astro'
title: the python internals behind a pyjail challenge
publishDate: 2023-11-2
description: writeup and python internals walktrough - bluehens ctf 2023
tags: ['writeup', 'python', 'pyjail']
permalink: https://halb.it/posts/pyjail-internals/
---

https://blog.pepsipu.com/posts/albatross-redpwnctf

https://wapiflapi.github.io/2013/04/22/plaidctf-pyjail-story-of-pythons-escape.html

https://flagbot.ch/posts/pyaucalc/

Pyjails are common ctf puzzles.
The premise of these challenges is very simple:
user input is read from a python script running in a remote environment.
It is sanitized, and then it's executed using `exec`

Solving these challenges is usually a great lesson in python internals, and a reminder that no matter how much effort you put into sanitizing data, executing untrusted user code in complex environments is always a bad idea.


```python
cmds = input("Enter your python code > ")
exec(cmds, {'__builtins__': None}, {})
```

### python builtins

Remember that our goal is to write something like this, in order to access the flag:
```python
print(open("/flag").read())
```

or this:

```python
import os; os.system('/bin/sh')
```

Unfortunately the code is being executed in an environment without [builtins](https://docs.python.org/3/library/functions.html). Have you ever wondered why you can just call `print` or `open` without having to import the functions into your code first? The answer is that they are part of the builtins, a list of common functions that python will automatically import for you

Without builtins we cannot call `print` or `open`. Even worse, we cannot use the `import` statement, because the import functionality is handled by the `__import__()` builtin function

>TODO: explain distinction between builtin=(no need to import, it's in the builtin namespace) and builtin=(code is part of the interpreter, eg written in c)
>https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces


---

```python
a = 1
dir(a)
```

