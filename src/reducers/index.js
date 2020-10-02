import { combineReducers } from 'redux';
import { formReduxer } from '@brixel/brixel-components';
import common from './CommonReducer';
import companies from './CompanyReducer';
import deal from './DealReducer';
import property from './PropertyReducer';
import user from './UserReducer';
import image from './UploadReducer';
import gamification from './GamificationReducer';

export const rootReducer = combineReducers({
  brixelForm: formReduxer,
  common,
  companies,
  deal,
  gamification,
  images: image,
  property,
  user,
});

export default rootReducer;
