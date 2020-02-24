import { createActions } from 'redux-actions';
import {
  GET_ACHIEVEMENT,
  SET_ACHIEVEMENT,
  GET_GAMEGROUP,
  SET_GAMEGROUP,
  ADD_GAME_HISTORY,
  GET_GAME_HISTORY,
  SET_GAME_HISTORY,
} from './types/GamificationTypes';

export const {
  getAchievement,
  setAchievement,
  getGamegroup,
  setGamegroup,
  addGameHistory,
  getGameHistory,
  setGameHistory,
} = createActions({
  [GET_ACHIEVEMENT]: (payload) => payload,
  [SET_ACHIEVEMENT]: (payload) => payload,
  [GET_GAMEGROUP]: (payload) => payload,
  [SET_GAMEGROUP]: (payload) => payload,
  [ADD_GAME_HISTORY]: (payload) => payload,
  [GET_GAME_HISTORY]: (payload) => payload,
  [SET_GAME_HISTORY]: (payload) => payload,
});
