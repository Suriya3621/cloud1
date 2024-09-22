import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ThemeProvider } from "./App/Theme.jsx";
import { FontProvider } from "./App/FontContext.jsx";
import { Provider } from 'react-redux';
import store from './App/Store'; // Adjust path if needed
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import "./index.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <HelmetProvider>
          <ThemeProvider>
            <FontProvider>
              <App />
            </FontProvider>
          </ThemeProvider>
        </HelmetProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)