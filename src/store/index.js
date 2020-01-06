import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { rootReducer } from '../reducers';
import { getDevMode } from '../utils/helpers';

// MIDDLEWARES
import CommonMiddleware from '../middlewares/CommonMiddleware';
import ImageMiddleware from '../middlewares/UploadMiddleware';
import PropertyMiddleware from '../middlewares/PropertyMiddleware';
import UserMiddleware from '../middlewares/UserMiddleware';

const enhancers = [];
const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
  if (typeof window !== 'undefined') {
    // const { devToolsExtension } = window;
    // enhancers.push(devToolsExtension());
  }
}

if (typeof window !== 'undefined') {
  if (getDevMode()) {
    middlewares.push(logger);
  }
}

const composedEnhancers = compose(
  applyMiddleware(
    ...middlewares,
    CommonMiddleware,
    ImageMiddleware,
    PropertyMiddleware,
    UserMiddleware,
  ),
  ...enhancers,
);

export const configureStore = createStore(rootReducer, {}, composedEnhancers);
export const store = createStore(rootReducer);
