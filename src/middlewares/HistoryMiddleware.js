import {
  SET_PROPERTY_OWNER_HISTORY_LISTINGS,
  GET_HISTORY_LISTINGS,
  SET_PROPERTY_HISTORY_LISTINGS,
  SET_USER_HISTORY_LISTINGS,
  SET_DEAL_HISTORY_LISTINGS,
} from '../actions/types/HistoryTypes';

import {
  SPINNER_ON,
  SPINNER_OFF,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkHistory = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_HISTORY_LISTINGS: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      // eslint-disable-next-line no-case-declarations
      const queryParams = `?parent=${action.payload.parent}&order=${action.payload.order}&direction=${action.payload.direction}`;
      api.history.getHistoryList(action.payload.resultsPerPage, action.payload.offset, queryParams)
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
            store.dispatch({
              type: SPINNER_OFF,
            });
          } else {
            // Should dispatch error state
            console.warn('Could not get any history for this object');
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
