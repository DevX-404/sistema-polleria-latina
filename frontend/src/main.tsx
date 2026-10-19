import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker automatically
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nueva versión de Pollería Latina disponible.');
  },
  onOfflineReady() {
    console.log('Pollería Latina lista para operar sin conexión (PWA).');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
