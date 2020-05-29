// import React from 'react'
// import ReactDOM from 'react-dom'

// import App from './components/App'
// //@ts-ignore
// ReactDOM.hydrate(<App data={window.__INITIAL__DATA__} />, document.getElementById('root'))
import React from 'react'
import { hydrate } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import expressoApp from './reducers'
import App from './components/App'
import { composeWithDevTools } from 'redux-devtools-extension'

//@ts-ignore
const preloadedState = window.__PRELOADED_STATE__

//@ts-ignore
delete window.__PRELOADED_STATE__

// Create Redux store with initial state
const store = createStore(expressoApp, preloadedState, composeWithDevTools())

hydrate(
    <Provider store={store}>
        <App data={preloadedState} />
    </Provider>,
    document.getElementById('root')
)
