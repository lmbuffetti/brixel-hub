import { handleActions } from 'redux-actions';
import {
  SET_ESTIMATION,
  SET_PROPERTY_LISTINGS,
  SET_ACTIVE_SINGLE_PROPERTY,
  SET_MARKET_CHECK,
} from '../actions/types/PropertyTypes';

export const defaultState = {
  estimation: {},
  marketCheck: {},
  properties: [],
  property: {},
};

export default handleActions(
  {
    [SET_ESTIMATION]: (state, action) => ({
      ...state,
      estimation: action.payload,
    }),
    [SET_PROPERTY_LISTINGS]: (state, action) => ({
      ...state,
      properties: action.payload,
    }),
    [SET_ACTIVE_SINGLE_PROPERTY]: (state, action) => ({
      ...state,
      property: action.payload,
    }),
    [SET_MARKET_CHECK]: (state, action) => ({
      ...state,
      marketCheck: action.payload,
    }),
  },
  defaultState,
);
