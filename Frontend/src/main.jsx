import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'

import store from './Store/store.js'
import { SocketProvider } from './Context/myContext.jsx'

createRoot(document.getElementById('root')).render(
  //  <StrictMode>
   <Provider store={store} >
   <SocketProvider> 
    <App />
  </SocketProvider>
  </Provider>
  //  </StrictMode>
)
