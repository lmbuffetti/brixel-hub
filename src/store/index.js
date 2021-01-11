import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { rootReducer } from '../reducers';

// MIDDLEWARES
import CommonMiddleware from '../middlewares/CommonMiddleware';
import CompanyMiddleware from '../middlewares/CompanyMiddleware';
import DealMiddleware from '../middlewares/DealMiddleware';
import GamificationMiddleware from '../middlewares/GamificationMiddleware';
import HistoryMiddleware from '../middlewares/HistoryMiddleware';
import ImageMiddleware from '../middlewares/UploadMiddleware';
import LeadMiddleware from '../middlewares/LeadMiddleware';
import NoteMiddleware from '../middlewares/NoteMiddleware';
import PropertyMiddleware from '../middlewares/PropertyMiddleware';
import UserMiddleware from '../middlewares/UserMiddleware';
import SearchProfile from '../middlewares/SearchProfileMiddleware';

const enhancers = [];
const middlewares = [thunkMiddleware];

const getIfDev = (window.location.href).split('?');

if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'development' || (getIfDev[1] && getIfDev[1].includes('dev=true')))) {
  middlewares.push(logger);
}

const composedEnhancers = compose(
  applyMiddleware(
    ...middlewares,
    CommonMiddleware,
    CompanyMiddleware,
    DealMiddleware,
    GamificationMiddleware,
    HistoryMiddleware,
    ImageMiddleware,
    LeadMiddleware,
    NoteMiddleware,
    PropertyMiddleware,
    UserMiddleware,
    SearchProfile,
  ),
  ...enhancers,
);

export const configureStore = createStore(rootReducer, {}, composedEnhancers);
const store = createStore(rootReducer);

export default store;
