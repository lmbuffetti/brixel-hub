import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import lazyWithRetry from './components/LazyWithRetry';
import Loading from './components/Loading';
import { configureStore } from './store';
import { register, unregister } from '../serviceWorkerRegistration';
const App = lazyWithRetry(() => import('./App'));
const ErrorBoundering = lazyWithRetry(() => import('./components/ErrorBoundering'));

// SET THE STORE FROM REDUX REDUCER
const store = configureStore;
const container = document.getElementById('root');
const root = createRoot(container);

// INITILAIZE THE REACT DOM APP
const AppDOM = () => {
  console.log(window.location.href);
  if (typeof window !== 'undefined' && window.location.href.includes('.brixel.io')) register();
  if (typeof window !== 'undefined' && window.location.href.includes('localhost')) unregister();
  return(
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<Loading isLoading />}>
          <ErrorBoundering>
            <App />
          </ErrorBoundering>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

root.render(<AppDOM />);

