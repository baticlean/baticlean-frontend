import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import './style.css';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';

// Importer les outils pour le thème
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/index.js'; // Importer notre thème personnalisé

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalise le style sur tous les navigateurs */}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);