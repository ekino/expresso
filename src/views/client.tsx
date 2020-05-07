import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'
//@ts-ignore
ReactDOM.hydrate(<App data={window.__INITIAL__DATA__} />, document.getElementById('root'))
