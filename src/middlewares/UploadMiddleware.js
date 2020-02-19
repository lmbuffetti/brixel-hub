/* eslint-disable no-case-declarations */
import { change } from 'redux-form';
import {
  ROTATE_IMG,
  GET_IMAGE_TYPE,
  SET_IMAGE_TYPE,
  UPLOAD_IMG,
  DELETE_IMG,
  UPLOAD_DOCUMENT,
  DELETE_DOCUMENT,
  UPDATE_DOCUMENT,
} from '../actions/types/UploadTypes';

import {
  UPDATE_PROPERTY,
} from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';
import { UPDATE_USER } from '../actions/types/UserTypes';
import { SPINNER_ON, SPINNER_OFF } from '../actions/types/CommonTypes';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case ROTATE_IMG: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.image.rotateImg(action.payload.id, action.payload.rotate)
        .then((res) => {
          const arrayImg = store.getState().form.Media.values.photos;
          // eslint-disable-next-line array-callback-return
          const idImg = arrayImg.findIndex((val) => { val.id = action.payload.id; });
          arrayImg[idImg] = res.data;
          store.dispatch(change('Property', 'photos', arrayImg));
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case GET_IMAGE_TYPE: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.image.getImageType()
        .then((res) => {
          store.dispatch({ type: SET_IMAGE_TYPE, payload: res.data });
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case UPLOAD_IMG: {
      next(action);
      const { imageType } = store.getState().image;
      const imgType = imageType.find((val) => val.name === 'Avatar');
      action.payload.user = store.getState().user.loggedUser.user.id;
      action.payload.imageType = imgType.id;
      const formData = store.getState().form.UpdateForm.values;
      store.dispatch({ type: SPINNER_ON });
      api.image.addImage(action.payload)
        .then((res) => {
          if (formData.avatar && formData.avatar.id) {
            api.image.deleteImg(formData.avatar.id);
          }
          store.dispatch({ type: SPINNER_OFF });
          store.dispatch(change('UpdateForm', 'avatar', res.data));
          store.dispatch({ type: UPDATE_USER, payload: {} });
        })
        .catch((res) => {
          store.dispatch({ type: SPINNER_OFF });
        });

      break;
    }
    case DELETE_IMG: {
      next(action);
      api.image.deleteImg(action.payload.id)
        .then(() => {
        });
      break;
    }
    case UPLOAD_DOCUMENT: {
      next(action);
      const { pageID } = action.payload;
      delete action.payload.pageID;
      store.dispatch({ type: SPINNER_ON });
      api.image.uploadDocument(action.payload)
        .then((res) => {
          const docList = store.getState().form.documentsForm.values.documents;
          docList.push(res.data);
          const data = {
            id: pageID,
            data: {
              documents: docList,
            },
          };
          store.dispatch({ type: UPDATE_PROPERTY, payload: data });
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case DELETE_DOCUMENT: {
      next(action);
      const arrayImg = store.getState().form.documentsForm.values.documents;
      const idImg = arrayImg.findIndex((val) => val.id === action.payload.id);
      api.image.deleteDocument(action.payload.id)
        .then(() => {
          arrayImg.splice(idImg, 1);
          store.dispatch(change('documentsForm', 'documents', arrayImg));
          const data = {
            id: action.payload.pageID,
            data: {
              documents: arrayImg,
            },
          };
          store.dispatch({ type: UPDATE_PROPERTY, payload: data });
        });
      break;
    }
    case UPDATE_DOCUMENT: {
      next(action);
      const { pageID } = action.payload;
      delete action.payload.pageID;
      store.dispatch({ type: SPINNER_ON });
      api.image.updateDocument(action.payload.id, action.payload.body)
        .then((res) => {
          const docList = store.getState().form.documentsForm.values.documents;
          docList.forEach((el, index) => {
            if (el.id === res.data.id) {
              docList[index] = res.data;
            }
          });
          const data = {
            id: pageID,
            data: {
              documents: docList,
            },
          };
          store.dispatch({ type: UPDATE_PROPERTY, payload: data });
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
