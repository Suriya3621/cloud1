import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './App/Store'; // Adjust path if needed
import { HelmetProvider } from 'react-helmet-async';
import {BrowserRouter} from 'react-router-dom'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
         <BrowserRouter>
             <Provider store={store}>
               <HelmetProvider >
                       <App />
               </HelmetProvider >
             </Provider>
         </BrowserRouter>
  </React.StrictMode>
);
