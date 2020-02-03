import { createActions } from 'redux-actions';
import {
  ROTATE_IMG,
  GET_IMAGE_TYPE,
  SET_IMAGE_TYPE,
  UPLOAD_IMG,
  DELETE_IMG,
  UPLOAD_DOCUMENT,
  DELETE_DOCUMENT,
} from './types/UploadTypes';

export const {
  rotateImg,
  getImageType,
  setImageType,
  uploadImg,
  deleteImg,
  uploadDocument,
  deleteDocument,
} = createActions({
  [ROTATE_IMG]: (payload) => payload,
  [GET_IMAGE_TYPE]: (payload) => payload,
  [SET_IMAGE_TYPE]: (payload) => payload,
  [UPLOAD_IMG]: (payload) => payload,
  [DELETE_IMG]: (payload) => payload,
  [UPLOAD_DOCUMENT]: (payload) => payload,
  [DELETE_DOCUMENT]: (payload) => payload,
});
