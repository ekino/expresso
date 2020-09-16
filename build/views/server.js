"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const App_1 = __importDefault(require("./containers/App"));
const redux_1 = require("redux");
const reducers_1 = __importDefault(require("./reducers"));
const react_redux_1 = require("react-redux");
const constants_1 = require("../constants");
exports.handleRender = (originalCall, underlyingCalls, staticPath, publicPath) => {
    // Grab the initial state from our Redux store
    const preloadedState = getInitialState(underlyingCalls, originalCall);
    // Create a new Redux store instance
    const store = redux_1.createStore(reducers_1.default, preloadedState);
    // Render the component to a string
    const html = server_1.default.renderToString(react_1.default.createElement(react_redux_1.Provider, { store: store },
        react_1.default.createElement(App_1.default, { data: preloadedState })));
    // Grab the initial state from our Redux store
    const finalState = store.getState();
    // Send the rendered page back to the client
    return exports.renderFullPage(html, finalState, staticPath, publicPath);
};
exports.renderFullPage = (html, preloadedState, staticPath, publicPath) => {
    return `
    <!doctype html>
    <html>
      <head>
        <title>Expresso</title>
        <link rel="shortcut icon" type="image/jpg" href="favicon.ico"/>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // https://redux.js.org/recipes/server-rendering/#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script type="application/javascript" src="${staticPath ||
        constants_1.EXPRESSO_STATIC_PATH}/client.js"></script>
      </body>
    </html>
    `;
};
const filterResponse = (res) => {
    const { headers, statusCode, statusMessage, data, time, url, error } = res;
    return {
        headers,
        statusCode,
        statusMessage,
        data,
        time,
        url,
        error
    };
};
const filterRequest = (req) => {
    const { headers, protocol, hostname, path, method } = req;
    return { headers, protocol, hostname, path, method };
};
const filterOriginalCall = (originalCall) => {
    const { headers, statusCode, statusMessage, data, time, url, error } = originalCall;
    return { headers, statusCode, statusMessage, data, time, url, error };
};
const getInitialState = (underlyingCalls, originalCall) => {
    const filteredUnderlyingCalls = underlyingCalls.map(item => {
        return {
            id: item.id,
            response: filterResponse(item.response),
            request: filterRequest(item.request)
        };
    });
    const filteredOriginalCall = filterOriginalCall(originalCall);
    return {
        originalCall: filteredOriginalCall,
        underlyingCalls: filteredUnderlyingCalls
    };
};
//# sourceMappingURL=server.js.map