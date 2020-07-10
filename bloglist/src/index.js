import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import storejs from './store.js'
import {BrowserRouter as Router} from 'react-router-dom'

const store = storejs

ReactDOM.render(<Router><Provider store={store}><App /></Provider></Router>, document.getElementById('root'))