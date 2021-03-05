import { handleActions } from 'redux-actions';
import {
  SET_ACTIVE_SINGLE_PROPERTY,
  SET_ACTIVE_SINGLE_PROPERTY_BOOKINGS,
  SET_ACTIVE_MARKET_OVERLAY_PROPERTY,
  SET_ACTIVE_MARKET_OVERLAY_PROPERTY_LISTS,
  SET_ESTIMATION,
  SET_MARKET_CHECK,
  SET_PACKAGES_PROPERTY,
  SET_PAGE_DEALS,
  SET_PROPERTY_LISTINGS,
  SET_ACTIVE_SINGLE_PROPERTY_DEALS_COUNT,
} from '../actions/types/PropertyTypes';

export const defaultState = {
  activeSingleProperty: {},
  activeMarketOverlayProperty: {},
  activeMarketOverlayPropertyLists: null,
  activeSinglePropertyBooking: [],
  activeSinglePropertyDeals: [],
  activeSinglePropertyDealsCount: {},
  estimation: {},
  marketCheck: {},
  packagesProperty: [],
  propertyListings: [],
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
    [SET_ACTIVE_MARKET_OVERLAY_PROPERTY]: (state, action) => ({
      ...state,
      activeMarketOverlayProperty: action.payload,
    }),
    [SET_ACTIVE_MARKET_OVERLAY_PROPERTY_LISTS]: (state, action) => ({
      ...state,
      activeMarketOverlayPropertyLists: action.payload,
    }),
    [SET_ACTIVE_SINGLE_PROPERTY_BOOKINGS]: (state, action) => ({
      ...state,
      activeSinglePropertyBooking: action.payload,
    }),
    [SET_MARKET_CHECK]: (state, action) => ({
      ...state,
      marketCheck: action.payload,
    }),
    [SET_PACKAGES_PROPERTY]: (state, action) => ({
      ...state,
      packagesProperty: action.payload,
    }),
    [SET_PAGE_DEALS]: (state, action) => ({
      ...state,
      activeSinglePropertyDeals: action.payload,
    }),
    [SET_ACTIVE_SINGLE_PROPERTY_DEALS_COUNT]: (state, action) => ({
      ...state,
      activeSinglePropertyDealsCount: action.payload,
    }),
  },
  defaultState,
);
