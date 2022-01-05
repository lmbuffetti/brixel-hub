import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import RouterHistory from './store/history';
import App from './App';
import { configureStore } from './store';
import * as serviceWorker from './serviceWorker';
import ErrorBoundary from './components/ErrorBoundering';

// SET THE STORE FROM REDUX REDUCER
const store = configureStore;
const root = document.getElementById('root');

// INITILAIZE THE REACT DOM APP
const AppDOM = () => (
  <Provider store={store}>
    <BrowserRouter history={RouterHistory}>
      <ErrorBoundary
        FallbackComponent={() => <div>Error</div>}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(<AppDOM />, root);

serviceWorker.unregister();
