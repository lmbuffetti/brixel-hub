import {
  handleActions,
} from 'redux-actions';
import {
  SET_SELLER_PROPERTIES,
  SET_FAVORITES_PROPERTIES,
} from '../actions/types/MarketTypes';

export const defaultState = {
  sellerProperties: [],
  favoritesProperties: [],
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
  },
  defaultState,
);
