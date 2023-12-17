---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import PictureThemed from '../../components/PictureThemed.astro'
title: pyjail escape without ascii characters and numbers - bluehens writeup
publishDate: 2023-11-1
description: writeup for the challenge calc - PingCTF 2023
tags: ['writeup', 'python', 'pyjail']
permalink: https://halb.it/posts/bluehens-pyjail/
---

### the challenge

The challenge code consisted in a very short python script, running behind netcat

```python
blacklist = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

security_check = lambda s: any(c in blacklist for c in s) or s.count('_') > 50

while True: 
    cmds = input("> ")
    if security_check(cmds):
        print("nope.")
    else:
        exec(cmds, {'__builtins__': None}, {})
    
```

For the uninitialized, this is a very common pyjail setup:

- The `security_check` function makes sure the user input does not contain any ascii letter or number

- if the input is valid, it is executed in an environment without any builtin

- By looking at the challenge Dockerfile, it's clear that our goal is to read the `/flag` file and print it

### python without letters or numbers

The Javascript language can be written using only combinations of the symbols `[]()!+` in a dialect known as [jsfuck](https://jsfuck.com).
Unfortunately python does not reach these levels of greatness, but it can get close.

These are the basic building blocks that python3 offers, thanks to its inplicit type conversion:

- `False`  => `[] > []`
- `True`   => `[[]] > []`
- `0` => `-([] > [])`
- `-1` => `~([] > [])`
- `1` => `-~([] > [])`
- `2` => `1+1` =>  `(-~[]<[])+(-~([]<[])) `

With some creativity, it's easy to create any number. There is the possibility for a lot of fancy optimizations if you are allowed to use `*, <<, >>` or other operators. The current challenge however does not have a payload size constraint, so we'll keep everything as simple as possible

```python
def craft_num(n):
    """
    craft symbol-only numbers, in an inefficient way
    """
    str_0 = "-([]<[])"
    str_1 = "(-~([]<[]))"
    if n == 0:
        return str_0
    ret = f"{str_1}+" * n
    return ret[:-1]
```

Unfortunately this is where we meet a wall, because python3 does not offer any way to create strings or execute statements with symbols only.
That was only possible in the age of python2 thanks to the 
&#96;
backtick operator, now removed from the standard, that acted as an alias for the `repr()` function.

### filter bypass using utf-8 identifiers

If python3 broke the dream of a symbols-only python dialect, it also brought 
UTF-8 identifiers to the standard.
In our case, that feature is good enough to bypass the no-ASCII filter.<br/>
Quoting [the reference](https://docs.python.org/3/reference/lexical_analysis.html#identifiers):

> Python 3.0 introduces additional characters from outside the ASCII rannge. [...]
All identifiers are converted into the normal form NFKC while parsing; comparison of identifiers is based on NFKC.

what does that mean?
The Unicode standard supports the concept of [equivalence](https://www.wikiwand.com/en/Unicode_equivalence#/Normal_forms).
If we look at this useful page for the [codepoint for the letter a](https://www.compart.com/en/unicode/U+0061) for example,
we can see a long list of equivalent codepoints.
These are all symbols that are declaratively similar in appearance or meaning to the ASCII letter 'a'. Here are some examples:

- U+1D4B6 𝒶 Mathematical Script Small A
- U+1D4EA 𝓪 Mathematical Bold Script Small A
- U+1D552 𝕒 Mathematical Double-Struck Small A
- U+1D586 𝖆 Mathematical Bold Fraktur Small A

All these fancy codepoints will be converted into the correct ASCII letter when [normalized](https://unicode.org/reports/tr15/#Norm_Forms), which is an operation designed to simplify utf-8 string comparisons.
Since python3 normalizes all identifier characters before executing them,
All we have to to to bypass the filter is to replace all ASCII letters with one of the many utf-8 equivalences.

For this exploit I choose the rather boring
[ｆｕｌｌｗｉｄｔｈ ｌｅｔｔｅｒｓ](https://www.compart.com/en/unicode/U+FF41)

```python
def denormalize(str):
    ret = ""
    for c in str:
        if c >= "a" and c <= "z":
            # https://www.compart.com/en/unicode/U+FF41
            # weird fullwidth a
            # the first of a sequence of codepoints compatible with ASCII letters
            weird_a = 0xff41
            offset = ord(c) - ord("a")
            ret += chr(weird_a + offset)
        else:
            ret += c
    return ret

 denormalize("__class__.__base__.__doc__")
'__ｃｌａｓｓ__.__ｂａｓｅ__.__ｄｏｃ__'
```







Let's tackle the problem in a reverse order, and let's pretend that there is no security check.
In fact, since we have al the challenge files, we can temporarily remove the security check and run the code locally

Now 

```python
print(open('/flag.txt').read())
```

unfortunately the code is being executed in an environment without builtins:

