import { handleActions } from 'redux-actions';
import {
  SET_ESTIMATION,
  SET_PROPERTY_LISTINGS,
  SET_ACTIVE_SINGLE_PROPERTY,
  SET_MARKET_CHECK,
  SET_ACTIVE_SINGLE_PROPERTY_BOOKINGS,
} from '../actions/types/PropertyTypes';

export const defaultState = {
  estimation: {},
  marketCheck: {},
  propertyListings: [],
  activeSingleProperty: {},
  activeSinglePropertyBooking: [],
};

export default handleActions(
  {
    [SET_ESTIMATION]: (state, action) => ({
      ...state,
      estimation: action.payload,
    }),
    [SET_PROPERTY_LISTINGS]: (state, action) => ({
      ...state,
      propertyListings: action.payload,
    }),
    [SET_ACTIVE_SINGLE_PROPERTY]: (state, action) => ({
      ...state,
      activeSingleProperty: action.payload,
    }),
    [SET_ACTIVE_SINGLE_PROPERTY_BOOKINGS]: (state, action) => ({
      ...state,
      activeSinglePropertyBooking: action.payload,
    }),
    [SET_MARKET_CHECK]: (state, action) => ({
      ...state,
      marketCheck: action.payload,
    }),
  },
  defaultState,
);
