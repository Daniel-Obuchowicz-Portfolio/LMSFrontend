// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './components/store';
import { DarkModeProvider } from './components/DarkModeContext'; 

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <React.StrictMode>
        <DarkModeProvider>
        <App />
        </DarkModeProvider>
      </React.StrictMode>
    </Router>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
