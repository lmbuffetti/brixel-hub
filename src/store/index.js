import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import get from 'lodash/get';
import { rootReducer } from '../reducers';

// MIDDLEWARES
import CommonMiddleware from '../middlewares/CommonMiddleware';
import CompanyMiddleware from '../middlewares/CompanyMiddleware';
import DealMiddleware from '../middlewares/DealMiddleware';
import HistoryMiddleware from '../middlewares/HistoryMiddleware';
import ImageMiddleware from '../middlewares/UploadMiddleware';
import LeadMiddleware from '../middlewares/LeadMiddleware';
import MarketMiddleware from '../middlewares/MarketMiddleware';
import NoteMiddleware from '../middlewares/NoteMiddleware';
import PropertyMiddleware from '../middlewares/PropertyMiddleware';
import UserMiddleware from '../middlewares/UserMiddleware';
import SearchProfile from '../middlewares/SearchProfileMiddleware';
import EstimationMiddleware from '../middlewares/EstimationMiddleware';

const enhancers = [];
const middlewares = [thunkMiddleware];

const getIfDev = (get(window, 'location.href', '')).split('?');

if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'development' || (getIfDev[1] && getIfDev[1].includes('dev=true')))) {
  middlewares.push(createLogger({
    colors: {
      title: () => "#002bff",
      prevState: () => "#de6f0d",
      action: () => "#6e13ab",
      nextState: () => "#1a9134",
    },
  }));
}

const composedEnhancers = compose(
  applyMiddleware(
    ...middlewares,
    CommonMiddleware,
    CompanyMiddleware,
    DealMiddleware,
    HistoryMiddleware,
    ImageMiddleware,
    LeadMiddleware,
    MarketMiddleware,
    NoteMiddleware,
    PropertyMiddleware,
    UserMiddleware,
    SearchProfile,
    EstimationMiddleware,
  ),
  ...enhancers,
);

export const configureStore = createStore(rootReducer, {}, composedEnhancers);
const store = createStore(rootReducer);

export const configureStorePreload = (initialValues = {}) => createStore(rootReducer, initialValues, composedEnhancers);

export default store;
