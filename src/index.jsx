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
import './styles/SCSS/general/main.scss';
import './utils/ReactotronConfig';


const store = configureStore;
const root = document.getElementById('root');

const AppDOM = () => (
  <Provider store={store}>
    <BrowserRouter history={RouterHistory}>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(<AppDOM />, root);

serviceWorker.unregister();
