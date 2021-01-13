import {
  createActions,
} from 'redux-actions';
import {
  GET_SELLER_PROPERTIES,
  SET_SELLER_PROPERTIES,
  GET_FAVORITES_PROPERTIES,
  SET_FAVORITES_PROPERTIES,
} from './types/MarketTypes';

export const {
  getSellerProperties,
  setSellerProperties,
  getFavoritesProperties,
  setFavoritesProperties,
} = createActions({
  [GET_SELLER_PROPERTIES]: (payload) => payload,
  [SET_SELLER_PROPERTIES]: (payload) => payload,
  [GET_FAVORITES_PROPERTIES]: (payload) => payload,
  [SET_FAVORITES_PROPERTIES]: (payload) => payload,
});
