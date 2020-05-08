import { handleActions } from 'redux-actions';

import {
  SET_ACHIEVEMENT,
  SET_GAMEGROUP,
  SET_GAME_HISTORY,
} from '../actions/types/GamificationTypes';

export const defaultState = {
  achievement: [],
  gameGroup: [],
  gameHistory: {},
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
    [SET_GAME_HISTORY]: (state, action) => ({
      ...state,
      gameHistory: action.payload,
    }),
  },
  defaultState,
);
