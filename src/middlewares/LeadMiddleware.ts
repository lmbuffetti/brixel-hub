import take from 'lodash/take';
import {GET_GLOBAL_LEAD_LISTINGS, SET_GLOBAL_LEAD_LISTINGS,} from '../actions/types/LeadTypes';

import api from '../controllers/api/config';

const checkLead = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_GLOBAL_LEAD_LISTINGS: {
      next(action);
      const queryParams = `?search=${action.payload.text}`;
      let properties;
      let users;
      // eslint-disable-next-line no-return-assign
      const pageQuery = api.lead.getLeadList('page', action.payload.resultsPerPage, action.payload.offset, queryParams).then((res) => (properties = res.data));
      // eslint-disable-next-line no-return-assign
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
