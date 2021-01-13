import {
  handleActions,
} from 'redux-actions';
import {
  SET_SELLER_PROPERTIES,
  SET_FAVORITES_PROPERTIES,
  SET_NEW_PROPERTIES,
  SET_PREMIUM_PROPERTIES,
  SET_PREMARKET_PROPERTIES,
} from '../actions/types/MarketTypes';

export const defaultState = {
  sellerProperties: [],
  favoritesProperties: [],
  newProperties: [],
  premiumProperties: [],
  preMarketProperties: [],
};

export default handleActions(
  {
    [SET_SELLER_PROPERTIES]: (state, action) => ({
      ...state,
      sellerProperties: action.payload,
    }),
    [SET_FAVORITES_PROPERTIES]: (state, action) => ({
      ...state,
      favoritesProperties: action.payload,
    }),
    [SET_NEW_PROPERTIES]: (state, action) => ({
      ...state,
      newProperties: action.payload,
    }),
    [SET_PREMIUM_PROPERTIES]: (state, action) => ({
      ...state,
      premiumProperties: action.payload,
    }),
    [SET_PREMARKET_PROPERTIES]: (state, action) => ({
      ...state,
      preMarketProperties: action.payload,
    }),
  },
  defaultState,
);
