// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { store } from './app/store.js'; // Make sure this path is correct
import { Provider } from 'react-redux'; // Make sure this is imported

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* <-- This Provider is essential */}
      <App />
    </Provider>
  </React.StrictMode>
);