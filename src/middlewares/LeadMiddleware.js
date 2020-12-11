import get from 'lodash/get';
import take from 'lodash/take';
import {
  GET_LEAD_LISTINGS,
  GET_GLOBAL_LEAD_LISTINGS,
  SET_GLOBAL_LEAD_LISTINGS,
} from '../actions/types/LeadTypes';

import {
  SET_PROPERTY_LISTINGS,
} from '../actions/types/PropertyTypes';

import {
  SET_USER_LISTINGS,
} from '../actions/types/UserTypes';

import {
  SPINNER_ON,
  SPINNER_OFF,
  SPINNER_SMALL_ON,
  SPINNER_SMALL_OFF,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkLead = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_LEAD_LISTINGS: {
      next(action);
      // eslint-disable-next-line no-case-declarations
      const {
        smallLoader,
      } = action.payload;
      // delete action.payload.smallLoader;
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL_ON,
          payload: smallLoader,
        });
      } else {
        store.dispatch({
          type: SPINNER_ON,
        });
      }
      const filterData = get(action, 'payload.filterData', null) ? `&${get(action, 'payload.filterData', '')}` : '';
      const queryParams = `?search=${action.payload.text}&order=${action.payload.order}&direction=${action.payload.direction}&company=${action.payload.company}${filterData}`;
      api.lead.getLeadList(action.payload.leadType, action.payload.resultsPerPage, action.payload.offset, queryParams)
        .then((response) => {
          if (get(response, 'data.data', []).length > 0) {
            if (action.payload.leadType === 'page') {
              const data = {
                properties: response.data.data,
                total: response.data.total,
              };
              store.dispatch({
                type: SET_PROPERTY_LISTINGS,
                payload: data,
              });
            } else if (action.payload.leadType === 'user') {
              const data = {
                users: response.data.data,
                total: response.data.total,
              };
              store.dispatch({
                type: SET_USER_LISTINGS,
                payload: data,
              });
            }
            if (smallLoader) {
              store.dispatch({
                type: SPINNER_SMALL_OFF,
                payload: smallLoader,
              });
            } else {
              store.dispatch({
                type: SPINNER_OFF,
              });
            }
          } else {
            // Should dispatch error state
            if (action.payload.leadType === 'page') {
              const data = {
                properties: [],
                total: 0,
              };
              store.dispatch({
                type: SET_PROPERTY_LISTINGS,
                payload: data,
              });
            } else if (action.payload.leadType === 'user') {
              const data = {
                users: [],
                total: 0,
              };
              store.dispatch({
                type: SET_USER_LISTINGS,
                payload: data,
              });
            }
            if (smallLoader) {
              store.dispatch({
                type: SPINNER_SMALL_OFF,
                payload: smallLoader,
              });
            } else {
              store.dispatch({
                type: SPINNER_OFF,
              });
            }
          }
        });
      break;
    }
    case GET_GLOBAL_LEAD_LISTINGS: {
      next(action);
      const queryParams = `?search=${action.payload.text}`;
      let properties;
      let users;
      const pageQuery = api.lead.getLeadList('page', action.payload.resultsPerPage, action.payload.offset, queryParams).then((res) => (properties = res.data));
      const userQuery = api.lead.getLeadList('user', action.payload.resultsPerPage, action.payload.offset, queryParams).then((res) => (users = res.data));
      Promise.all([pageQuery, userQuery]).then(() => {
        let filtUsers = {
          ...users,
          data: take(users.data, 5),
        };
        let filtProperties = {
          ...properties,
          data: take(properties.data, 5),
        };
        if (properties.data.length < 5) {
          filtUsers = {
            ...users,
            data: take(users.data, 10 - properties.data.length),
          };
        }

        if (users.data.length < 5) {
          filtProperties = {
            ...properties,
            data: take(properties.data, 10 - users.data.length),
          };
        }

        store.dispatch({
          type: SET_GLOBAL_LEAD_LISTINGS,
          payload: {
            properties: filtProperties,
            users: filtUsers,
          },
        });
      });
      break;
    }
    default:
      next(action);
  }
};

export default checkLead;
