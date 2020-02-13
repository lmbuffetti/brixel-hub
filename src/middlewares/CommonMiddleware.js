import {
  SPINNER_ON,
  SPINNER_OFF,
  SEND_GENERIC_MAIL,
  SET_LANGUAGE,
} from '../actions/types/CommonTypes';
import { configLang } from '../constants/global';

import api from '../controllers/api/config';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case SEND_GENERIC_MAIL: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.common.sendGenericMessage(action.payload)
        .then((res) => {
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch((res) => {
          // console.log(res.data);
        })
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
