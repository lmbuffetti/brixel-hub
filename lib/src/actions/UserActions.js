import { createActions } from 'redux-actions';
import { ADD_NOT_INTERESTED, CHECK_TOKEN, CREATE_USER, DO_LOGIN, GET_USER_PROPERTIES, GET_USER_RATE, SET_USER_RATE, RECOVER_PASSWORD, REMOVE_NOT_INTERESTED, SAVE_ACTIVE_SINGLE_USER, SEND_USER_SCAN_TRIAL, SET_LOGGED_IN_USER, SET_USER_PAGES_DEALS, SET_USER_PROPERTIES, SET_USER_TYPES, UPDATE_FAVORITE, VALIDATE_USER, } from './types/UserTypes';
export const { checkToken, createUser, doLogin, getUserProperties, recoverPassword, saveActiveSingleUser, setLoggedInUser, setUserPagesDeals, setUserProperties, setUserTypes, updateFavorite, validateUser, addNotInterested, removeNotInterested, sendUserScanTrial, setUserRate, getUserRate, } = createActions({
    [CHECK_TOKEN]: (payload) => payload,
    [CREATE_USER]: (payload) => payload,
    [DO_LOGIN]: (payload) => payload,
    [GET_USER_PROPERTIES]: (payload) => payload,
    [RECOVER_PASSWORD]: (payload) => payload,
    [SAVE_ACTIVE_SINGLE_USER]: (payload) => payload,
    [SET_LOGGED_IN_USER]: (payload) => payload,
    [SET_USER_PAGES_DEALS]: (payload) => payload,
    [SET_USER_PROPERTIES]: (payload) => payload,
    [SET_USER_TYPES]: (payload) => payload,
    [UPDATE_FAVORITE]: (payload) => payload,
    [VALIDATE_USER]: (payload) => payload,
    [ADD_NOT_INTERESTED]: (payload) => payload,
    [REMOVE_NOT_INTERESTED]: (payload) => payload,
    [SEND_USER_SCAN_TRIAL]: (payload) => payload,
    [SET_USER_RATE]: (payload) => payload,
    [GET_USER_RATE]: (payload) => payload,
});
