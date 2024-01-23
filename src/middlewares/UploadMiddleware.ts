import {change, reset} from '@brixel-io/brixel-components/dist/utils/ReduxForm.Functions';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  DELETE_DOCUMENT,
  DELETE_IMG,
  ROTATE_IMG,
  SET_COVER_PHOTO,
  UPDATE_DOCUMENT,
  REORDER_IMAGES,
  UPDATE_DESCRIPTION_IMAGE,
} from '../actions/types/UploadTypes';

import {GET_ACTIVE_SINGLE_PROPERTY, SAVE_ACTIVE_SINGLE_PROPERTY} from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';
import {REQUEST_DONE, SPINNER_OFF, SPINNER_ON, SPINNER_SMALL} from '../actions/types/CommonTypes';
import {SAVE_CLOSING_IDENTIFICATION} from '../actions/types/DealTypes';

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
      const calls: Promise<{ data: any; meta: any; }>[] = [];
      allImgs.forEach((img) => {
        calls.push(api.image.addImage(img, ''));
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
        const data: PropertyType | object = {};
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
        if (!get(coverImg, 'id', null)) {
          set(data, 'coverPhoto', filesArray[0]);
        }
        set(data, actions, filesArray);
        set(data, 'id', pageID);
        set(data, 'smallLoader', smallLoader);
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
      api.image.addImage(action.payload, '')
        .then(async (res) => {
          if (uploadAction === 'photos' ||
            uploadAction === 'floorPlans' ||
            uploadAction === 'contactAvatar') {
            let coverPhoto;

            const img = store.getState().brixelForm.Property.values.photos || [];
            const plan = store.getState().brixelForm.Property.values.floorPlans || [];

            if (uploadAction === 'photos') {
              if (has(store.getState(), 'brixelForm.Property.values.coverPhoto.url')) {
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
      const {
        photoID,
        pageID,
        type,
        smallLoader,
      } = action.payload;
      const arrayImg = store.getState().brixelForm.Property.values[action.payload.type];
      const idImg = arrayImg.findIndex((val) => val.id === action.payload.id);
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL,
          payload: {
            [smallLoader]: true,
          },
        });
      }
      switch (type) {
        case 'image':
        case 'floorPlan':{
          api.image.deletePageImages(pageID, type, photoID)
            .then(() => {
              const data = {
                id: pageID,
                smallLoader: smallLoader,
              }
              store.dispatch({type: GET_ACTIVE_SINGLE_PROPERTY, payload: data});
              if (smallLoader) {
                store.dispatch({
                  type: SPINNER_SMALL,
                  payload: {
                    [smallLoader]: false,
                  },
                });
              }
            })
          break;
        }
        default: {
          return false;
        }
      }
      break;
    }
    // REORDER IAMGES
    case REORDER_IMAGES: {
      const {
        data,
        pageID,
        type,
        smallLoader,
      } : {
        data: object,
        pageID: string,
        type: 'image' | 'floorPlan',
        smallLoader: string,
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
      api.image.orderPageImages(pageID, type, data)
        .then(() => {
          const dataPage = {
            id: pageID,
            smallLoader: smallLoader,
          }
          store.dispatch({type: GET_ACTIVE_SINGLE_PROPERTY, payload: dataPage});
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_ON,
            });
          }
        })
      break;
    }
    // DISPATCH TO SINGLE IMAGES - DOCUMENT OBJECT
    case DELETE_DOCUMENT: {
      next(action);
      const {
        dealID,
        docID,
        id,
        indexPerson,
        saveAction,
        smallLoader,
        type,
      } = action.payload;
      delete action.payload.dealID;
      delete action.payload.type;
      delete action.payload.docID;
      delete action.payload.saveAction;
      delete action.payload.smallLaoder;
      delete action.payload.indexPerson;
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL,
          payload: {
            [smallLoader]: true,
          },
        });
      }
      switch (type) {
        case 'pageDocument': {
          api.image.deletePageDocument(id, docID)
            .then(() => {
              const data = {
                id,
                smallLoader: smallLoader,
              }
              store.dispatch({type: GET_ACTIVE_SINGLE_PROPERTY, payload: data});
              if (smallLoader) {
                store.dispatch({
                  type: SPINNER_SMALL,
                  payload: {
                    [smallLoader]: false,
                  },
                });
              }
            })
          break;
        }
        default: {
          api.image.deleteDocument(id)
            .then(() => {
              if (saveAction === 'closingIdentification') {
                const data = {
                  ...action.payload,
                  id: dealID,
                };
                const idDocToDelete = get(action.payload, `persons[${indexPerson}].document`, []).findIndex((doc) => doc.id === action.payload.id);
                if (idDocToDelete > -1) {
                  data.persons[indexPerson].document.splice(idDocToDelete, 1);
                }
                store.dispatch({ type: SAVE_CLOSING_IDENTIFICATION, payload: data });
              } else {
                const arrayImg = store.getState().property.activeSingleProperty.documents;
                const idImg = arrayImg.findIndex((val) => val.id === action.payload.id);
                arrayImg.splice(idImg, 1);
                store.dispatch(change('Property', 'documents', arrayImg));
                const data = {
                  id: action.payload.pageID,
                  data: {
                    documents: arrayImg,
                  },
                  smallLoader: true,
                };
                store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data });
              }
              if (smallLoader) {
                store.dispatch({
                  type: SPINNER_SMALL,
                  payload: {
                    [smallLoader]: false,
                  },
                });
              }
            })
            .catch(() => {
              // eslint-disable-next-line no-console
              if (smallLoader) {
                store.dispatch({
                  type: SPINNER_SMALL,
                  payload: {
                    [smallLoader]: false,
                  },
                });
              }
            });
          break;
        }
      }
      break;
    }
    // DISPATCH TO UPDATE IMAGES - DOCUMENT ID
    case UPDATE_DOCUMENT: {
      next(action);
      const {
        dealID,
        docs,
        formValue,
        indexDoc,
        indexPerson,
        pageID,
        saveAction,
        smallLoader,
      } = action.payload;
      delete action.payload.dealID;
      delete action.payload.formValue;
      delete action.payload.indexDoc;
      delete action.payload.indexPerson;
      delete action.payload.pageID;
      delete action.payload.saveAction;
      delete action.payload.smallLoader;
      delete action.payload.body.mimeType;
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
      api.image.updateDocument(action.payload.id, action.payload.body, '')
        .then((res) => {
          if (saveAction === 'closingIdentification') {
            const data = cloneDeep(formValue);
            data.persons[indexPerson].document[indexDoc] = res.data;
            data.id = dealID;
            store.dispatch({ type: SAVE_CLOSING_IDENTIFICATION, payload: data });
          } else {
            const docList = docs || store.getState().brixelForm.Property.values.documents;
            const docIndex = docList.findIndex((el) => el.id === res.data.id);
            if (docIndex > -1) docList[docIndex] = res.data;
            else docList.push(res.data);
            const data = {
              id: pageID,
              documents: docList,
              setSuccessNotification: true,
            };
            store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data });
          }
          store.dispatch({
            type: REQUEST_DONE,
            payload: true,
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
    // DISPATCH TO SET COVER IMG - IMG OBJECT
    case SET_COVER_PHOTO: {
      next(action);
      store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: action.payload });
      break;
    }
    // UDAPTE IMAGES DESCRIPTION
    case UPDATE_DESCRIPTION_IMAGE: {
      const {
        imageID,
        body,
        pageID,
        type,
        smallLoader,
      }: {
        imageID: string;
        body: {
          description: string;
        };
        pageID: string;
        type: 'image' | 'floorPlan';
        smallLoader: string;
      } = action.payload;
      api.image.updateImageDescription(pageID, imageID, type, body)
        .then(() => {
          store.dispatch({
            type: GET_ACTIVE_SINGLE_PROPERTY,
            payload: {
              id: action.payload.pageID,
              smallLoader: smallLoader,
            },
          })
        })
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
