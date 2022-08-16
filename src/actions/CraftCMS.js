import { createActions } from 'redux-actions';
import {
  GET_CONTENT,
  SET_CONTENT,
} from './types/CraftCMS';

export const {
  getContent,
  setContent,
} = createActions({
  [GET_CONTENT]: (payload) => payload,
  [SET_CONTENT]: (payload) => payload,
});
