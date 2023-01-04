import {handleActions,} from 'redux-actions';

import {SET_PROPERTY_NOTE_LISTINGS, SET_USER_NOTE_LISTINGS,} from '../actions/types/NoteTypes';
import {NoteReducerType} from '../@types/reducer/NoteReducer';

export const defaultState: NoteReducerType = {
  activeSinglePropertyNotes: [],
  activeSingleUserNotes: [],
};

export default handleActions<any>(
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
