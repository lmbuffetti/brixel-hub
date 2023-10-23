import React, {lazy, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';
import {configureStore} from './store';
import './styles/SCSS/general/main.scss';
import './styles/SCSS/styleguide/grid.scss';
import './styles/SCSS/styleguide/mainStyleguide.scss';
import './styles/SCSS/styleguide/container.scss';
import './styles/SCSS/styleguide/fontStyle.scss';
import './styles/SCSS/styleguide/spacing.scss';
import './styles/SCSS/styleguide/boxModel.scss';
import './styles/SCSS/general/componentsLoad.scss';
import './styles/SCSS/styleguide/helpers.scss';

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
      // serviceWorkerRegistration.register({
      //   onUpdate: registration => {
      //     if (registration && registration.waiting) {
      //       registration.waiting.postMessage({type: 'SKIP_WAITING'});
      //     }
      //     window.location.reload();
      //   },
      // });
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
