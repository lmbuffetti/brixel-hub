import {
  GET_ACHIEVEMENT,
  SET_ACHIEVEMENT,
  GET_GAMEGROUP,
  SET_GAMEGROUP,
  ADD_GAME_HISTORY,
  GET_GAME_HISTORY,
  SET_GAME_HISTORY,
} from '../actions/types/GamificationTypes';

import {
  SET_AWARDS,
  SET_BRIXEL_POINTS, SET_LOGGED_IN_USER,
} from '../actions/types/UserTypes';

import api from '../controllers/api/config';
import gameAchievement from '../resources/localData/gameAchievement.json';
import gameGroup from '../resources/localData/gameGroup.json';
import gameHistory from '../resources/localData/gameHistory.json';
import { SPINNER_OFF } from '../actions/types/CommonTypes.json';

const checkGamification = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_ACHIEVEMENT: {
      next(action);
      api.gamification.getGameAchievementList(20, 0)
        .then((res) => {
          store.dispatch({ type: SET_ACHIEVEMENT, payload: res.data });
        })
        .catch(() => {
          if (window.location.href.includes('localhost')) {
            store.dispatch({ type: SET_ACHIEVEMENT, payload: gameAchievement });
          }
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case GET_GAMEGROUP: {
      next(action);
      api.gamification.getGroupList(20, 0)
        .then((res) => {
          store.dispatch({ type: SET_GAMEGROUP, payload: res.data });
        })
        .catch(() => {
          if (window.location.href.includes('localhost')) {
            store.dispatch({ type: SET_GAMEGROUP, payload: gameGroup });
          }
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case GET_GAME_HISTORY: {
      next(action);
      const userLoggedIn = store.getState().user.loggedInUser.user.id;
      api.gamification.getGameHistoryByUser(userLoggedIn)
        .then((res) => {
          store.dispatch({ type: SET_GAME_HISTORY, payload: res.data });
          store.dispatch({ type: SET_AWARDS, payload: res.data.numAwards });
          store.dispatch({ type: SET_BRIXEL_POINTS, payload: res.data.actualPoints });
        })
        .catch(() => {
          if (window.location.href.includes('localhost')) {
            store.dispatch({ type: SET_GAME_HISTORY, payload: gameHistory });
            store.dispatch({ type: SET_AWARDS, payload: 2 });
            store.dispatch({ type: SET_BRIXEL_POINTS, payload: 1000 });
          }
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case ADD_GAME_HISTORY: {
      next(action);
      const { id } = action.payload;
      delete action.payload.id;
      api.gamification.addGameHistory(id, action.payload)
        .then((res) => {
          if (typeof res.data.status === 'undefined') {
            store.dispatch({ type: SET_GAME_HISTORY, payload: res.data });
            store.dispatch({ type: SET_AWARDS, payload: res.data.numAwards });
            store.dispatch({ type: SET_BRIXEL_POINTS, payload: res.data.actualPoints });
          }
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkGamification;
