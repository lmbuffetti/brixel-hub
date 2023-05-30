import React, {lazy, Suspense, Profiler} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';
import {configureStore} from './store';

const App = lazy(() => import('./App'));
const ErrorBoundary = lazy(() => import('./components/ErrorBoundering'));

const store = configureStore;
const container = document.getElementById('root');

// @ts-ignore
if (window.Cypress) {
  // @ts-ignore
  window.store = store
}

if (container) {
  const root = createRoot(container);

  // INITILAIZE THE REACT DOM APP
  const AppDOM = () => {
    if (typeof window !== 'undefined') {
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

    // eslint-disable-next-line max-params
    const onRender = (id, _phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
      // eslint-disable-next-line no-console
      console.warn(`ID: ${id}, actual time: ${actualDuration}, baseDuration: ${baseDuration}, startTime: ${startTime}, commitTime: ${commitTime}, interactions: ${interactions}`);
    };

    return (
      <Profiler id="App" onRender={onRender}>
        <Provider store={store}>
          <BrowserRouter>
            <Suspense>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </Suspense>
          </BrowserRouter>
        </Provider>
      </Profiler>
    );
  };

  root.render(<AppDOM />);
}
