# Node.js Fundamentals

## What is Node.js?
In the simplest terms, Node.js is a tool that allows programmers to run JavaScript outside of the browser environment, directly on your computer or a server.

## How does Node.js differ from running JavaScript in the browser?
Browser JavaScript utilizes the DOM (Document Object Model). JavaScript can interact with things such as web page, HTML, buttons and browser features. Node.js differs from running JavaScript in the browser by doing things browser JavaScript normally cannot do, such as: read and write files, start a web server, read environment variables, work with operating system services, can run backend libraries such as Express. 

## What is the V8 engine, and how does Node use it?
An engine is the program that reads your JavaScript and turns it into fast instructions the computer can run. Its job is to take JavaScript code and execute it. The V8 engine is the high performance JavaScript engine Google originally built for the Chrome browser. Node takes the same engine out of the browser and wraps extra abilities around it.

## What are some key use cases for Node.js?
Some key use casers for Node.js include web servers, APIs, backend applications, command-line tools, and file-processing scripts.

## Explain the difference between CommonJS and ES Modules. Give a code example of each.

**CommonJS (default in Node.js):**
```js
// As our programs get more complicated with more lines and files, it is helpful to use modules. It is a way to better organize our code, into separate files and sharing between them. CommonJS uses require() to import something.
// An example of CommonJS is const { register, logoff } = require("../controllers/userController");
```

**ES Modules (supported in modern Node.js):**
```js
// ES Modules are a JavaScript module system that can be used in Node.js, browsers, React projects and elsewhere. ES modules use import / export. An example includes import { useState, useEffect } from "react";
// 
``` 