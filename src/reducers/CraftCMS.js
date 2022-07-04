import { handleActions } from 'redux-actions';

import {
  SET_CONTENT,
} from '../actions/types/CraftCMS';

export const defaultState = {
  content: {},
};

export default handleActions(
  {
    [SET_CONTENT]: (state, action) => ({
      ...state,
      content: action.payload,
    }),
  },
  defaultState,
);
