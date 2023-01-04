import React, {lazy, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';
import {configureStore} from './store';

const App = lazy(() => import('./App'));
const ErrorBoundary = lazy(() => import('./components/ErrorBoundering'));

const store = configureStore;
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);

  // INITILAIZE THE REACT DOM APP
  const AppDOM = () => {
    if (typeof window !== 'undefined' && window.location.href.includes('.brixel.io')) {
      serviceWorkerRegistration.register({
        onUpdate: registration => {
          if (registration && registration.waiting) {
            registration.waiting.postMessage({type: 'SKIP_WAITING'});
          }
          window.location.reload();
        },
      });
    }
    if (typeof window !== 'undefined' && window.location.href.includes('localhost')) {
      serviceWorkerRegistration.unregister();
    }
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Suspense>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </Suspense>
        </BrowserRouter>
      </Provider>
    );
  };

  root.render(<AppDOM />);
}
