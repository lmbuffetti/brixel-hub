import {
  createActions,
} from 'redux-actions';
import {
  CREATE_NOTE,
  DELETE_ACTIVE_SINGLE_NOTE,
  GET_NOTE_LISTINGS,
  SET_USER_NOTE_LISTINGS,
  SET_PROPERTY_NOTE_LISTINGS,
  SET_DEAL_NOTE_LISTINGS,
  GET_ACTIVE_SINGLE_NOTE,
  SET_ACTIVE_SINGLE_NOTE,
  SAVE_ACTIVE_SINGLE_NOTE,
  GET_ACTIVITY_LISTINGS,
  SET_ACTIVITY_LISTINGS,
} from './types/NoteTypes';

export const {
  createNote,
  deleteActiveSingleNote,
  getNoteListings,
  setUserNoteListings,
  setPropertyNoteListings,
  setDealNoteListings,
  getActiveSingleNote,
  setActiveSingleNote,
  saveActiveSingleNote,
  getActivityListings,
  setActivityListings,
} = createActions({
  [CREATE_NOTE]: (payload) => payload,
  [DELETE_ACTIVE_SINGLE_NOTE]: (payload) => payload,
  [GET_NOTE_LISTINGS]: (payload) => payload,
  [SET_USER_NOTE_LISTINGS]: (payload) => payload,
  [SET_PROPERTY_NOTE_LISTINGS]: (payload) => payload,
  [SET_DEAL_NOTE_LISTINGS]: (payload) => payload,
  [GET_ACTIVE_SINGLE_NOTE]: (payload) => payload,
  [SET_ACTIVE_SINGLE_NOTE]: (payload) => payload,
  [SAVE_ACTIVE_SINGLE_NOTE]: (payload) => payload,
  [GET_ACTIVITY_LISTINGS]: (payload) => payload,
  [SET_ACTIVITY_LISTINGS]: (payload) => payload,
});
