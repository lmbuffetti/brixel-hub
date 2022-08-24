import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  SPINNER_ON,
  SPINNER_OFF,
  SPINNER_SMALL,
} from '../actions/types/CommonTypes';

import {
  SET_CONTENT,
  GET_CONTENT,
} from '../actions/types/CraftCMS';

import api from '../controllers/api/graphql';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    // DISPATCH TO SEND EMAIL
    case GET_CONTENT: {
      next(action);
      const data = cloneDeep(action.payload);
      const { smallLoader } = data;
      delete data.smallLoader;
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
      api.craftCMS.getHubContent(data)
        .then((res) => {
          store.dispatch({ type: SET_CONTENT, payload: get(res, 'data.data.placementEntries[0].placementContent', [])})
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: 'sentMessage',
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

export default checkCommon;
