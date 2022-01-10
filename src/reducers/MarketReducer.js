import {
  handleActions
} from 'redux-actions';
import {
  SET_ALL_PROPERTIES,
  SET_OWNED_PROPERTIES,
  SET_OWNED_ESTIMATIONS,
  SET_FAVORITES_PROPERTIES,
  SET_NEW_PROPERTIES,
  SET_LAST_VIEWED_PROPERTIES,
  SET_PREMIUM_PROPERTIES,
  SET_PREMIUM_EUROPE_PROPERTIES,
  SET_PREMARKET_PROPERTIES,
  SET_WISHLIST_PROPERTIES,
  SET_PREMARKET_STATS
} from '../actions/types/MarketTypes';

export const defaultState = {
  allProperties: {},
  ownerProperties: {},
  ownerEstimations: {},
  favoritesProperties: {},
  newProperties: {},
  lastViewedProperties: {},
  premiumEuropeProperties: {},
  premiumProperties: {},
  preMarketProperties: {},
  preMarketStats: {},
  wishlistProperties: {}
};

export default handleActions(
  {
    [SET_ALL_PROPERTIES]: (state, action) => ({
      ...state,
      allProperties: action.payload
    }),
    [SET_PREMARKET_STATS]: (state, action) => ({
      ...state,
      preMarketStats: action.payload
    }),
    [SET_WISHLIST_PROPERTIES]: (state, action) => ({
      ...state,
      wishlistProperties: action.payload
    }),
    [SET_OWNED_PROPERTIES]: (state, action) => ({
      ...state,
      ownerProperties: action.payload
    }),
    [SET_OWNED_ESTIMATIONS]: (state, action) => ({
      ...state,
      ownerEstimations: action.payload
    }),
    [SET_FAVORITES_PROPERTIES]: (state, action) => ({
      ...state,
      favoritesProperties: action.payload
    }),
    [SET_NEW_PROPERTIES]: (state, action) => ({
      ...state,
      newProperties: action.payload
    }),
    [SET_LAST_VIEWED_PROPERTIES]: (state, action) => ({
      ...state,
      lastViewedProperties: action.payload
    }),
    [SET_PREMIUM_PROPERTIES]: (state, action) => ({
      ...state,
      premiumProperties: action.payload
    }),
    [SET_PREMIUM_EUROPE_PROPERTIES]: (state, action) => ({
      ...state,
      premiumEuropeProperties: action.payload
    }),
    [SET_PREMARKET_PROPERTIES]: (state, action) => ({
      ...state,
      preMarketProperties: action.payload
    })
  },
  defaultState
);
