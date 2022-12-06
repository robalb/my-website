---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import Picture from '../../components/Picture.astro'
title: A simple guide to CAMAC systems with the PCI-CC32 controller
subtitle: 
publishDate: 2022-12-6
description: CAMAC systems with wiener cc32 controller, a simple guide for nuclear physicists with a deadline
tags: ['CAMAC', 'physics', 'hardware']
permalink: https://halb.it/posts/camac-cc32/
---

The goal of this guide is to teach nuclear physicists with a deadline the minimal
information required to write C programs that interface to CAMAC systems, without the confusing parts

## What is a CAMAC system?

CAMAC is a [modular crate system](https://en.wikipedia.org/wiki/Modular_crate_electronics) used in the nuclear and particle physics industry for data aquisition. <br> In practical terms a CAMAC system is a metallic cabinet, called a **CRATE**, in which electronic modules can be inserted.

A CRATE has 24 stations, numbered 1-24 in which a module can be inserted.<br>
station 25, the rightmost station, is reserved for a **CRATE CONTROLLER** whose
purpose is to issue **CAMAC COMMANDS** to the modules and transfer information between a computer and the modules.

In this article we are going to focus on a specific CRATE CONTROLLER: the
[PCI-CC32](http://www.chem.ucla.edu/~craigim/pdfmanuals/manuals/Man-PciCc32-A1.pdf)
from ARW Elektroniks Which connects to a Linux computer.

<Picture src="camac-crate" height={490} alt="A bright red web page showing an error message: Your request have been blocked! We detected an attept to attack this website.  mod_insecurity online protection™ blocked your request.  Your request have been logged. Logged requests: 17265 " />

Highlighted in this picture: A CAMAC CRATE in the wild. Station 12, 16, and 21 are occupied by some modules.
Station 24-25 is occupied by the CRATE CONTROLLER. You can see the cable that connects it to the computer.
<br/>


Some modules just draw power from the crate, and have all of their data inputs and outputs on the front plate.<br/>
Other modules also take inputs or CAMAC COMMANDS from the CRATE CONTROLLER connected to the computer. We are interested in these modules since ultimately our goal is to control them with the computer.

### what is a CAMAC command ?

As we mentioned, a CRATE CONTROLLER can issue a CAMAC COMMAND.
These commands are often expressed in the following notation:

```
    N()  A()  F() [optional data]
```

- N is the station number, an integer in the range 1-24.
  For example N(2) will select the station in position 2. (station and module are synonims)
- A is a subaddress, an integer in the range 0-15. For example if we are talking to a module that has 8 different registries, we can specify the first register with A(0), the second register with A(1) and so on.
- F is the function code to be performed at the selected module and subadress.
  If you want to know the function codes supported by a module you will have to read its documentation.

In response a module will generate an X (command accepted)
and Q (response) signals. For simplicity, you can see X and Q as two boolean variables.

Up to 24 bits of additional data can be transferred between the CRATE CONTROLLER
and the selected module when a NAF command is sent.<br/>
You must read the documentation of a module to know the function codes that it supports, but in general:
- Function codes in the range 0-7 are read commands:
  they can return additional data other than Q and X
- Function codes in the range 16-23 are write commands:
  they accept additional data other than N, A, F, that will be sent to the module


### The Look At Me signal

A CAMAC module can generate a **Look At Me** (L) signal at any time, to indicate to the CRATE CONTROLLER
that it requires attention.
The documentation of a module will describe when it will activate these signals, and the functions
to enable, disable, or reset them.

You don't have to worry too much about these signals for now, just know that they exist.


### special commands

A CAMAC CONTROLLER can also issue special
commands that are sent to all the CAMAC modules simultaneously:

- (Z) INITIALIZE: It sets all modules to a basic state by resetting all registers and resetting all L signals (look at me) and disabling them where possible.

- (I) INHIBIT ON / OFF: when inhibit is ON, any activity such as data taking is inhibited

- (C) CLEAR: clear all registers in the modules connected to the crate.

As always, the way a module reacts to Z, I, or C commands is described in its documentation. Often Z and C have the same effect on a module


### controlling a CAMAC crate with a C program

> We are going to assume that the libcc32 library and kernel driver are already correcly installed on your computer. In other words: Someone already installed everything, you only need to figure out how things work. This is common in most lab setups.

If your computer is setup correctly, you should be able to import the `libcc32.h` in a c program.

Let's see how you can use this library to interact with a CAMAC CRATE


#### connecting to the crate

In Linux everything is a file. Following this philosophy, even a CAMAC CRATE when it's connected to the computer is a file.<br>
It is a special file, usually called cc32_1, and it's located in the `/dev` folder. If you have multiple crates connected to your computer, you will have multiple files in the `/dev` folder. You can find them by writing in
a terminal the command `ls /dev`

If you ever wrote a c program that reads from a file these concepts will be very familiar to you:
Normally, when you want to interact with a file you must open a connection to it and store it in a special FILE variable, also
referred to as FILE handle.

Similarly, if we want to interact with a crate we must open a connection to it and store it in a special CC32_HANDLE variable.

In practical terms this can be done with the following code


```c
//the file libcc32.h must be in the same folder of this program
#include "libcc32.h"

//the device file where your CAMAC CRATE can be accessed
#define DEVICE_NAME "/dev/cc32_1"

//define the special variable that will store the connection to the CAMAC CRATE
CC32_HANDLE handle;

int main(int argc, char *argv){
  //open the connection to the crate
  error = cc32_open(DEVICE_NAME, &handle);
  //close the program with an error if the connection to the crate failed
  if(error){
    fprintf(stderr, "%s", strerror(error));
    exit(1);
  }

  /*
   *
   * put the rest of the code here
   *
   */

  //close the connection to the crate
  cc32_close(&handle); 
}


```

#### NAF commands

Once you have an open connection to the crate, you can use the functions defined in the library to issue
NAF commands.<br>
The library makes a distinction between two types of commands:

- write commands: they are composed of N, A, F, and the additional data that you want to write into the selected module
- read commands: they are composed of N, A, F, and they return some data from the selected module

Keep in mind that if you want to send a NAF command to a module that doesn't expect any data you can use a write command, and set the data to 0 or any value. The module will simply ignore it.

Here is a list of all the functions provided by the library:



```c

/* read only a word - 16 bits - from a address made out of N,A,F */
__u16 cc32_read_word(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F);

/* read only a word - 16 bits - from a address made out of N,A,F, get Q and X */
__u16 cc32_read_word_qx(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, int *Q, int *X);

/* read a long - 32 bits - from a address made out of N,A,F and get the result Q and X */
__u32 cc32_read_long(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F);

/* read a long - 32 bits - from a address made out of N,A,F get Q and X */
__u32 cc32_read_long_qx(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, int *Q, int *X);

/* read a long - 32 bits - without any interpretaion */
__u32 cc32_read_long_all(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F);

/* write a word - 16 bits - to a destination made out of N,A,F */
void  cc32_write_word(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, __u16 uwData);

/* write a word - 16 bits - to a destination made out of N,A,F, get Q and X */
void  cc32_write_word_qx(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, __u16 uwData, int *Q, int *X);

/* write a long - 32 bits - uninterpreted to a destination made out of N,A,F */
void  cc32_write_long(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, __u32 ulData);

/* write a long - 32 bits - uninterpreted to a destination made out of N,A,F, get Q and X */
void  cc32_write_long_qx(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, __u32 ulData, int *Q, int *X);
```


example: This made-up NAF command: N4*A1*F16
can be sent with this function call

    cc32_write_word (handle, 4, 1, 16, 0);  //call function 16 on module 4, subaddress 1


#### special commands

The CC-32 CAMAC CONTROLLER supports special commands 
that are expressed in NAF notation but that are not destined to a real module, and instead have a special meaning.
The most important ones are:

- (in all these commands Fx is any integer >= 16)
- `N0*A0*Fx`  (Camac Clear)
- `N0*A1*Fx`  (Camac Initialize)
- `N0*A2*Fx`  (Camac Clear + Inhibit off)
- `N0*A3*Fx`  (Camac Initialize + Inhibit On)
- `N27*A0*Fx`  (Inhibit On)
- `N27*A1*Fx`  (Inhibit Off)


You can use them in the same way you issue normal NAF commands:

```cpp
cc32_write_word (handle, 0, 0, 16, 0);  //camac clear (C)
cc32_write_word (handle, 0, 1, 16, 0);  //camac initialize (Z)
cc32_write_word (handle, 27, 0, 16, 0); //set inhibit (I on)
cc32_write_word (handle, 27, 1, 16, 0); //reset inhibit (I off)
```

All these commands are described in details in a table in section 3.3 of the 
[PCI-CC32 hardware manual](http://www.chem.ucla.edu/~craigim/pdfmanuals/manuals/Man-PciCc32-A1.pdf),
A simplified and more readable documentation is available in section 7.3 of the 
[library documentation](http://mu2e.phy.duke.edu/cw/CAMAC/Wiener/CD36/PciCamac/Pcicc32W95NT-A1.pdf)


### Reading documentation

The only way to know the correct NAF commands to send to a module is to read the module documentation.
Here is an example

### Further reading

In this article I tried to abstract away any reference to the low-level hardware operations, in the spirit of
keeping things as simple as possible. If you want
more details I suggest to read the [camac eur4600 standard](https://core.ac.uk/download/pdf/132578818.pdf)
and the [PCI-CC32 hardware manual](http://www.chem.ucla.edu/~craigim/pdfmanuals/manuals/Man-PciCc32-A1.pdf)

The best documentation for the libcc32 library I could find is in section 7.3 of the 
[PCI-CC32 library documentation](http://mu2e.phy.duke.edu/cw/CAMAC/Wiener/CD36/PciCamac/Pcicc32W95NT-A1.pdf)

The source code for the kernel drivers and other useful resources can be found with a quick [Google search](https://f9pc00.ijs.si/f9daqsvn/listing.php?repname=f9daq&path=%2Fdrivers%2Fpcicc32-linux%2F&rev=156&peg=156#ab8dbd44c7da7a2381c0b651938865afa)


