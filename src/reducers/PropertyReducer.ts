import {handleActions} from 'redux-actions';
import {
  SET_ACTIVE_MARKET_OVERLAY_PROPERTY,
  SET_ACTIVE_MARKET_OVERLAY_PROPERTY_LISTS,
  SET_ACTIVE_SINGLE_PROPERTY,
  SET_ACTIVE_SINGLE_PROPERTY_ACTIVE_PACKAGE,
  SET_ACTIVE_SINGLE_PROPERTY_BOOKINGS,
  SET_ACTIVE_SINGLE_PROPERTY_BOOKINGS_SLOTS,
  SET_ACTIVE_SINGLE_PROPERTY_DEALS_COUNT,
  SET_ESTIMATION,
  SET_PACKAGE_PROPERTY,
  SET_PACKAGES_PROPERTY,
  SET_PAGE_DEALS,
} from '../actions/types/PropertyTypes';

import {SET_PROPERTY_HISTORY_LISTINGS, SET_PROPERTY_OWNER_HISTORY_LISTINGS} from '../actions/types/HistoryTypes';

export const defaultState = {
  activeMarketOverlayProperty: {},
  activeMarketOverlayPropertyLists: null,
  activeSingleProperty: {},
  activeSinglePropertyActivePackage: {},
  activeSinglePropertyBooking: [],
  activeSinglePropertyBookingSlots: [],
  activeSinglePropertyDeals: null,
  activeSinglePropertyDealsCount: {},
  activeSinglePropertyHistory: {},
  activeSinglePropertyOwnerHistory: {},
  activeSinglePropertyPackage: [],
  estimation: {},
  packagesProperty: [],
  propertyListings: [],
};

export default handleActions<any>(
  {
    [SET_ESTIMATION]: (state, action) => ({
      ...state,
      estimation: action.payload,
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
    [SET_ACTIVE_SINGLE_PROPERTY_BOOKINGS_SLOTS]: (state, action) => ({
      ...state,
      activeSinglePropertyBookingSlots: action.payload,
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
    [SET_PROPERTY_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSinglePropertyHistory: action.payload,
    }),
    [SET_PROPERTY_OWNER_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSinglePropertyOwnerHistory: action.payload,
    }),
    [SET_PACKAGE_PROPERTY]: (state, action) => ({
      ...state,
      activeSinglePropertyPackage: action.payload,
    }),
    [SET_ACTIVE_SINGLE_PROPERTY_ACTIVE_PACKAGE]: (state, action) => ({
      ...state,
      activeSinglePropertyActivePackage: action.payload,
    }),
  },
  defaultState,
);
