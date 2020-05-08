import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { rootReducer } from '../reducers';

// MIDDLEWARES
import CommonMiddleware from '../middlewares/CommonMiddleware';
import CompanyMiddleware from '../middlewares/CompanyMiddleware';
import ImageMiddleware from '../middlewares/UploadMiddleware';
import PropertyMiddleware from '../middlewares/PropertyMiddleware';
import UserMiddleware from '../middlewares/UserMiddleware';
import GamificationMiddleware from '../middlewares/GamificationMiddleware';

const enhancers = [];
const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
  if (typeof window !== 'undefined') {
    // const { devToolsExtension } = window;
    // enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(
    ...middlewares,
    CommonMiddleware,
    CompanyMiddleware,
    GamificationMiddleware,
    ImageMiddleware,
    PropertyMiddleware,
    UserMiddleware,
  ),
  ...enhancers,
);

export const configureStore = createStore(rootReducer, {}, composedEnhancers);
export const store = createStore(rootReducer);
