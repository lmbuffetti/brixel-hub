import {
  createActions,
} from 'redux-actions';
import {
  GET_SELLER_PROPERTIES,
  SET_SELLER_PROPERTIES,
  GET_FAVORITES_PROPERTIES,
  SET_FAVORITES_PROPERTIES,
  GET_NEW_PROPERTIES,
  SET_NEW_PROPERTIES,
  GET_PREMIUM_PROPERTIES,
  SET_PREMIUM_PROPERTIES,
  GET_PREMARKET_PROPERTIES,
  SET_PREMARKET_PROPERTIES,
} from './types/MarketTypes';

export const {
  getSellerProperties,
  setSellerProperties,
  getFavoritesProperties,
  setFavoritesProperties,
  getNewProperties,
  setNewProperties,
  getPremiumProperties,
  setPremiumProperties,
  getPremarketProperties,
  SetPremarketProperties,
} = createActions({
  [GET_SELLER_PROPERTIES]: (payload) => payload,
  [SET_SELLER_PROPERTIES]: (payload) => payload,
  [GET_FAVORITES_PROPERTIES]: (payload) => payload,
  [SET_FAVORITES_PROPERTIES]: (payload) => payload,
  [GET_NEW_PROPERTIES]: (payload) => payload,
  [SET_NEW_PROPERTIES]: (payload) => payload,
  [GET_PREMIUM_PROPERTIES]: (payload) => payload,
  [SET_PREMIUM_PROPERTIES]: (payload) => payload,
  [GET_PREMARKET_PROPERTIES]: (payload) => payload,
  [SET_PREMARKET_PROPERTIES]: (payload) => payload,
});
