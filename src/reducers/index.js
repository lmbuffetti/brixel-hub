import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import common from './CommonReducer';
import property from './PropertyReducer';
import user from './UserReducer';
import image from './UploadReducer';


export const rootReducer = combineReducers({
  common,
  form,
  image,
  property,
  user,
});

export default rootReducer;
