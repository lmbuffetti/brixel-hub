import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';
import lazyWithRetry from './components/LazyWithRetry';
import { configureStore } from './store';

const App = lazyWithRetry(() => import('./App'));
const ErrorBoundary = lazyWithRetry(() => import('./components/ErrorBoundering'));

const store = configureStore;
const container = document.getElementById('root');
const root = createRoot(container);

// INITILAIZE THE REACT DOM APP
const AppDOM = () => {
  if (typeof window !== 'undefined' && window.location.href.includes('.brixel.io')) {
    // eslint-disable-next-line no-console
    console.log('test');
    serviceWorkerRegistration.register({
      onUpdate: registration => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
      }
    });
  }
  if (typeof window !== 'undefined' && window.location.href.includes('localhost')) {
    serviceWorkerRegistration.unregister();
  }
  return(
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
};

root.render(<AppDOM />);
