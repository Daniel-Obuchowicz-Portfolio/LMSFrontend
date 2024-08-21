import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './components/store';
import { DarkModeProvider } from './components/DarkModeContext'; 
import { I18nextProvider } from 'react-i18next'; // Import I18nextProvider
import i18n from './components/i18n'; // Import your i18n configuration

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <React.StrictMode>
        <I18nextProvider i18n={i18n}> {/* Wrap your app with I18nextProvider */}
          <DarkModeProvider>
            <App />
          </DarkModeProvider>
        </I18nextProvider>
      </React.StrictMode>
    </Router>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
