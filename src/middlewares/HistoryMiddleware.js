import {
  SET_PROPERTY_OWNER_HISTORY_LISTINGS,
  GET_HISTORY_LISTINGS,
  SET_PROPERTY_HISTORY_LISTINGS,
  SET_USER_HISTORY_LISTINGS,
  SET_DEAL_HISTORY_LISTINGS,
  GET_HISTORY_FEED,
  SET_HISTORY_FEED,
} from '../actions/types/HistoryTypes';

import {
  SPINNER_ON,
  SPINNER_OFF,
  SPINNER_SMALL,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkHistory = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_HISTORY_LISTINGS: {
      next(action);
      // eslint-disable-next-line no-case-declarations
      const {
        direction,
        offset,
        order,
        parent,
        resultsPerPage,
        actionStubs,
        smallLoader,
      } = action.payload;
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL,
          payload: {
            [smallLoader]: true,
          },
        });
      } else {
        store.dispatch({
          type: SPINNER_ON,
        });
      }

      const getType = () => {
        if (action.payload.type === 'owner') return 'user';
        return action.payload.type;
      };

      const queryParams = `?parent=${parent}&order=${order}&direction=${direction}&historyType=${getType()}`;
      api.history.getHistoryList(resultsPerPage, offset, queryParams, actionStubs)
        .then((response) => {
          if (response.data.total > 0) {
            if (action.payload.type === 'page') {
              store.dispatch({
                type: SET_PROPERTY_HISTORY_LISTINGS,
                payload: response.data,
              });
            }
            if (action.payload.type === 'user') {
              store.dispatch({
                type: SET_USER_HISTORY_LISTINGS,
                payload: response.data,
              });
            }
            if (action.payload.type === 'deal') {
              store.dispatch({
                type: SET_DEAL_HISTORY_LISTINGS,
                payload: response.data,
              });
            }
            if (action.payload.type === 'owner') {
              store.dispatch({
                type: SET_PROPERTY_OWNER_HISTORY_LISTINGS,
                payload: response.data,
              });
            }
          }
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case GET_HISTORY_FEED: {
      next(action);
      const {
        arrayStubs,
        direction,
        id,
        offset,
        order,
        resultsPerPage,
        smallLoader,
      } = action.payload;
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL,
          payload: {
            [smallLoader]: true,
          },
        });
      } else {
        store.dispatch({
          type: SPINNER_ON,
        });
      }
      const queryParams = `?order=${order}&direction=${direction}`;
      api.history.historyFeed(id, resultsPerPage, offset, queryParams, arrayStubs)
        .then((res) => {
          store.dispatch({ type: SET_HISTORY_FEED, payload: res.data });
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkHistory;
