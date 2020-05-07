import { createActions } from 'redux-actions';
import {
  ROTATE_IMG,
  GET_IMAGE_TYPE,
  SET_IMAGE_TYPE,
  SET_COVER_PHOTO,
  UPLOAD_IMG,
  DELETE_IMG,
  UPLOAD_DOCUMENT,
  MULTI_UPLOAD_IMG,
  DELETE_DOCUMENT,
  UPDATE_DOCUMENT,
} from './types/UploadTypes';

export const {
  rotateImg,
  getImageType,
  setImageType,
  setCoverPhoto,
  uploadImg,
  deleteImg,
  uploadDocument,
  deleteDocument,
  multiUploadImg,
  updateDocument,
} = createActions({
  [ROTATE_IMG]: (payload) => payload,
  [GET_IMAGE_TYPE]: (payload) => payload,
  [SET_IMAGE_TYPE]: (payload) => payload,
  [SET_COVER_PHOTO]: (payload) => payload,
  [UPLOAD_IMG]: (payload) => payload,
  [DELETE_IMG]: (payload) => payload,
  [UPLOAD_DOCUMENT]: (payload) => payload,
  [MULTI_UPLOAD_IMG]: (payload) => payload,
  [DELETE_DOCUMENT]: (payload) => payload,
  [UPDATE_DOCUMENT]: (payload) => payload,
});
