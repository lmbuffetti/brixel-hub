import { createActions } from 'redux-actions';
import {
  CREATE_USER,
  CHECK_TOKEN,
  DO_LOGOUT,
  GET_TOKEN,
  RECOVER_PASSWORD,
  SET_USER,
  UPDATE_USER,
  VALIDATE_USER,
} from './types/UserTypes';

export const {
  createUser,
  checkToken,
  doLogout,
  getToken,
  recoverPassword,
  setUser,
  updateUser,
  validateUser,
} = createActions({
  [CREATE_USER]: (payload) => payload,
  [CHECK_TOKEN]: (payload) => payload,
  [DO_LOGOUT]: (payload) => payload,
  [GET_TOKEN]: (payload) => payload,
  [RECOVER_PASSWORD]: (payload) => payload,
  [SET_USER]: (payload) => payload,
  [UPDATE_USER]: (payload) => payload,
  [VALIDATE_USER]: (payload) => payload,
});
