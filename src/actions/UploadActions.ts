import {createActions} from 'redux-actions';
import {
  DELETE_DOCUMENT,
  DELETE_IMG,
  REORDER_IMAGES,
  ROTATE_IMG,
  SET_COVER_PHOTO,
  UPDATE_DESCRIPTION_IMAGE,
  UPDATE_DOCUMENT,
} from './types/UploadTypes';

export const {
  deleteDocument,
  deleteImg,
  reorderImages,
  rotateImg,
  setCoverPhoto,
  updateDescriptionImage,
  updateDocument,
} = createActions({
  [ROTATE_IMG]: (payload) => payload,
  [SET_COVER_PHOTO]: (payload) => payload,
  [DELETE_IMG]: (payload) => payload,
  [DELETE_DOCUMENT]: (payload) => payload,
  [UPDATE_DOCUMENT]: (payload) => payload,
  [REORDER_IMAGES]: (payload) => payload,
  [UPDATE_DESCRIPTION_IMAGE]: (payload) => payload,
});
