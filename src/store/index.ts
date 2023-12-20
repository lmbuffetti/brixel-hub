import get from 'lodash/get';
import {
  createStore, applyMiddleware,
} from 'redux';
import {thunk} from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import {
  rootReducer,
} from '../reducers';

// MIDDLEWARES
import CommonMiddleware from '../middlewares/CommonMiddleware';
import ChecklistMiddleware from '../middlewares/ChecklistMiddleware';
import PropertyMiddleware from '../middlewares/PropertyMiddleware';
import UserMiddleware from '../middlewares/UserMiddleware';
import ImageMiddleware from '../middlewares/UploadMiddleware';
import CompanyMiddleware from '../middlewares/CompanyMiddleware';
import LeadMiddleware from '../middlewares/LeadMiddleware';
import PackageMiddleware from '../middlewares/PackageMiddleware';
import DealMiddleware from '../middlewares/DealMiddleware';
import NoteMiddleware from '../middlewares/NoteMiddleware';
import HistoryMiddleware from '../middlewares/HistoryMiddleware';
import EstimationMiddleware from '../middlewares/EstimationMiddleware';
import EmailMiddleware from '../middlewares/EmailMiddleware';

const middlewares: any = [thunk];

const getIfDev = (get(window, 'location.href', '')).split('?');

// @ts-ignore
if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'development' || (getIfDev[1] && getIfDev[1].includes('dev=true')))) {
  middlewares.push(createLogger({
    collapsed: true,
    colors: {
      title: () => '#00C1DE',
      prevState: () => '#de6f0d',
      action: () => '#6e13ab',
      nextState: () => '#1a9134',
    },
  }));
}

const composeEnhancers = composeWithDevTools({});

const composedEnhancers = composeEnhancers(
  applyMiddleware(
    ...middlewares,
    CommonMiddleware,
    ChecklistMiddleware,
    PropertyMiddleware,
    UserMiddleware,
    ImageMiddleware,
    CompanyMiddleware,
    LeadMiddleware,
    PackageMiddleware,
    DealMiddleware,
    NoteMiddleware,
    HistoryMiddleware,
    EstimationMiddleware,
    EmailMiddleware,
  ),
);

export const configureStore = createStore(rootReducer, {}, composedEnhancers);
const store = createStore(rootReducer);
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = typeof configureStore;