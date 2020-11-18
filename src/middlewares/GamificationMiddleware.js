import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
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
  SET_BRIXEL_POINTS,
} from '../actions/types/UserTypes';

import api from '../controllers/api/config';
import { gameAchievement } from '../resources/localData/gameAchievement';
import { gameGroupDataLocal } from '../resources/localData/gameGroup';
import { gameHistoryDataLocal } from '../resources/localData/gameHistory';
import { SPINNER_OFF, SPINNER_SMALL_ON, SPINNER_SMALL_OFF } from '../actions/types/CommonTypes';

const checkGamification = (store) => (next) => (action) => {
  switch (action.type) {
    // DISPATCH TO GET THE ACHIEVEMENTS LIST
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
    // DISPATCH TO GET THE GAME GROUP
    case GET_GAMEGROUP: {
      next(action);
      api.gamification.getGroupList(20, 0)
        .then((res) => {
          store.dispatch({ type: SET_GAMEGROUP, payload: res.data });
        })
        .catch(() => {
          if (window.location.href.includes('localhost')) {
            store.dispatch({ type: SET_GAMEGROUP, payload: gameGroupDataLocal });
          }
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // DISPATCH TO GET THE GAME HISTORY BY USER ID
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
            store.dispatch({ type: SET_GAME_HISTORY, payload: gameHistoryDataLocal });
            store.dispatch({ type: SET_AWARDS, payload: 2 });
            store.dispatch({ type: SET_BRIXEL_POINTS, payload: 1000 });
          }
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // DISPATCH TO ADD A GAME HISTORY BY USER ID AND, IF NECESSARY, PAGE ID
    case ADD_GAME_HISTORY: {
      next(action);
      const obj = cloneDeep(action.payload);
      const {
        id, stub, smallLoader, redirectTo,
      } = action.payload;
      delete obj.id;
      delete obj.smallLoader;
      delete obj.redirectTo;
      const gameGroup = get(store.getState(), 'gamification.gameGroup', []);
      const gameHistory = get(store.getState(), 'gamification.gameHistory', []);
      let currentGroup = {};
      gameGroup.forEach((group) => {
        group.achievements.forEach((game) => {
          if (game.stub === stub) currentGroup = game;
        });
      });
      const pageID = get(store.getState(), 'property.activeSingleProperty.id', 0);
      const gameHistoryData = get(gameHistory, 'data', []);
      const checkExist = gameHistoryData.find((item) => item.achievement.id === currentGroup.id && pageID === item.page);
      if (typeof checkExist === 'undefined' || currentGroup.isCumulative || id) {
        let newID = id;
        let data = cloneDeep(action.payload);
        if (currentGroup.id) {
          newID = get(store.getState(), 'user.loggedInUser.user.id', 0);
          data = {
            page: get(store.getState(), 'property.activeSingleProperty.stub', 0),
            achievement: stub,
          };
        }
        if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
        api.gamification.addGameHistory(newID, data)
          .then((res) => {
            if (typeof res.data.status === 'undefined' && typeof res.data.statusCode === 'undefined') {
              store.dispatch({ type: GET_GAME_HISTORY });
              if (redirectTo) window.location.href = redirectTo;
            }
            if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          });
      } else if (redirectTo) window.location.href = redirectTo;
      break;
    }
    default:
      next(action);
  }
};

export default checkGamification;
