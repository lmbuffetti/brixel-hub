import { createActions } from 'redux-actions';
import { GET_HISTORY_LISTINGS, SET_DEAL_HISTORY_LISTINGS, SET_DEAL_OWNER_HISTORY_LISTINGS, SET_PROPERTY_HISTORY_LISTINGS, SET_PROPERTY_OWNER_HISTORY_LISTINGS, SET_USER_HISTORY_LISTINGS, } from './types/HistoryTypes';
export const { getHistoryListings, setPropertyHistoryListings, setPropertyOwnerHistoryListings, setUserHistoryListings, setDealHistoryListings, setDealOwnerHistoryListings, } = createActions({
    [GET_HISTORY_LISTINGS]: (payload) => payload,
    [SET_PROPERTY_HISTORY_LISTINGS]: (payload) => payload,
    [SET_PROPERTY_OWNER_HISTORY_LISTINGS]: (payload) => payload,
    [SET_USER_HISTORY_LISTINGS]: (payload) => payload,
    [SET_DEAL_HISTORY_LISTINGS]: (payload) => payload,
    [SET_DEAL_OWNER_HISTORY_LISTINGS]: (payload) => payload,
});
