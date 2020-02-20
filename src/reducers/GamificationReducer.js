import { handleActions } from 'redux-actions';

import {
  SET_ACHIEVEMENT,
  SET_GAMEGROUP,
} from '../actions/types/GamificationTypes';

export const defaultState = {
  achievement: [],
  gameGroup: [],
};

export default handleActions(
  {
    [SET_ACHIEVEMENT]: (state, action) => ({
      ...state,
      achievement: action.payload,
    }),
    [SET_GAMEGROUP]: (state, action) => ({
      ...state,
      gameGroup: action.payload,
    }),
  },
  defaultState,
);
