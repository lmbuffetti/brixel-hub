import {
  SPINNER_ON,
  SPINNER_OFF,
} from '../actions/types/CommonTypes';

import {
  GET_USER_DEALS,
  SET_USER_DEALS,
} from '../actions/types/DealsTypes';

import {
  SET_USER_BUYER_PROPERTIES,
} from '../actions/types/UserTypes';

import api from '../controllers/api/config';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_USER_DEALS: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.user.getPagesByDealByUser(action.payload)
        .then((res) => {
          store.dispatch({ type: SET_USER_DEALS, payload: res.data });
          const pageList = [];
          const call2 = [];
          // eslint-disable-next-line no-return-assign
          res.data.forEach((item) => {
            const checkPage = pageList.filter((f) => f.id === item.page.id);
            if (checkPage.length === 0) {
              pageList.push(item.page);
            }
          });
          store.dispatch({ type: SET_USER_BUYER_PROPERTIES, payload: pageList });
          store.dispatch({ type: SPINNER_OFF });
          if (call2.length === 0) store.dispatch({ type: SPINNER_OFF });
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
