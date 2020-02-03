import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import common from './CommonReducer';
import companies from './CompanyReducer';
import property from './PropertyReducer';
import user from './UserReducer';
import image from './UploadReducer';


export const rootReducer = combineReducers({
  common,
  companies,
  form,
  image,
  property,
  user,
});

export default rootReducer;
