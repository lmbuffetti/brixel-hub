import {
  createActions,
} from 'redux-actions';
import {
  GET_SELLER_PROPERTIES,
  SET_SELLER_PROPERTIES,
} from './types/MarketTypes';

export const {
  getSellerProperties,
  setSellerProperties,
} = createActions({
  [GET_SELLER_PROPERTIES]: (payload) => payload,
  [SET_SELLER_PROPERTIES]: (payload) => payload,
});
