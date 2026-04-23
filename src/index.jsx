import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';

import packageJson from '../package.json';
import App from './App';
import { reducer } from './redux';

import './index.css';

const previewInfo = {
  appVersion: packageJson.version,
  mode: import.meta.env.MODE,
  basePath: import.meta.env.BASE_URL,
  commit: __APP_COMMIT__,
  isPreview: import.meta.env.BASE_URL.includes('/previews/'),
};

console.info('[joeyonng-backyard] Runtime build info', previewInfo);

const store = createStore(reducer);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
