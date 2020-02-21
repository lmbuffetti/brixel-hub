import {
  GET_ACHIEVEMENT,
  SET_ACHIEVEMENT,
  GET_GAMEGROUP,
  SET_GAMEGROUP,
  ADD_GAME_HISTORY,
  GET_GAME_HISTORY,
  SET_GAME_HISTORY,
} from '../actions/types/GamificationTypes';

import api from '../controllers/api/config';

const checkGamification = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_ACHIEVEMENT: {
      next(action);
      api.gamification.getGameAchievementList(20, 0)
        .then((res) => {
          store.dispatch({ type: SET_ACHIEVEMENT, payload: res.data });
        });
      break;
    }
    case GET_GAMEGROUP: {
      next(action);
      api.gamification.getGroupList(20, 0)
        .then((res) => {
          store.dispatch({ type: SET_GAMEGROUP, payload: res.data });
        });
      break;
    }
    case GET_GAME_HISTORY: {
      next(action);
      api.gamification.getGameHistory(20, 0)
        .then((res) => {
          store.dispatch({ type: SET_GAME_HISTORY, payload: res.data });
        });
      break;
    }
    case ADD_GAME_HISTORY: {
      next(action);
      const data = {
        page: 'page-stub',
        achievement: 'stub',
      };
      break;
    }
    default:
      next(action);
  }
};

export default checkGamification;
