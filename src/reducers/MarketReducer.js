import {
  handleActions,
} from 'redux-actions';
import {
  SET_ALL_PROPERTIES,
  SET_OWNED_PROPERTIES,
  SET_OWNED_ESTIMATIONS,
  SET_FAVORITES_PROPERTIES,
  SET_NEW_PROPERTIES,
  SET_LAST_VIEWED_PROPERTIES,
  SET_PREMIUM_PROPERTIES,
  SET_PREMARKET_PROPERTIES,
  SET_WHISHLIST_PROPERTIES,
} from '../actions/types/MarketTypes';

export const defaultState = {
  allProperties: {},
  ownerProperties: {},
  ownerEstimations: {},
  favoritesProperties: {},
  newProperties: {},
  lastViewedProperties: {},
  premiumProperties: {},
  preMarketProperties: {},
  whishlistProperties: {},
};

export default handleActions(
  {
    [SET_ALL_PROPERTIES]: (state, action) => ({
      ...state,
      allProperties: action.payload,
    }),
    [SET_WHISHLIST_PROPERTIES]: (state, action) => ({
      ...state,
      whishlistProperties: action.payload,
    }),
    [SET_OWNED_PROPERTIES]: (state, action) => ({
      ...state,
      ownerProperties: action.payload,
    }),
    [SET_OWNED_ESTIMATIONS]: (state, action) => ({
      ...state,
      ownerEstimations: action.payload,
    }),
    [SET_FAVORITES_PROPERTIES]: (state, action) => ({
      ...state,
      favoritesProperties: action.payload,
    }),
    [SET_NEW_PROPERTIES]: (state, action) => ({
      ...state,
      newProperties: action.payload,
    }),
    [SET_LAST_VIEWED_PROPERTIES]: (state, action) => ({
      ...state,
      lastViewedProperties: action.payload,
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
