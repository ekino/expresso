"use strict";
// import React from 'react'
// import ReactDOM from 'react-dom'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import App from './components/App'
// //@ts-ignore
// ReactDOM.hydrate(<App data={window.__INITIAL__DATA__} />, document.getElementById('root'))
const react_1 = __importDefault(require("react"));
const react_dom_1 = require("react-dom");
const redux_1 = require("redux");
const react_redux_1 = require("react-redux");
const reducers_1 = __importDefault(require("./reducers"));
const App_1 = __importDefault(require("./components/App"));
const redux_devtools_extension_1 = require("redux-devtools-extension");
//@ts-ignore
const preloadedState = window.__PRELOADED_STATE__;
//@ts-ignore
delete window.__PRELOADED_STATE__;
// Create Redux store with initial state
const store = redux_1.createStore(reducers_1.default, preloadedState, redux_devtools_extension_1.composeWithDevTools());
react_dom_1.hydrate(react_1.default.createElement(react_redux_1.Provider, { store: store },
    react_1.default.createElement(App_1.default, { data: preloadedState })), document.getElementById('root'));
//# sourceMappingURL=client.js.map