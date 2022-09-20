import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { configureStore } from './store';
import ErrorBoundary from './components/ErrorBoundering';
import "./styles/SCSS/general/main.scss";
import "./styles/SCSS/styleguide/grid.scss";
import "./styles/SCSS/styleguide/mainStyleguide.scss";
import "./styles/SCSS/styleguide/container.scss";
import "./styles/SCSS/styleguide/fontStyle.scss";
import "./styles/SCSS/styleguide/spacing.scss";
import "./styles/SCSS/styleguide/boxModel.scss";
import "./styles/SCSS/general/componentsLoad.scss";
import "./styles/SCSS/styleguide/helpers.scss";

// SET THE STORE FROM REDUX REDUCER
const store = configureStore;
const container = document.getElementById('root');
const root = createRoot(container);

// INITILAIZE THE REACT DOM APP
const AppDOM = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);

root.render(<AppDOM />);

