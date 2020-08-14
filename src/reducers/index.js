import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { formReduxer } from '@brixel/brixel-components';
import common from './CommonReducer';
import companies from './CompanyReducer';
import property from './PropertyReducer';
import user from './UserReducer';
import image from './UploadReducer';
import gamification from './GamificationReducer';

export const rootReducer = combineReducers({
  brixelForm: formReduxer,
  common,
  companies,
  form,
  gamification,
  images: image,
  property,
  user,
});

export default rootReducer;
