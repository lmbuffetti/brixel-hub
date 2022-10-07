import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import lazyWithRetry from './components/LazyWithRetry';
import { configureStore } from './store';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';
const App = lazyWithRetry(() => import('./App'));
const ErrorBoundary = lazyWithRetry(() => import('./components/ErrorBoundering'));

const store = configureStore;
const container = document.getElementById('root');
const root = createRoot(container);

// INITILAIZE THE REACT DOM APP
const AppDOM = () => {
  if (typeof window !== 'undefined' && window.location.href.includes('.brixel.io')) serviceWorker.register({
    onUpdate: registration => {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    }
  });
  if (typeof window !== 'undefined' && window.location.href.includes('localhost')) serviceWorkerRegistration.unregister();
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
