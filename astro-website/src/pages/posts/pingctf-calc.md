---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import PictureThemed from '../../components/PictureThemed.astro'
title: exploiting inconsistencies in the esprima AST parser - PingCTF writeup
publishDate: 2023-12-12
description: writeup for the challenge calc - PingCTF 2023
tags: ['writeup', 'web', 'AST', 'js']
permalink: https://halb.it/posts/pwntools-gdb/
---

PingCTF 2023 had an interesting web challenge, called calc. The solution involved a simple logic bug, but there were a lot of unintended workarounds based on inconsistencies in the esprima.js parser that i think are worth sharing

## the challenge


<PictureThemed src="calc" height={450} alt="" />
<br/>

This is a classic xss challenge, where you have to find a reflected xss and send the malicious link to a bot to steal its cookies.
The vulnerable app is a simple html+js calculator, with the following logic flow:

```js

function runCode(untrusted_code) {

	var AST = esprima.parse(untrusted_code);

	try {
		validateProgram(AST);

		var html = `Result from evaluating code <code>${untrusted_code}</code> is ${eval(
			untrusted_code
		)}`;
		document.getElementById("output").innerHTML = html;
	} catch (e) {
		document.getElementById("output").innerHTML = e;
	}
}
```
- untrusted js code is read from the url (or from the textarea)
- the code is parsed into an AST using the esprima.js library
- the AST is validated against a strict set of rules, to make sure there is no malicious code
- if everything looks right, the code is run with an `eval`


`validateProgram` is a set of mutually recursive functions, that walk the AST and throw an error every time they find a pattern that does not match their allow-list

```js
function validateProgram(program) {
	for (var statement of program.body) {
		if (statement.type != "ExpressionStatement") {
      console.log(`VALIDATEPROGRAM: ${statement.type} != ExpressionStatement`)
			throw "Invalid Program";
		}
		validateExpression(statement.expression);
	}
}

function validateExpression(expression) {
	if (expression.type != "AssignmentExpression") {
		throw (
			"Invalid Expression, expected AssignmentExpression got: " +
			expression.type
		);
	}
	validateIdentifier(expression.left);
	validateCalculation(expression.right);
}

// ... rest of the validation functions

```

### the bug

The first anomaly is in the `runCode` function: both the result of the eval and the validation errors raised by `validateProgram` are injected into the dom using `innerHTML`, instead of the correct and safe alternative `innerText`

Coincidentally enough, there is a line of code in `validateIdentifier` that partially prints back our input when we provide an Identifier that is not included in the whitelist

```js
  // ...

	if (!/^[a-zA-Z]$/.test(identifier.name) && identifier.name != "Math") {
		throw "Invalid Identifier name: " + identifier.name;
	}
```

This means that if we provide any code with an identifier not in the whitelist, such as `TEST = 1 + 1`,
that invalid identifier will be injected into the DOM using innerHTML, with the following result:

```html
<div id="output">Invalid Identifier name: TEST</div>
```

The catch is that the injected text must be [a javascript Identifier](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#prod-IdentifierName), which is never valid HTML... At least according to the standard

### esprima js

Esprima is an old Ecmascript 2019 parser.
Browsers today are running newer versions of the standard, which means that this challenge is inspecting an AST that doesn't fully match the AST that will be executed. <br/> Additionally, over the years the project accumulated hundreds of issues on github related to parsing inconsistencies.

We don't have to go very far to find [this useful issue](https://github.com/jquery/esprima/issues/1985
) for our exploit.
 Any identifier character specified using `\UnicodeEscapeSequence` is accepted by esprima as part of that identifier.<br/>
 This is exactly what we need! This means that we can create an identifier containing HTML tags:
```
<img src=1 onerror=alert(1)> = 1
```

Next, we can convert all invalid characters into Unicode sequences:

```
\u{03c}img\u{020}src\u{3d}1\u{020}onerror\u{3d}alert\u{020}\u{3E} = 1+1
```

Inject it into the page, and...<br/>

```html
<div id="output">Invalid Identifier name: <img src=1 onerror=alert(1)></div>
```
Boom! The image is created, but we get a CSP error

### The correct solution

Turns out, there is a very strict CSP policy that cannot be bypassed in any way.

```
content="default-src 'none';
object-src 'none';
style-src-elem 'self';
script-src 'self' 'unsafe-eval';
```

The policy blocks any kind of attack on the `innerHTML` flaw, including the Identifier trick we covered and other similar ones that exploited returned strings or inconsistencies in parsing comments.

In the end, the correct solution involved a logic error that made it possible to bypass the AST validation. A full writeup of the exploit is [available here](https://gist.github.com/egonny/4dbf5151f99059ae58cf9390c7cc3830)

To solve this challenge i lost a lot of time looking at parser inconsistencies without realizing that the CSP was making them completely useless, eventually losing a lot of precious time.<br/> I didn't manage to solve the challenge in time, but I definitely learned some useful lessons along the way.






