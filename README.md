# ekino expresso

expresso is a development tool for [express](https://github.com/visionmedia/express). It's a simple middleware that
injects useful debugging output into your API response.

It adds an html block at the bottom of the page rendered where it displays info
such as env variables, current session, useful request/response data, third party request infos and data access infos.

expresso should **NOT** be used in production environments.


<!-- TOC -->autoauto- [ekino expresso](#ekino-expresso)auto        - [Usage](#usage)auto            - [Install](#install)auto            - [How to use it](#how-to-use-it)auto            - [Configuration](#configuration)auto        - [Roadmap](#roadmap)autoauto<!-- /TOC -->

### Usage

#### Install
`npm install expresso --save-dev`
or
`yarn install expresso --dev`

#### How to use it
Example

```js
const express = require('express')
const { expressoMiddleware } = require('expresso')

const app = express()
app.use(expressoMiddleware(/* config */))

```

![Example](docs/exemple.png) 

deprecated (currently reworking)

#### Configuration
Expresso middleware take an optional configuration object 

```json
{
    env: ['development', 'dev']
}
```

- env : An array of environments where expresso will be able to run. Default : ['development', 'dev']

### Roadmap
  - [x] Concat chunked responses
  - [x] Handle error
  - [ ] Handle redirect (301 status) or any edge cases
  - [ ] Prevent middleware from running multiple times in case the underlying requests come from the same express app (Read and remove X-Expresso-Enable from header ?)
  - [ ] Prevent requests overlapping by uniquely identifiying them (X-Unique-Id)
  - [ ] Re-code (organize it, test it, typescript it, and remove dead code)
  - [ ] Rework html and data before use html template 
  - [ ] Enable express app overriding
  - [ ] HTTPS
  - [ ] Re-code existing tests (background process)
  - [ ] Coverage