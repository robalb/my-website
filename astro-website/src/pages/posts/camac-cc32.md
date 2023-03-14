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
[PCI-CC32](https://manualzz.com/doc/o/a55u3/manual-cc32-controller)
from ARW Elektroniks Which connects to a Linux computer.

<Picture src="camac-crate" height={490} alt="A bright red web page showing an error message: Your request have been blocked! We detected an attept to attack this website.  mod_insecurity online protection™ blocked your request.  Your request have been logged. Logged requests: 17265 " />

_Highlighted in this picture: A CAMAC CRATE in the wild. Station 12, 16, and 21 are occupied by some modules.
Station 24-25 is occupied by the CRATE CONTROLLER. You can see the cable that connects it to the computer._
<br/>


Some modules just draw power from the crate, and have all of their data inputs and outputs on the front plate.<br/>
Other modules also take inputs or CAMAC COMMANDS from the CRATE CONTROLLER connected to the computer. We are interested in these modules since ultimately our goal is to control them with the computer.

### What is a CAMAC command ?

As we mentioned, a CRATE CONTROLLER can issue a CAMAC COMMAND.
These commands are often expressed in the following notation:

```
    N()  A()  F()
```

- N is the station number, an integer in the range 1-24.
  For example N(2) will select the station in position 2. (station and module are synonyms)
- A is a subaddress, an integer in the range 0-15. For example if we are talking to a module that has 8 different registries, we can specify the first register with A(0), the second register with A(1) and so on.
- F is the function code to be performed at the selected module and subadress.
  If you want to know the function codes supported by a module you will have to read its documentation.

When a command is issued, the selected module will respond with an X signal (indicating that the command was accepted) and a Q signal, whose meaning depends on the function code of the command.
You can see X and Q as two boolean variables.<br>
Additionally, up to 24 bits of data can be transferred with each command

### The Look At Me signal

A CAMAC module can generate a **Look At Me** (L) signal at any time, to indicate to the CRATE CONTROLLER
that it requires attention.
The documentation of a module will describe when it will activate these signals, and the functions
to enable, disable, or reset them.

You don't have to worry too much about these signals for now, just know that they exist.


### Special commands

A CAMAC CONTROLLER can also issue special
commands that are sent to all the CAMAC modules simultaneously:

- (Z) INITIALIZE: It sets all modules to a basic state by resetting all registers and resetting all L signals (look at me) and disabling them where possible.

- (I) INHIBIT ON / OFF: when inhibit is ON, any activity such as data taking is inhibited

- (C) CLEAR: clear all registers in the modules connected to the crate.

As always, the way a module reacts to Z, I, or C commands is described in its documentation. Often Z and C have the same effect on a module


### Controlling a CAMAC crate with a C program

> We are going to assume that the libcc32 library and kernel driver are already correcly installed on your computer. In other words: Someone already installed everything, you only need to figure out how things work. This is common in most lab setups.

If your computer is setup correctly, you should be able to import the `libcc32.h` in a c program.<br>
Let's see how you can use this library to interact with a CAMAC CRATE


#### connecting to the crate

In Linux everything is represented as a file. That's right, even the internet is a file! You shouldn't be surprised that this includes CAMAC crates.<br>
When a crate is connected to the computer it appears as a special file in the `/dev` folder, usually called cc32_1.
If you have multiple crates connected to your computer, you will see multiple files in the `/dev` folder.
You can find them by running the command `ls /dev` in a terminal.

If you've ever written a C program that reads from a file these concepts will be very familiar to you:
Normally, when you want to interact with a file you need to open a connection to it and store it in a special FILE variable, also
referred to as FILE handle.

Similarly, if you want to interact with a crate you need to open a connection to it and store it in a special CC32_HANDLE variable.

In practical terms this can be done with the following code


```c
#include "libcc32.h"

//the device file where your CAMAC CRATE can be accessed
#define DEVICE_NAME "/dev/cc32_1"

//define the special variable that will store the connection to the CAMAC crate
CC32_HANDLE handle;

int main(int argc, char *argv){
  //open a connection to the crate and "store" it in the handle variable
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

#### Read and Write commands

Once you have an open connection to the crate, you can use the functions defined in the library to execute two type of commands:

- **WRITE** commands: they are composed of N, A, F, and the additional data that you want to write into the selected module.<br>
  Use write commands for all function codes >= 16, even if they don't expect any data: just set the data parameter to 0, it will be ignored.
  ```c
  /**
   Write 16 bits to an adress made out of N,A,F
  
  ARGS:
   CC32_HANDLE handle:  The variable where the 
                        current CAMAC CRATE connection is stored
   unsigned int N:  station N
   unsigned int A:  sub-address A
   unsigned int F:  function F, must be >= 16
   unsigned short data: 16 bit of data that will be sent to the selected module
  */
  cc32_write_word(handle, N, A, F, data);
  ```
- **READ** commands: they are composed of N, A, F, and they return some data from the selected module<br>
  Use read commands for all function codes < 16, even if they don't return any data
  ```c
  /**
   Read 24 bits from an adress made out of N,A,F and get the Q and X responses
  
  ARGS:
   CC32_HANDLE handle:  The variable where the 
                        current CAMAC CRATE connection is stored
   unsigned int N:  station N
   unsigned int A:  sub-address A
   unsigned int F:  function F, must be < 16
   int *Q:         pointer to the variable that will store the Q response.
                   The Q response can be 0 or 1
   int *X:         pointer to the variable that will store the X response.
                   The X response can be 0 or 1
  
  RETURNS:
   unsigned long (32 bits, of which only the first 24 will contain data)
   Note: This number will never be negative
   
   This function may fail at reading data
   The reading was successfull only if the Q and X responses are both equal 1
  */
  unsigned long data = cc32_read_long_qx(handle, N, A, F, &Q, &X);
  ```


The complete list of read and write functions is documented at the [end](#complete-library-documentation) of this article.

We all know that a code example is worth a thousand words so here is an example of code
that connects to a CAMAC CRATE, sends commands to a module and reads data from a module.

```c
#include "libcc32.h"

//the device file where your CAMAC CRATE can be accessed
#define DEVICE_NAME "/dev/cc32_1"

//MODULE_A is a module in the CAMAC station 2
#define MODULE_A 2
//MODULE_B is a module in the CAMAC station 3
#define MODULE_B 3

//define the special variable that will store the connection to the CAMAC crate
CC32_HANDLE handle;

int main(int argc, char *argv){
  //open a connection to the crate and "store" it in the handle variable
  error = cc32_open(DEVICE_NAME, &handle);
  //close the program with an error if the connection to the crate failed
  if(error){
    fprintf(stderr, "%s", strerror(error));
    exit(1);
  }

  /*
   Send a command to MODULE_A
   the function code for this command is >= 16 so we must use the write function,
   even when we don't want to write any data
  
   handle:     the connection to the CAMAC crate     
   MODULE_A:   the station number N                  
   0:          the substation number A               
   24:          the function code F                   
   0:  the data sent to the module, in this case it's just the number 0
  */
  cc32_write_word(handle, MODULE_A, 0, 24, 0);

  /*
   Send a command to MODULE_A
   the function code for this command is < 16 so we must use the read function,
   even when we don't want to read any data.
  
   handle:     the connection to the CAMAC crate     
   MODULE_A:   the station number N                  
   0:          the substation number A               
   10:          the function code F                   
  */
  cc32_read_word(handle, MODULE_A, 0, 10, 0);


  //A variable to store the 32 bit of data that the read function will return
  long int data;

  int Q;
  int X;

  /*
   Read data from MODULE_B
  
   handle:     the connection to the CAMAC crate     
   MODULE_B:   the station number N                  
   0:          the substation number A               
   2:          the function code F                   
   Q:  the variable where the Q response will be stored
   X:  the variable where the X response will be stored
  
   return 32 bits of data
  */
  data = cc32_read_long_qx(handle, MODULE_B, 0, 2, &Q, &X);

  //if the command was successful, print the returned data
  if(Q == 1 && X== 1){
    printf("Data received: %ld ", data);
  }
  else{
    printf("command failed! ");
  }

  //close the connection to the crate
  cc32_close(&handle); 
}


```

#### Special commands

The CC-32 CAMAC CONTROLLER supports special commands 
that are expressed in NAF notation but that are not destined to a real module, and instead have a special meaning.
The most important ones are:

- `N0*A0*F16`  (Camac Clear)
- `N0*A1*F16`  (Camac Initialize)
- `N0*A2*F16`  (Camac Clear + Inhibit off)
- `N0*A3*F16`  (Camac Initialize + Inhibit On)
- `N27*A0*F16`  (Inhibit On)
- `N27*A1*F16`  (Inhibit Off)


You can use them in the same way you issue normal NAF commands:

```cpp
cc32_write_word (handle, 0, 0, 16, 0);  //camac clear (C)
cc32_write_word (handle, 0, 1, 16, 0);  //camac initialize (Z)
cc32_write_word (handle, 27, 0, 16, 0); //set inhibit (I on)
cc32_write_word (handle, 27, 1, 16, 0); //reset inhibit (I off)
```

All these commands are described in details in a table in section 3.3 of the 
[PCI-CC32 hardware manual](https://manualzz.com/doc/o/a55u3/manual-cc32-controller)


### Complete library documentation

This is the documentation for all the functions in the `libcc32` library, updated to revision `0.9`.


#### Initialize and close functions

```c
/* Open a connection to a CAMAC crate

This function is used to open a connection to a CAMAC crate.
The crate appears in the file system as a special file in the /dev folder,
usually named cc32_1.

Args:
  filePath: a string that specifies the path to the crate's file in
            the file system, for example "/dev/cc32_1".
  handle: a pointer to a CC32_HANDLE variable where the connection
          to the crate will be stored. This handle must be passed 
          as an argument to most other functions in the libcc32 library
          in order to specify which crate to communicate with.

Returns:
  An integer error code, or 0 if the operation was successful.

*/
int  cc32_open(char *filePath, CC32_HANDLE *handle);

/* Close a connection to a CAMAC crate

This function is used to close a connection to a CAMAC crate.

Args:
  handle: the CC32_HANDLE variable that was returned by a previous call
          to the cc32_open function and contains the connection to the crate.

Returns:
  An integer error code, or 0 if the operation was successful.

*/
int  cc32_close(CC32_HANDLE handle); 
```

#### Read functions

```c
/* read 16 bits from an address made out of N,A,F

This function is used to read 16 bits from a CAMAC
address made up of the components N, A, and F.

Note that a CAMAC module can return up to 24 bits of data. 
Check the documentation of the module you are reading to make sure that
it will not return more than 16 bits, otherwise values bigger than 2^16
will be truncated

Args:
  handle: The special CC32_HANDLE variable where the current
          CAMAC CRATE connection is stored
  N: The station number N
  A: The sub-address A
  F: The function code F, must be < 16

Returns:
  The function returns the value read from the CAMAC address as an unsigned
  16-bit integer.

  This function may fail at reading data. 
  If you want to know the success status use the function cc32_read_word_qx
*/
unsigned int cc32_read_word(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F);

/* read 16 bits from an address made out of N,A,F

This function is used to read 16 bits from a CAMAC
address made up of the components N, A, and F.
It returns 16 bits of data, as well as the Q and X responses to the command.

Note that a CAMAC module can return up to 24 bits of data. 
Check the documentation of the module you are reading to make sure that
it will not return more than 16 bits, otherwise values bigger than 2^16
will be truncated

Args:
  handle: The special CC32_HANDLE variable where the current
          CAMAC CRATE connection is stored
  N: The station number N
  A: The sub-address A
  F: The function code F, must be < 16
  Q: pointer to the variable that will store the Q response.
     The Q response can be 0 or 1
  X: pointer to the variable that will store the X response.
     The X response can be 0 or 1

Returns:
  The function returns the value read from the CAMAC address as an unsigned
  16-bit integer

  This function may fail at reading data. 
  The reading was successfull only if the Q and X responses are both equal 1
*/
unsigned int cc32_read_word_qx(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, int *Q, int *X);

/* read 32 bits from an address made out of N,A,F

This function is used to read 32 bits from a CAMAC
address made up of the components N, A, and F.

Note that a CAMAC module can return only up to 24 bits of data, but
this function returns a 32 bit value.
This means that only the first 24 bits of the returned value will contain data.

Args:
  handle: The special CC32_HANDLE variable where the current
          CAMAC CRATE connection is stored
  N: The station number N
  A: The sub-address A
  F: The function code F, must be < 16

Returns:
  The function returns the value read from the CAMAC address as an unsigned
  long (32 bits, of which only the first 24 will contain data)
  Note: This number will never be negative

  This function may fail at reading data. 
  If you want to know the success status use the function cc32_read_long_qx
*/
unsigned long cc32_read_long(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F);

/* read 32 bits from an address made out of N,A,F and get the Q and X responses

This function is used to read 32 bits from a CAMAC
address made up of the components N, A, and F.
It returns 32 bits of data, as well as the Q and X responses to the command.

Note that a CAMAC module can return only up to 24 bits of data, but
this function returns a 32 bit value.
This means that only the first 24 bits of the returned value will contain data.

Args:
  handle: The special CC32_HANDLE variable where the current
          CAMAC CRATE connection is stored
  N: The station number N
  A: The sub-address A
  F: The function code F, must be < 16
  Q: pointer to the variable that will store the Q response.
     The Q response can be 0 or 1
  X: pointer to the variable that will store the X response.
     The X response can be 0 or 1

Returns:
  The function returns the value read from the CAMAC address as an unsigned
  long (32 bits, of which only the first 24 will contain data)
  Note: This number will never be negative

  This function may fail at reading data. 
  The reading was successfull only if the Q and X responses are both equal 1

*/
unsigned long cc32_read_long_qx(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, int *Q, int *X);


/* read 24 bits from an address made out of N,A,F and return an unfiltered response

You probably don't need this function.
Check out cc32_read_long_qx as an alternative

This function is used to read 24 bits from a CAMAC
address made up of the components N, A, and F.
WARNING: The 32-bit word returned is NOT the data read from the module,
it is the 32-bit DATAWAY content as described in 
section 3.3 of the PCI-CC32 hardware manual

-----------------------------------------
| D31 | D30 | D29 ... D24 | D23 ... D00 |
-----------------------------------------
| Q   | X   | 0           | R23 ... R00 |
-----------------------------------------

Args:
  handle: The special CC32_HANDLE variable where the current
          CAMAC CRATE connection is stored
  N: The station number N
  A: The sub-address A
  F: The function code F, must be < 16

Returns:
  The function returns 32 bit of unsigned DATAWAY data in the format described above

*/
__u32 cc32_read_long_all(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F);
```

#### Write functions

```c
/* write 16 bits to an address made out of N,A,F

This function is used to write 16 bits to a CAMAC
address made up of the components N, A, and F.

Note that with this function you can only send 16 bit of data:
values bigger than 2^16 will be truncated

This function may fail at writing data.
If you want to know the X and Q responses to the command use
the function cc32_write_word_qx

Args:
  handle: The special CC32_HANDLE variable where the current
          CAMAC CRATE connection is stored
  N: The station number N
  A: The sub-address A
  F: The function code F, must be >= 16
  data: the unsigned short that will be sent to the selected module
*/
void  cc32_write_word(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, __u16 data);

/* write 16 bits to an address made out of N,A,F and get the Q and X responses

This function is used to write 16 bits to a CAMAC
address made up of the components N, A, and F.
It returns the Q and X responses to the command.

Note that with this function you can only send 16 bit of data:
values bigger than 2^16 will be truncated

This function may fail at writing data. 
The writing was successfull only if the Q and X responses are both equal 1

Args:
  handle: The special CC32_HANDLE variable where the current
          CAMAC CRATE connection is stored
  N: The station number N
  A: The sub-address A
  F: The function code F, must be >= 16
  data: the unsigned short that will be sent to the selected module
  Q: pointer to the variable that will store the Q response.
     The Q response can be 0 or 1
  X: pointer to the variable that will store the X response.
     The X response can be 0 or 1

*/
void  cc32_write_word_qx(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, __u16 data, int *Q, int *X);

/* write 32 bits UNFILTERED to an address made out of N,A,F

You probably don't need this function.
Check out cc32_write_word as an alternative

WARNING: The 32-bit data is NOT what it will be sent to the selected module,
it is the 32-bit DATAWAY content as described in 
section 3.3 of the PCI-CC32 hardware manual

-----------------------------------------
| D31 | D30 | D29 ... D24 | D23 ... D00 |
-----------------------------------------
| Q   | X   | 0           | R23 ... R00 |
-----------------------------------------
*/
void  cc32_write_long(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, __u32 ulData);

/* write 32-bits UNFILTERED to an address made out of N,A,F and get the Q and X responses

You probably don't need this function.
Check out cc32_write_word_qx as an alternative

WARNING: The 32-bit data is NOT what it will be sent to the selected module,
it is the 32-bit DATAWAY content as described in 
section 3.3 of the PCI-CC32 hardware manual.

-----------------------------------------
| D31 | D30 | D29 ... D24 | D23 ... D00 |
-----------------------------------------
| Q   | X   | 0           | R23 ... R00 |
-----------------------------------------

*/
void  cc32_write_long_qx(CC32_HANDLE handle, unsigned int N, unsigned int A, unsigned int F, __u32 ulData, int *Q, int *X);
```

#### other functions

> Warning: This sections is still a work in progress. Right now it's not very useful as it's just a list of all the declarations in the library header file with some added notes

```c
/* poll the state of the timeout line and the LAM state. The timeout line is cleared if it was set

Read the hardware manual, section 3.8, 3.9, 3.10, 3.11

EXAMPLE USAGE
Enable all LAMs cc32_write_word (handle, 28, 1, 16, 0xFFFF);
Reset LAM-FF cc32_write_word (handle, 28, 0, 16, 0);
int nTimeout, nLam;
Poll LAM cc32_poll_event (handle, *nTimeout, *nLam)

*/
int   cc32_poll_event(CC32_HANDLE handle, int *nTimeout, int *nLam);

/* control interrupts caused by timeouts or LAMs */
int   cc32_interrupt_disable(CC32_HANDLE handle);
int   cc32_interrupt_enable(CC32_HANDLE handle);

/* same as cc32_poll_event(), but wait for a state change of timeout or LAMs. */
int   cc32_wait_event(CC32_HANDLE handle, int *nTimeout, int *nLam);

/* switch cc32 autoread on or off - return the last switch state */
int   cc32_autoread_on(CC32_HANDLE handle);
int   cc32_autoread_off(CC32_HANDLE handle);
```

### Further reading

In this article I tried to abstract away any reference to the low-level hardware operations, in the spirit of
keeping things as simple as possible. If you want
more details I suggest to read the 
[PCI-CC32 hardware manual](https://manualzz.com/doc/o/a55u3/manual-cc32-controller)
and the 
[camac eur4600 standard](https://core.ac.uk/download/pdf/132578818.pdf).

The libcc32 library is documented in section 7.3 of the 
[PCI-CC32 library documentation](http://mu2e.phy.duke.edu/cw/CAMAC/Wiener/CD36/PciCamac/Pcicc32W95NT-A1.pdf), although it is slightly misleading and outdated.
It is also mentioned in the [PCI-CC32 linux driver manual](https://www.c-ad.bnl.gov/kinyip/AGS-CNI/pcicc32.pdf)


The source code for the kernel drivers and other useful resources can be found with a quick [Google search](https://f9pc00.ijs.si/f9daqsvn/listing.php?repname=f9daq&path=%2Fdrivers%2Fpcicc32-linux%2F&rev=156&peg=156#ab8dbd44c7da7a2381c0b651938865afa). In particular, you may be interested in the [library source code](https://f9pc00.ijs.si/f9daqsvn/filedetails.php?repname=f9daq&path=%2Fdrivers%2Fpcicc32-linux%2Flib%2Flibcc32.c&peg=156)

