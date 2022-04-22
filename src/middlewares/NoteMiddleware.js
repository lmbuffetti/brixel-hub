import cloneDeep from 'lodash/cloneDeep';

import {
  CREATE_NOTE,
  GET_NOTE_LISTINGS,
  SET_USER_NOTE_LISTINGS,
  SET_PROPERTY_NOTE_LISTINGS,
  SET_DEAL_NOTE_LISTINGS,
  SAVE_ACTIVE_SINGLE_NOTE,
} from '../actions/types/NoteTypes';

import {
  SPINNER_ON,
  SPINNER_OFF,
  SET_SCREEN_NOTIFICATION, SPINNER_SMALL,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkNote = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_NOTE_LISTINGS: {
      next(action);
      const {
        company,
        direction,
        object,
        offset,
        order,
        resultsPerPage,
        smallLoader,
        text,
        type,
      } = action.payload;
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL,
          payload: {
            [smallLoader]: true,
          },
        });
      } else {
        store.dispatch({
          type: SPINNER_ON,
        });
      }
      // eslint-disable-next-line no-case-declarations
      // const privacy = type === 'deal' ? 'onlyLoggedUser=true' : 'private=true';
      const privacy = 'private=false';
      const queryParams = `?search=${text}&order=${order}&direction=${direction}&company=${company}&${privacy}`;
      api.note.getNotesList(type, object, resultsPerPage, offset, queryParams)
        .then((response) => {
          if (response.data.length >= 0) {
            if (action.payload.type === 'page') {
              store.dispatch({
                type: SET_PROPERTY_NOTE_LISTINGS,
                payload: response.data,
              });
            }
            if (action.payload.type === 'user') {
              store.dispatch({
                type: SET_USER_NOTE_LISTINGS,
                payload: response.data,
              });
            }
            if (action.payload.type === 'deal') {
              store.dispatch({
                type: SET_DEAL_NOTE_LISTINGS,
                payload: response.data,
              });
            }
          } else {
            // Should dispatch error state
            // eslint-disable-next-line no-console
            console.warn('Could not get any notes for this object');
          }
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case CREATE_NOTE: {
      next(action);
      const {
        content,
        smallLoader,
        type,
      } = action.payload;
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL,
          payload: {
            [smallLoader]: true,
          },
        });
      } else {
        store.dispatch({
          type: SPINNER_ON,
        });
      }
      api.note.createSingleNote(content, type)
        .then((response) => {
          if (response.meta.normalizedStatus === 200) {
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                state: true,
                label: 'Note created',
                type: 'done',
              },
            });
            store.dispatch({
              type: GET_NOTE_LISTINGS,
              payload: {
                type: action.payload.type,
                object: action.payload.content.parent,
                text: '',
                order: 'updatedAt',
                direction: 'DESC',
                resultsPerPage: 50,
                offset: 0,
                smallLoader,
              },
            });
          } else {
            // TODO: Should dispatch error state
          }
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case SAVE_ACTIVE_SINGLE_NOTE: {
      next(action);
      const {
        data,
        id,
        isActivity,
        smallLoader,
      } = action.payload;
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL,
          payload: {
            [smallLoader]: true,
          },
        });
      } else {
        store.dispatch({
          type: SPINNER_ON,
        });
      }
      const obj = cloneDeep(data);
      api.note.updateSingleNote(id, obj)
        .then((res) => {
          if (res.meta.status === 200) {
            if (!isActivity) {
              store.dispatch({
                type: GET_NOTE_LISTINGS,
                payload: {
                  type: action.payload.type,
                  object: action.payload.object,
                  text: '',
                  order: 'updatedAt',
                  direction: 'DESC',
                  resultsPerPage: 50,
                  offset: 0,
                  smallLoader,
                },
              });
            }
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                state: true,
                label: 'Your changes were saved',
                type: 'done',
              },
            });
          }
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkNote;
