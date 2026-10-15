import { handleActions } from 'redux-actions';
import { SET_PROPERTY_HISTORY_LISTINGS, SET_PROPERTY_OWNER_HISTORY_LISTINGS, SET_USER_HISTORY_LISTINGS, } from '../actions/types/HistoryTypes';
export const defaultState = {
    activeSinglePropertyHistory: {},
    activeSingleUserHistory: {},
    activeSinglePropertyOwnerHistory: {},
};
export default handleActions({
    [SET_PROPERTY_HISTORY_LISTINGS]: (state, action) => ({
        ...state,
        activeSinglePropertyHistory: action.payload,
    }),
    [SET_PROPERTY_OWNER_HISTORY_LISTINGS]: (state, action) => ({
        ...state,
        activeSinglePropertyOwnerHistory: action.payload,
    }),
    [SET_USER_HISTORY_LISTINGS]: (state, action) => ({
        ...state,
        activeSingleUserHistory: action.payload,
    }),
}, defaultState);
