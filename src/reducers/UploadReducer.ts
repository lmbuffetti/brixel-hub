import {handleActions} from 'redux-actions';
import {SET_IMAGE_TYPE,} from '../actions/types/UploadTypes';
import type {UploadReducerType} from '../@types/reducer/UploadReducer';

export const defaultState: UploadReducerType = {
  imageType: [],
};

export default handleActions<any>(
  {
    [SET_IMAGE_TYPE]: (state, action) => ({
      ...state,
      imageType: action.payload,
    }),
  },
  defaultState,
);
