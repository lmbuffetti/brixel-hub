import has from 'lodash/has';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';

import { set } from 'lodash';

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
            const calls = [];
            const history = response.data;

            if (action.payload.type === 'page') {
              // Populate the parent/child of each entry with the active property/property owner
              history.data.forEach((entry) => {
                // If the action is a schedule or favorite,
                // we need to call the api to know who the user is
                // since it will not be the active property owner
                if (entry.actionStub === 'page-schedule' || entry.actionStub === 'page-add-favorite') {
                  if (has(entry, 'child')) calls.push(api.user.getCompleteUser(entry.child));
                } else if (has(entry, 'parent')) {
                  set(entry, 'parent', store.getState().property.activeSingleProperty);
                }
              });

              if (calls.length > 0) {
                Promise.all(calls).then((res) => {
                  res.forEach((populateObj) => {
                    const childIndex = findIndex(history.data, (h) => h.child === get(populateObj.data, 'id', ''));
                    set(history.data[childIndex], 'child', populateObj.data);
                  });
                  store.dispatch({
                    type: SET_PROPERTY_HISTORY_LISTINGS,
                    payload: history,
                  });
                });
              } else {
                store.dispatch({
                  type: SET_PROPERTY_HISTORY_LISTINGS,
                  payload: history,
                });
              }
            }
            if (action.payload.type === 'user') {
              // Populate the parent of each entry with the active user
              history.data.forEach((entry) => {
                if (has(entry, 'parent')) set(entry, 'parent', store.getState().user.activeSingleUser);
              });

              store.dispatch({
                type: SET_USER_HISTORY_LISTINGS,
                payload: history,
              });
            }
            if (action.payload.type === 'deal') {
              store.dispatch({
                type: SET_DEAL_HISTORY_LISTINGS,
                payload: response.data,
              });
            }
            if (action.payload.type === 'owner') {
              // Populate the parent of each entry with the active property owner
              history.data.forEach((entry) => {
                if (has(entry, 'parent')) set(entry, 'parent', store.getState().property.activeSingleProperty.owner);
              });

              store.dispatch({
                type: SET_PROPERTY_OWNER_HISTORY_LISTINGS,
                payload: history,
              });
            } else {
              // Should dispatch error state
              // eslint-disable-next-line no-console
              console.warn('Could not get any history for this object');
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
