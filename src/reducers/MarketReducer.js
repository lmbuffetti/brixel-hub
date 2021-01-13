import {
  handleActions,
} from 'redux-actions';
import {
  SET_SELLER_PROPERTIES,
} from '../actions/types/MarketTypes';

export const defaultState = {
  sellerProperties: [],
};

export default handleActions(
  {
    [SET_SELLER_PROPERTIES]: (state, action) => ({
      ...state,
      sellerProperties: action.payload,
    }),
  },
  defaultState,
);
