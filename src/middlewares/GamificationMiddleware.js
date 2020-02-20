import {
  GET_ACHIEVEMENT,
  SET_ACHIEVEMENT,
  GET_GAMEGROUP,
  SET_GAMEGROUP,
} from '../actions/types/GamificationTypes';

import api from '../controllers/api/config';

const checkGamification = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_ACHIEVEMENT: {
      next(action);
      api.gamification.getGameAchievementList(20, 0)
        .then((res) => {
          console.log(res.data);
          store.dispatch({ type: SET_ACHIEVEMENT, payload: res.data });
        });
      break;
    }
    case GET_GAMEGROUP: {
      next(action);
      api.gamification.getGroupList(20, 0)
        .then((res) => {
          console.log(res.data);
          store.dispatch({ type: SET_GAMEGROUP, payload: res.data });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkGamification;
