---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import Picture from '../../components/Picture.astro'
title: Tips for interactive debugging in pwntools
publishDate: 2023-09-19
description: How Ipython can enhance your pwntools debugging session
tags: ['pwntools', 'pwn', 'gdb']
permalink: https://halb.it/posts/pwntools-gdb/
---

This post is mostly written for myself, since i keep forgetting this kind of commands

Long story short, pwntools makes it very easy to run gdb with the process you are interacting with.
The setup is pretty straightforward, [this guide](https://github.com/Gallopsled/pwntools-tutorial/blob/master/debugging.md) covers pretty much everything you need to know about it.

This is how you launch a process under gdb, maintaining control over its IO

```python
from pwn import *

local_file = './babyrev_level6.0'
p = gdb.debug(local_file)

p.interactive()
```

the last command is very important because it prevents the script from quitting.
Without it the script would immediately reach its end, quitting itself and the 
gdb child process it had just launched

There is a better alternative to 
`p.interactive()` however that I find useful for quick debugging sessions:
using `Ipython.embed()` to launch an interactive python shell from within the script


```python
from IPython import embed
from pwn import *

local_file = './babyrev_level6.0'
p = gdb.debug(local_file)

embed()

```

This will also prevent the script from quitting, by opening an interactive python shell next to the gdb window.
You can use the shell to interact with the process running in gdb, inspecting the results in real time.
The nice part is that all variables or imports you defined in the script will remain available in the interactive shell

This is an example usage from an old ctf challenge:

```python
from IPython import embed
from pwn import *

# i'm working on linux, amd64
context.update(arch='amd64', os='linux')
# i'm running this script from a tmux terminal. 
# with this configuration, pwntools will open the gdb session in
# a new horizontal tmux pane, instead of the default verical pane
context.terminal = ['tmux', 'splitw', '-h']

local_file = './babyrev_level6.0'
key = [
        0x25, 0xD7, 0x4C, 0xE4, 0x19, 0x9D, 0x2C, 0xC4,
        0x44, 0xE7, 0x1A, 0x91, 0x26, 0xD2, 0x4B, 0xE3
    ]
p = gdb.debug(local_file)

# an alternative to this: write your code inside a function.
# launch interactive python shell, import the function from there
embed()

```

Since i'm using tmux, i've confgured it to open gdb in a horizontal split pane.
In the left pane i can run commands to interact with the process,
in the right pane i can use gdb to inspect the results

<Picture src="gdb-tips" height={450} alt="Screenshot of a tmux terminal split vertically into two panes. The pane on the left is an interactive python shell. It has received the input: p.send(bytearray(key)). The pane on the right is a gdb session whth the gef plugin enabled. You can see registers, stack and current instruction for a process called ./babyrev_level6.0. The program is about to run a call to glibc readline" />

<br/>












