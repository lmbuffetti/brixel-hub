/* eslint-disable no-case-declarations */
import { change, reset } from '@brixel/brixel-components';
import set from 'lodash/set';
import get from 'lodash/get';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import {
  ROTATE_IMG,
  GET_IMAGE_TYPE,
  SET_IMAGE_TYPE,
  UPLOAD_IMG,
  DELETE_IMG,
  SET_COVER_PHOTO,
  MULTI_UPLOAD_DOCUMENT,
  UPLOAD_DOCUMENT,
  DELETE_DOCUMENT,
  UPDATE_DOCUMENT,
  MULTI_UPLOAD_IMG,
} from '../actions/types/UploadTypes';

import {
  SAVE_ACTIVE_SINGLE_PROPERTY,
} from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';
import { SAVE_ACTIVE_SINGLE_USER } from '../actions/types/UserTypes';
import {
  SPINNER_ON,
  SPINNER_OFF,
  SPINNER_SMALL,
} from '../actions/types/CommonTypes';
import { SAVE_CLOSING_IDENTIFICATION, SAVE_MAKE_OFFER } from '../actions/types/DealTypes';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    // DISPATCH TO ROTATE IMG - by IMAGE ID
    case ROTATE_IMG: {
      next(action);
      const { smallLoader } = action.payload;
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
      api.image.rotateImg(action.payload.id, action.payload.rotate)
        .then((res) => {
          const arrayImg = store.getState().brixelForm.Property.values[action.payload.type];
          // eslint-disable-next-line array-callback-return
          const idImg = arrayImg.findIndex((val) => val.id === action.payload.id);
          if (idImg > -1) {
            arrayImg[idImg] = res.data;
            store.dispatch(change('Property', action.payload.type, arrayImg));
            store.dispatch(reset('Property', store.getState().brixelForm.Property.initialValues));
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
    // DISPATCH TO IMG TYPE
    case GET_IMAGE_TYPE: {
      next(action);
      api.image.getImageType()
        .then((res) => {
          store.dispatch({ type: SET_IMAGE_TYPE, payload: res.data });
        });
      break;
    }
    // DISPATCH TO MULTI-UPLOAD IMAGES - ARRAY OF IMAGES
    case MULTI_UPLOAD_IMG: {
      next(action);
      const {
        allImgs, actions, pageID, smallLoader,
      } = action.payload;
      delete action.payload.allImgs;
      delete action.payload.actions;
      delete action.payload.pageID;
      delete action.payload.smallLoader;
      const calls = [];
      allImgs.forEach((img) => {
        calls.push(api.image.addImage(img));
      });
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
      Promise.all(calls).then((res) => {
        const coverImg = get(store.getState(), 'brixelForm.Property.values.coverPhoto', {});
        const data = {};
        const filesArray = get(store.getState(), `brixelForm.Property.values[${actions}]`, []);
        res.forEach((resImg) => {
          if (resImg.meta.normalizedStatus === 200) {
            if (isArray(resImg.data)) {
              resImg.data.forEach((imgPdf) => {
                filesArray.push({
                  width: 0,
                  height: 0,
                  ...imgPdf,
                });
              });
            } else {
              let width = 0;
              let height = 0;
              if (get(resImg, 'data.name', null)) {
                const selOriginalImg = allImgs.find((img) => img.name.toString() === resImg.data.name.toString());
                if (selOriginalImg) {
                  width = get(selOriginalImg, 'width', null);
                  height = get(selOriginalImg, 'height', null);
                }
              }
              filesArray.push({
                width,
                height,
                ...resImg.data,
              });
            }
          }
        });
        if (!coverImg.id) {
          data.coverPhoto = filesArray[0];
        }
        set(data, actions, filesArray);
        data.id = pageID;
        data.smallLoader = smallLoader;
        store.dispatch({
          type: SAVE_ACTIVE_SINGLE_PROPERTY,
          payload: data,
          setSuccessNotification: true,
        });
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
    // DISPATCH TO SINGLE UPLOAD IMG - IMG OBJECT
    case UPLOAD_IMG: {
      next(action);
      const { imageType } = store.getState().image;
      const imgType = imageType.find((val) => val.name === 'Gallery');
      // action.payload.user = store.getState().user.loggedInUser.user.id;
      action.payload.imageType = imgType.id;
      const {
        pageID, userID, uploadAction, smallLoader, lastImage,
      } = action.payload;
      delete action.payload.pageID;
      delete action.payload.uploadAction;
      delete action.payload.smallLoader;
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
      api.image.addImage(action.payload)
        .then(async (res) => {
          if (uploadAction === 'photos' ||
            uploadAction === 'floorPlans' ||
            uploadAction === 'contactAvatar') {
            let coverPhoto;

            const img = store.getState().brixelForm.Property.values.photos || [];
            const plan = store.getState().brixelForm.Property.values.floorPlans || [];

            if (uploadAction === 'photos') {
              if (has(store.getState(), 'brixelForm.Property.values.coverPhoto.path')) {
                coverPhoto = get(store.getState(), 'brixelForm.Property.values.coverPhoto', null);
              } else {
                coverPhoto = res.data;
              }
              // coverPhoto = Object.keys(store.getState().form.Property.values.coverPhoto).length > 0 ? store.getState().form.Property.values.coverPhoto : res.data;
              img.push(res.data);
            }
            if (uploadAction === 'floorPlans') {
              plan.push(res.data);
            }
            if (lastImage) {
              const data = {
                id: pageID,
                coverPhoto,
                photos: img,
                floorPlans: plan,
                smallLoader,
              };
              store.dispatch({
                type: SAVE_ACTIVE_SINGLE_PROPERTY,
                payload: data,
                setSuccessNotification: true,
              });
            }
          } else if (uploadAction === 'singleUserAvatar') {
            let userAvatar = store.getState().brixelForm.User.values.avatar[0];

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
        })
        .catch(() => {
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
    // DISPATCH TO DELETE IMG - IMAGE ID
    case DELETE_IMG: {
      next(action);
      const { smallLoader } = action.payload;
      const arrayImg = store.getState().brixelForm.Property.values[action.payload.type];
      const idImg = arrayImg.findIndex((val) => val.id === action.payload.id);
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
      api.image.deleteImg(action.payload.id)
        .then(() => {
          arrayImg.splice(idImg, 1);
          store.dispatch(change('Property', action.payload.type, arrayImg));
          const data = {
            id: action.payload.pageID,
            [action.payload.type]: arrayImg,
            smallLoader: true,
          };
          if (action.payload.type === 'photos') {
            data.coverPhoto = arrayImg[0] || {};
          }
          if (action.payload.type === 'photos' && arrayImg.length === 0) data.coverPhoto = null;
          store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data });
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
    // DISPATCH TO MULTI-UPLOAD IMAGES - ARRAY OF IMAGES
    case MULTI_UPLOAD_DOCUMENT: {
      next(action);
      const {
        actions,
        allImgs,
        pageID,
        saveAction,
        smallLoader,
      } = action.payload;
      delete action.payload.allImgs;
      delete action.payload.actions;
      delete action.payload.pageID;
      delete action.payload.smallLoader;
      delete action.payload.saveAction;
      const calls = [];
      allImgs.forEach((img) => {
        calls.push(api.image.uploadDocument(img, null, img.idBuyer));
      });
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
      Promise.all(calls).then((res) => {
        if (saveAction === 'makeOffer') {
          const dataOffer = action.payload;
          delete dataOffer.document;
          const document = [];
          res.forEach((doc) => {
            document.push(doc.data);
          });
          const data = {
            ...dataOffer,
            documents: document,
          };
          data.smallLoader = smallLoader;
          store.dispatch({ type: SAVE_MAKE_OFFER, payload: data });
        } else if (saveAction === 'closingIdentification') {
          const dataIdentification = action.payload;
          dataIdentification.persons.forEach((person, id) => {
            dataIdentification.persons[id].document = [];
          });
          res.forEach((doc) => {
            dataIdentification.persons[doc.id].document.push(doc.data);
          });
          const data = {
            ...dataIdentification,
            smallLoader,
          };
          store.dispatch({ type: SAVE_CLOSING_IDENTIFICATION, payload: data });
        } else {
          const data = {};
          const filesArray = get(store.getState(), 'brixelForm.Property.values.documents', []);
          res.forEach((resImg) => {
            filesArray.push(resImg.data);
          });
          set(data, actions, filesArray);
          data.id = pageID;
          data.smallLoader = smallLoader;
          store.dispatch({
            type: SAVE_ACTIVE_SINGLE_PROPERTY,
            payload: data,
            setSuccessNotification: true,
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
    // DISPATCH TO SINGLE UPLOAD DOCUMENTS - DOCUMENTS ARRAY
    case UPLOAD_DOCUMENT: {
      next(action);
      const {
        pageID, index, smallLoader, saveAction,
      } = action.payload;
      delete action.payload.pageID;
      delete action.payload.smallLoader;
      delete action.payload.saveAction;
      delete action.payload.index;
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
      const docData = get(action.payload, 'docs', action.payload);
      api.image.uploadDocument(docData)
        .then((res) => {
          if (saveAction === 'makeOffer') {
            const document = [];
            document.push(res.data);
            const data = {
              ...action.payload,
              documents: document,
            };
            data.smallLoader = smallLoader;
            store.dispatch({ type: SAVE_MAKE_OFFER, payload: data });
          } else if (saveAction === 'closingIdentification') {
            const document = [];
            document.push(res.data);
            const data = {
              ...action.payload,
              index,
              documents: document,
            };
            if (index > -1) data.index = index;
            data.smallLoader = smallLoader;
            // store.dispatch({ type: SAVE_MAKE_OFFER, payload: data });
          } else {
            const docList = store.getState().brixelForm.Property.values.documents || [];
            docList.push(res.data);
            const data = {
              id: pageID,
              documents: docList,
              smallLoader: true,
            };
            if (index > -1) data.index = index;
            store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data, setSuccessNotification: true });
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
          }
        });
      break;
    }
    // DISPATCH TO SINGLE IMAGES - DOCUMENT OBJECT
    case DELETE_DOCUMENT: {
      next(action);
      const { dealID, smallLoader, saveAction } = action.payload;
      delete action.payload.dealID;
      delete action.payload.saveAction;
      delete action.payload.smallLaoder;
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
      api.image.deleteDocument(action.payload.id)
        .then(() => {
          if (saveAction === 'closingIdentification') {
            const data = {
              ...action.payload,
              id: dealID,
            };
            store.dispatch({ type: SAVE_CLOSING_IDENTIFICATION, payload: data });
          } else {
            const arrayImg = store.getState().brixelForm.Property.values.documents;
            const idImg = arrayImg.findIndex((val) => val.id === action.payload.id);
            arrayImg.splice(idImg, 1);
            store.dispatch(change('Property', 'documents', arrayImg));
            const data = {
              id: action.payload.pageID,
              documents: arrayImg,
              smallLoader: true,
            };
            store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data });
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
          }
        });
      break;
    }
    // DISPATCH TO UPDATE IMAGES - DOCUMENT ID
    case UPDATE_DOCUMENT: {
      next(action);
      const { pageID, smallLoader } = action.payload;
      delete action.payload.pageID;
      delete action.payload.smallLaoder;
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
      api.image.updateDocument(action.payload.id, action.payload.body)
        .then((res) => {
          const docList = store.getState().brixelForm.Property.values.documents;
          docList.forEach((el, index) => {
            if (el.id === res.data.id) {
              docList[index] = res.data;
            }
          });
          const data = {
            id: pageID,
            documents: docList,
            setSuccessNotification: true,
          };
          store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data });
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
    // DISPATCH TO SET COVER IMG - IMG OBJECT
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
