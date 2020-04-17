/* eslint-disable no-case-declarations */
import { change } from 'redux-form';
import get from 'lodash/get';
import {
  ROTATE_IMG,
  GET_IMAGE_TYPE,
  SET_IMAGE_TYPE,
  UPLOAD_IMG,
  DELETE_IMG,
  SET_COVER_PHOTO,
  UPLOAD_DOCUMENT,
  DELETE_DOCUMENT,
  UPDATE_DOCUMENT,
} from '../actions/types/UploadTypes';

import {
  SAVE_ACTIVE_SINGLE_PROPERTY,
} from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';
import { SAVE_ACTIVE_SINGLE_USER } from '../actions/types/UserTypes';
import {
  SPINNER_ON,
  SPINNER_OFF,
  SPINNER_SMALL_ON,
  SPINNER_SMALL_OFF,
  SET_PSEUDO_SAVED_SCREEN,
} from '../actions/types/CommonTypes';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case ROTATE_IMG: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON });
      api.image.rotateImg(action.payload.id, action.payload.rotate)
        .then((res) => {
          const arrayImg = store.getState().form.Property.values[action.payload.type];
          // eslint-disable-next-line array-callback-return
          const idImg = arrayImg.findIndex((val) => val.id === action.payload.id);
          if (idImg > -1) {
            arrayImg[idImg] = res.data;
            store.dispatch(change('Property', 'photos', arrayImg));
          }
          store.dispatch({ type: SPINNER_SMALL_OFF });
        });
      break;
    }
    case GET_IMAGE_TYPE: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON });
      api.image.getImageType()
        .then((res) => {
          store.dispatch({ type: SET_IMAGE_TYPE, payload: res.data });
          store.dispatch({ type: SPINNER_SMALL_OFF });
        });
      break;
    }
    case UPLOAD_IMG: {
      next(action);
      const { imageType } = store.getState().image;
      const imgType = imageType.find((val) => val.name === 'Gallery');
      // action.payload.user = store.getState().user.loggedInUser.user.id;
      action.payload.imageType = imgType.id;
      const {
        pageID, userID, uploadAction, smallLoader,
      } = action.payload;
      delete action.payload.pageID;
      delete action.payload.uploadAction;
      delete action.payload.smallLoader;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON });
      else store.dispatch({ type: SPINNER_ON });
      api.image.addImage(action.payload, {uploading: store})
        .then((res) => {
          if (uploadAction === 'photos' ||
            uploadAction === 'floorPlans' ||
            uploadAction === 'contactAvatar') {
            let coverPhoto;

            const img = store.getState().form.Property.values.photos || [];
            const plan = store.getState().form.Property.values.floorPlans || [];

            if (uploadAction === 'photos') {
              coverPhoto = get(store.getState(), 'form.Property.values.coverPhoto', null) || res.data;
              // coverPhoto = Object.keys(store.getState().form.Property.values.coverPhoto).length > 0 ? store.getState().form.Property.values.coverPhoto : res.data;
              img.push(res.data);
            }
            if (uploadAction === 'floorPlans') {
              plan.push(res.data);
            }
            const data = {
              id: pageID,
              coverPhoto,
              photos: img,
              floorPlans: plan,
              smallLoader: smallLoader,
            };
            store.dispatch({ type: SET_PSEUDO_SAVED_SCREEN });
            store.dispatch({
              type: SAVE_ACTIVE_SINGLE_PROPERTY,
              payload: data,
              setSuccessNotification: true,
            });
          } else if (uploadAction === 'singleUserAvatar') {
            let userAvatar = store.getState().form.User.values.avatar[0];

            userAvatar = res.data;

            const userData = {
              userID,
              data: {
                avatar: userAvatar.id,
                type: 'singleUserAvatar',
                fullAvatar: userAvatar,
              },
            };
            store.dispatch({ type: SAVE_ACTIVE_SINGLE_USER, payload: userData });
          }
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
        })
        .catch((res) => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
        });

      break;
    }
    case DELETE_IMG: {
      next(action);
      const arrayImg = store.getState().form.Property.values[action.payload.type];
      const idImg = arrayImg.findIndex((val) => val.id === action.payload.id);
      store.dispatch({ type: SPINNER_SMALL_ON });
      api.image.deleteImg(action.payload.id)
        .then(() => {
          arrayImg.splice(idImg, 1);
          store.dispatch(change('Property', action.payload.type, arrayImg));
          const data = {
            id: action.payload.pageID,
            [action.payload.type]: arrayImg,
            smallLoader: true
          };
          if (action.payload.type === 'photos') {
            data.coverPhoto = arrayImg[0] || {};
          }
          if (action.payload.type === 'photos' && arrayImg.length === 0) data.coverPhoto = null;
          store.dispatch({ type: SET_PSEUDO_SAVED_SCREEN });
          store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data });
          store.dispatch({ type: SPINNER_SMALL_OFF });
        });
      break;
    }
    case UPLOAD_DOCUMENT: {
      next(action);
      const { pageID, smallLoader } = action.payload;
      delete action.payload.pageID;
      delete action.payload.smallLaoder;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON });
      else store.dispatch({ type: SPINNER_ON });
      api.image.uploadDocument(action.payload)
        .then((res) => {
          const docList = store.getState().form.Property.values.documents || [];
          docList.push(res.data);
          const data = {
            id: pageID,
            documents: docList,
            smallLoader: true,
          };
          store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data, setSuccessNotification: true });
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case DELETE_DOCUMENT: {
      next(action);
      const { smallLoader } = action.payload;
      delete action.payload.smallLaoder;
      const arrayImg = store.getState().form.Property.values.documents;
      const idImg = arrayImg.findIndex((val) => val.id === action.payload.id);
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON });
      else store.dispatch({ type: SPINNER_ON });
      api.image.deleteDocument(action.payload.id)
        .then(() => {
          arrayImg.splice(idImg, 1);
          store.dispatch(change('Property', 'documents', arrayImg));
          const data = {
            id: action.payload.pageID,
            documents: arrayImg,
            smallLoader: true
          };
          store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data });
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case UPDATE_DOCUMENT: {
      next(action);
      const { pageID, smallLoader } = action.payload;
      delete action.payload.pageID;
      delete action.payload.smallLaoder;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON });
      else store.dispatch({ type: SPINNER_ON });
      api.image.updateDocument(action.payload.id, action.payload.body)
        .then((res) => {
          const docList = store.getState().form.Property.values.documents;
          docList.forEach((el, index) => {
            if (el.id === res.data.id) {
              docList[index] = res.data;
            }
          });
          const data = {
            id: pageID,
            documents: docList,
            smallLoader: true
          };
          store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data });
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case SET_COVER_PHOTO: {
      next(action);
      store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: action.payload });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
