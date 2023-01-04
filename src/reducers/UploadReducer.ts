import {handleActions} from 'redux-actions';
import {SET_IMAGE_TYPE,} from '../actions/types/UploadTypes';

export const defaultState = {
  imageType: [],
};

export default handleActions(
  {
    [SET_IMAGE_TYPE]: (state, action) => ({
      ...state,
      imageType: action.payload,
    }),
  },
  defaultState,
);
