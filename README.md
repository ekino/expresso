# expresso

expresso is a development tool for [express](https://github.com/visionmedia/express). It's a simple middleware that
injects useful debugging output into your API response.

It adds an html block at the bottom of the page rendered where it displays info
such as env variables, current session, useful request/response data, third party request infos and data access infos.

expresso should **NOT** be used in production environments.

### Usage

#### Install
`npm install expresso --save-dev`

#### How to use it
Example

```js
const express = require('express')
const {expressoApp} = require('expresso')

const app = expressoApp(express(), {})

```

![Example](docs/exemple.png)

### Exemple of output