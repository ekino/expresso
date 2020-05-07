# ekino expresso

expresso is a development tool for [express](https://github.com/visionmedia/express). It's a simple middleware that
injects useful debugging output into your API response.

It adds an html block at the bottom of the page rendered where it displays info
such as env variables, current session, useful request/response data, third party request infos and data access infos.

expresso should **NOT** be used in production environments.

### Usage

#### Install
`npm install expresso --save-dev`
or
`yarn install expresso --dev`

#### How to use it
Example

```js
const express = require('express')
const expresso = require('expresso')

const app = express()
app.use(expresso.middleware(/* config */))

```

##### Configuration
Expresso middleware take an optional configuration object 

```json
{
    env: ['development', 'dev']
}
```

- env : An array of environments where expresso will be able to run. Default : ['development', 'dev']

In addition, expresso will need a special header that you should set before requesting anything : 

```json
X-Expresso-Enable: true
```

### Contruibution

Runing `yarn build` will build the entire project (server and client side).

Runing `yarn build_client` will only build the client side react app using webpack. (For the while webpack is only set in development mode).

Runing `yarn build_server` will only build the server side app. Usefull when you don't need to debug the view part.

Running `yarn test` will run jest test suite.

Project stack 
- node 12.16
- eslint
- prettier
- jest
- typescript
- react
- webpack

To test it run build and use npm link `@ekino/expresso` in an express project.

### Roadmap
  - [x] Concat chunked responses
  - [x] Setup a solution for the view (react, svelte, handlebars, other ?)
    - React is currently the better solution to do things faster
  - [x] Handle gzip response
  - [x] Prevent middleware from running multiple times in case the underlying requests come from the same express app (Read and remove X-Expresso-Enable from header ?)
  - [ ] Create I/O type with Typescript
  - [ ] Prevent requests overlapping by uniquely identifiying them (X-Unique-Id)
  - [ ] Handle error
  - [ ] Handle redirect (301 status) or any edge cases
  - [ ] Re-code (organize it, test it, typescript it, and remove dead code)
  - [ ] Enable express app overriding
  - [ ] HTTPS
  - [ ] Re-code existing tests (background process)
  - [ ] Coverage