---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import Picture from '../../components/Picture.astro'
title: Interactive debugging in pwntools
publishDate: 2023-09-19
description: How Ipython can enhance your pwntools debugging session
tags: ['pwntools', 'pwn', 'gdb']
permalink: https://halb.it/posts/pwntools-gdb/
---

This post is mostly written for myself, since i keep forgetting this kind of commands

Long story short, pwntools makes it very easy to run gdb with the process you are interacting with.
The setup is pretty straightforward, [this guide](https://github.com/Gallopsled/pwntools-tutorial/blob/master/debugging.md) covers pretty much everything you need to know about it.

This is the easiest way to do it. Pwntools will launch gdb in a new terminal window, and you will maintain your ability to interact with the process in the usual ways


```python
from pwn import *

local_file = './some_example_elf'
p = gdb.debug(local_file)

p.interactive()
```

In this snippet `p.interactive()` is very important because it prevents the script from quitting.
Without it the script would immediately reach its end, quitting itself and the 
gdb child process it had just launched.

### Tmux integration

pwntools automatically detects your terminal type when opening the gdb window.
If you are using tmux it will automatically open a new pane, which is nice.
I like to customize the behaviour to open a new panel in a horizontal split

```python
context.terminal = ['tmux', 'splitw', '-h']
```

### interactive python shell

Sometimes i wanto to interact in real time with the process i'm debugging.
For this, there is a better alternative to 
`p.interactive()` that I find useful:


```python
from IPython import embed
from pwn import *

local_file = './some_example_elf'
p = gdb.debug(local_file)

embed()

```

`embed()`, similarly to `p.interactive()`, 
will also prevent the script from quitting, by starting an interactive python shell.
You can use the shell to run python code that interacts with the process, inspecting the results in real time.
The nice part is that all variables or imports you defined in the script will remain available in the interactive shell

This screenshots shows how it looks like in tmux:
In the left pane you can run commands to interact with the process,
in the right pane you can use gdb to inspect the results

<Picture src="gdb-tips" height={450} alt="Screenshot of a tmux terminal split vertically into two panes. The pane on the left is an interactive python shell. It has received the input: p.send(bytearray(key)). The pane on the right is a gdb session whth the gef plugin enabled. You can see registers, stack and current instruction for a process called ./babyrev_level6.0. The program is about to run a call to glibc readline" />

### gdbscript

You can use the `gdbscript` argument to specify some commands you want to run
every time you launch your process in gdb.
It can be useful to set up some break points for example, but be aware that this requires
some extra steps:

- Disable ASLR, with the argument `asrl=False`
- Manually find the base address that gdb uses when aslr is disabled.
  It usually is `0x00555555554000`, you can find it by running `vmmap` in gdb.
  I put this line in my `.gdbinit`:  `set $base = 0x00555555554000`
  so every time i need that value I can just use the `$base` variable I defined
 

```python
gdb_script = f"""
break *($base +0x168f)
break *($base +0x18c0)
"""

local_file = './some_example_elf'
p = gdb.debug(local_file, aslr=False, gdbscript=gdb_script)

```


### That's it

This is nothing new, but so far all these informations were scattered across old exploits, old notes or bookmarked documentation pages, and i really wanted to put them in one place.

This is a template script that includes everything i mentioned above:

```python
from IPython import embed
from pwn import *
context.update(arch='amd64', os='linux')
context.terminal = ['tmux', 'splitw', '-h']

local_file = './some_example_elf'
addr_before_check = "168f"
addr_after_check = "16b7"

gdb_script = f"""
break *($base +0x{addr_before_check})
break *($base +0x{addr_after_check})
"""

p = gdb.debug(local_file, aslr=False, gdbscript=gdb_script)

# here we are sending some bytes to the stdin of the process
some_bytes = b'aaa'
p.sendline(some_bytes)

embed()
#p.interactive()

```









