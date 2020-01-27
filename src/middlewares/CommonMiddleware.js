import {
  SPINNER_ON,
  SPINNER_OFF,
  SET_LANGUAGE,
} from '../actions/types/CommonTypes';
import { configLang } from '../constants/global';

import api from '../controllers/api/config';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    default:
      next(action);
  }
};

export default checkCommon;
