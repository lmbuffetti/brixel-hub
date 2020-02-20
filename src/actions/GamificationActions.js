import { createActions } from 'redux-actions';
import {
  GET_ACHIEVEMENT,
  SET_ACHIEVEMENT,
  GET_GAMEGROUP,
  SET_GAMEGROUP,
} from './types/GamificationTypes';

export const {
  getAchievement,
  setAchievement,
  getGamegroup,
  setGamegroup,
} = createActions({
  [GET_ACHIEVEMENT]: (payload) => payload,
  [SET_ACHIEVEMENT]: (payload) => payload,
  [GET_GAMEGROUP]: (payload) => payload,
  [SET_GAMEGROUP]: (payload) => payload,
});
