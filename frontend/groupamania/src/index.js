import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import { AuthContext } from './Context/AuthContext';
import { getCurrentUser } from './Services/userService';
import logger from './Services/logService'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

logger.init()
const queryClient = new QueryClient()
const userData = getCurrentUser();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={userData}>
    <App />
    </AuthContext.Provider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/**import React from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
    document.getElementById('root')
);*/
