import {handleActions,} from 'redux-actions';

import {SET_PROPERTY_NOTE_LISTINGS, SET_USER_NOTE_LISTINGS,} from '../actions/types/NoteTypes';

export const defaultState = {
  activeSinglePropertyNotes: [],
  activeSingleUserNotes: [],
};

export default handleActions(
  {
    [SET_PROPERTY_NOTE_LISTINGS]: (state, action) => ({
      ...state,
      activeSinglePropertyNotes: action.payload,
    }),
    [SET_USER_NOTE_LISTINGS]: (state, action) => ({
      ...state,
      activeSingleUserNotes: action.payload,
    }),
  },
  defaultState,
);
