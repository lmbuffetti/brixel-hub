import {createActions} from 'redux-actions';
import {
  CREATE_NOTE,
  GET_NOTE_LISTINGS,
  SAVE_ACTIVE_SINGLE_NOTE,
  SET_DEAL_NOTE_LISTINGS,
  SET_PROPERTY_NOTE_LISTINGS,
  SET_USER_NOTE_LISTINGS,
} from './types/NoteTypes';

export const {
  createNote,
  getNoteListings,
  setUserNoteListings,
  setPropertyNoteListings,
  setDealNoteListings,
  saveActiveSingleNote,
} = createActions({
  [CREATE_NOTE]: (payload) => payload,
  [GET_NOTE_LISTINGS]: (payload) => payload,
  [SET_USER_NOTE_LISTINGS]: (payload) => payload,
  [SET_PROPERTY_NOTE_LISTINGS]: (payload) => payload,
  [SET_DEAL_NOTE_LISTINGS]: (payload) => payload,
  [SAVE_ACTIVE_SINGLE_NOTE]: (payload) => payload,
});
