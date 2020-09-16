import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './containers/App'
import { createStore } from 'redux'
import expressoApp from './reducers'
import { Provider } from 'react-redux'
import {
    ExpressoData,
    ExpressoCall,
    ExpressoUnderlyingCall,
    ExpressoResponse,
    ExpressoRequest
} from './components/definitions'
import {
    ExpressoHttpInterceptorData,
    ExpressoHttpInterceptorResponse,
    ExpressoHttpInterceptorRequest
} from '../interceptors/definitions'
import { EXPRESSO_STATIC_PATH } from '../constants'

export const handleRender = (
    originalCall: ExpressoCall,
    underlyingCalls: ExpressoHttpInterceptorData[],
    staticPath?: string,
    publicPath?: string
): any => {
    // Grab the initial state from our Redux store
    const preloadedState = getInitialState(underlyingCalls, originalCall)

    // Create a new Redux store instance
    const store = createStore(expressoApp, preloadedState)

    // Render the component to a string
    const html = ReactDOMServer.renderToString(
        <Provider store={store}>
            <App data={preloadedState} />
        </Provider>
    )

    // Grab the initial state from our Redux store
    const finalState = store.getState()

    // Send the rendered page back to the client
    return renderFullPage(html, finalState, staticPath, publicPath)
}

export const renderFullPage = (
    html: any,
    preloadedState: any,
    staticPath?: string,
    publicPath?: string
): any => {
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
            EXPRESSO_STATIC_PATH}/client.js"></script>
      </body>
    </html>
    `
}

const filterResponse = (res: ExpressoHttpInterceptorResponse): ExpressoResponse => {
    const { headers, statusCode, statusMessage, data, time, url, error } = res
    return {
        headers,
        statusCode,
        statusMessage,
        data,
        time,
        url,
        error
    }
}

const filterRequest = (req: ExpressoHttpInterceptorRequest): ExpressoRequest => {
    const { headers, protocol, hostname, path, method } = req
    return { headers, protocol, hostname, path, method }
}

const filterOriginalCall = (originalCall: ExpressoCall): ExpressoCall => {
    const { headers, statusCode, statusMessage, data, time, url, error } = originalCall
    return { headers, statusCode, statusMessage, data, time, url, error }
}

const getInitialState = (
    underlyingCalls: ExpressoHttpInterceptorData[],
    originalCall: ExpressoCall
): ExpressoData => {
    const filteredUnderlyingCalls: ExpressoUnderlyingCall[] = underlyingCalls.map(item => {
        return {
            id: item.id,
            response: filterResponse(item.response),
            request: filterRequest(item.request)
        }
    })

    const filteredOriginalCall = filterOriginalCall(originalCall)
    return {
        originalCall: filteredOriginalCall,
        underlyingCalls: filteredUnderlyingCalls
    }
}
