import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './components/App'

export default (data: any): string => {
    const component = ReactDOMServer.renderToString(<App data={data} />)
    return `<!doctype html>
    <html>
       <head>
          <link rel="shortcut icon" type="image/jpg" href="expresso/favicon.ico"/>
          <script>window.__INITIAL__DATA__ = ${JSON.stringify(data)}</script>
       </head>
       <body>
          <div id="root">${component}</div>
          <script src="expresso/client.js" defer></script>
       </body>
    </html>
    `
}
