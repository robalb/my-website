---
# This is not a blogpost, this is the /uses page
setup: |
  import Layout from '../layouts/MdPage.astro'
title: /uses
subtitle: software and tools i use regularly
description: software and tools i use regularly
permalink: https://halb.it/uses/
---

This page is inspired by two awesome projects: https://uses.tech/ and https://usesthis.com/. Check them out to see what other people are using

## My hardware

My main hardware is a thinkpad7480s, at home connected to a docking station with a bigger screen. <br />
I'm not really a hardware person, this is why all my self-hosted software and all my projects are currently running on a self-managed kubernetes cluster in the cloud

## My tools

- <a href="https://neovim.io/">neovim</a> - My main editor

- <a href="https://github.com/tmux/tmux/wiki">tmux</a> - A terminal multiplexer. Combined with vim, it's how i navigate and organize
  multiple terminals and projects.

- <a href="https://www.docker.com/">docker</a> - Together with Docker-compose, it's how i manage most of my local development and testing environments.

- <a href="https://git-scm.com/">git</a> - It's how i manage all my projects, my
  <a href="https://github.com/robalb/workstation"> desktop environments</a>, and my server infrastructure as a fan of 
  the <a href="https://www.redhat.com/it/topics/devops/what-is-gitops">gitops</a> approach.

- <a href="https://www.jetbrains.com/webstorm/">webstorm</a> - A powerful ide for the web. Sometimes vim is just not the right tool

- <a href="https://ngrok.com/">ngrok</a> - A quick way to setup reverse shells and test complex environments locally.

- <a href="https://insomnia.rest/">insomnia</a> - A good loking tool to test and call apis

- <a href="https://portswigger.net/burp">burp suite</a> - An efficient tool to test and _break_ apis.

<!--
## Technical skills

### frontend

- Experienced in javascript/ES6, I use React + Redux as my preferred
   frontend stack
- I have experience with several javascript bundlers and SSG / SSR frameworks,
  my preferred ones at the moment are Vite, and Astro.build
- I'm far from being a designer, however i'm familiar with modern css and
  with some design tools such as adobe photoshop and gimp

### backend & languages

- I mostly write in javascript, python and java
- My choice for backend and api development is Python, with the FastAPI framework
  or Flask. In the past i've also used php and nodejs.
- I have experience with mysql, postgreSQL and redis

### Devops & infrastructure

- I mostly use github workflows, with ghcr as container registry for my CI/CD pipelines
- I work closely with kubernetes clusters in my daily operations, and all my project are
 deployed on a self managed k3s cluster running on cheap OVH VPSs
- On kubernetes, i like to use ArgoCD with a gitops approach
- I use Grafana and Prometheus to analyze and monitor my services and projects,
  and a Grafana-Loki stack for log aggregation and management

-->

## This blog

The design of this website is a fork of
<a href="https://github.com/taniarascia/taniarascia.com">Tania Rascia</a>'s
blog and uses her newmoon dark theme for
 the code snippets. Check out the
<a href="/posts/my-website/">blog post</a>
 I've written about its technical details
