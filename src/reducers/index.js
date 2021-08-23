import { combineReducers } from 'redux';
import { formReduxer } from '@brixel/brixel-components';
import common from './CommonReducer';
import companies from './CompanyReducer';
import deal from './DealReducer';
import gamification from './GamificationReducer';
import history from './HistoryReducer';
import market from './MarketReducer';
import image from './UploadReducer';
import lead from './LeadReducer';
import property from './PropertyReducer';
import user from './UserReducer';
import notes from './NoteReducer';

export const rootReducer = combineReducers({
  brixelForm: formReduxer,
  common,
  companies,
  deal,
  gamification,
  history,
  images: image,
  lead,
  market,
  notes,
  property,
  user,
});

export default rootReducer;
