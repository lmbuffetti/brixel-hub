import cloneDeep from 'lodash/cloneDeep';

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
} from '../actions/types/NoteTypes';

import {
  SPINNER_ON,
  SPINNER_OFF,
  SET_SCREEN_NOTIFICATION,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkNote = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_NOTE_LISTINGS: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      // eslint-disable-next-line no-case-declarations
      const queryParams = `?search=${action.payload.text}&order=${action.payload.order}&direction=${action.payload.direction}&company=${action.payload.company}`;
      api.note.getNotesList(action.payload.type, action.payload.object, action.payload.resultsPerPage, action.payload.offset, queryParams)
        .then((response) => {
          if (response.data.length > 0) {
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
            store.dispatch({
              type: SPINNER_OFF,
            });
          } else {
            // Should dispatch error state
            // eslint-disable-next-line no-console
            console.warn('Could not get any notes for this object');
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case CREATE_NOTE: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      api.note.createSingleNote(action.payload.content, action.payload.type)
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
              },
            });
            // store.dispatch({
            //   type: REDIRECT_TO,
            //   payload: { url: '/packages' },
            // });
            store.dispatch({
              type: SPINNER_OFF,
            });
          } else {
            // TODO: Should dispatch error state
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case DELETE_ACTIVE_SINGLE_NOTE: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      delete action.payload.data.user;
      api.note.updateSingleNote(action.payload.id)
        .then((response) => {
          if (response.meta.status === 200) {
            store.dispatch({
              type: SET_ACTIVE_SINGLE_NOTE,
              payload: {},
            });
            // store.dispatch({
            //   type: REDIRECT_TO,
            //   payload: { url: '/packages' },
            // });
            // store.dispatch({
            //   type: SET_SCREEN_NOTIFICATION,
            //   payload: { state: true, label: 'Note successfully deleted', type: 'done' },
            // });
            store.dispatch({
              type: SPINNER_OFF,
            });
          } else {
            // TODO: Should dispatch error state
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case GET_ACTIVE_SINGLE_NOTE: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      api.note.getSingleNote(action.payload)
        .then((response) => {
          if (response.meta.status === 200) {
            store.dispatch({
              type: SET_ACTIVE_SINGLE_NOTE,
              payload: response.data,
            });
            store.dispatch({
              type: SPINNER_OFF,
            });
          } else {
            // TODO: Should dispatch error state
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case SAVE_ACTIVE_SINGLE_NOTE: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      const obj = cloneDeep(action.payload.data);
      api.note.updateSingleNote(action.payload.id, obj)
        .then((res) => {
          if (res.meta.status === 200) {
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
              },
            });
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                state: true,
                label: 'Your changes were saved',
                type: 'done',
              },
            });
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
