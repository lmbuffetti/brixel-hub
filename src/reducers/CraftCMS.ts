import {handleActions} from 'redux-actions';

import {SET_CONTENT} from '../actions/types/CraftCMS';
import type {CommonReducerType} from '../@types/reducer/CraftReducer';

export const defaultState: CommonReducerType = {
  content: [],
};

export default handleActions<any>(
  {
    [SET_CONTENT]: (state, action) => ({
      ...state,
      content: action.payload,
    }),
  },
  defaultState,
);
