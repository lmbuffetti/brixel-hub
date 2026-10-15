import { change, reset } from '@brixel-io/brixel-components/dist/utils/ReduxForm.Functions';
import get from 'lodash/get';
import { DELETE_DOCUMENT, DELETE_IMG, ROTATE_IMG, SET_COVER_PHOTO, UPDATE_DOCUMENT, REORDER_IMAGES, UPDATE_DESCRIPTION_IMAGE, UPDATE_PAGE_DOCUMENT, REORDER_PAGE_DOCUMENTS, } from '../actions/types/UploadTypes';
import { GET_ACTIVE_SINGLE_PROPERTY, SAVE_ACTIVE_SINGLE_PROPERTY } from '../actions/types/PropertyTypes';
import api from '../controllers/api/config';
import { REQUEST_DONE, SPINNER_OFF, SPINNER_ON, SPINNER_SMALL, SET_SCREEN_NOTIFICATION } from '../actions/types/CommonTypes';
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
            }
            else {
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
                }
                else {
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
            const { photoID, pageID, type, smallLoader, } = action.payload;
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
                case 'floorPlan': {
                    api.image.deletePageImages(pageID, type, photoID)
                        .then(() => {
                        const data = {
                            id: pageID,
                            smallLoader: smallLoader,
                        };
                        store.dispatch({ type: GET_ACTIVE_SINGLE_PROPERTY, payload: data });
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
                default: {
                    return false;
                }
            }
            break;
        }
        // REORDER IAMGES
        case REORDER_IMAGES: {
            const { data, pageID, type, smallLoader, } = action.payload;
            if (smallLoader) {
                store.dispatch({
                    type: SPINNER_SMALL,
                    payload: {
                        [smallLoader]: true,
                    },
                });
            }
            else {
                store.dispatch({
                    type: SPINNER_ON,
                });
            }
            api.image.orderPageImages(pageID, type, data)
                .then(() => {
                const dataPage = {
                    id: pageID,
                    smallLoader: smallLoader,
                };
                store.dispatch({ type: GET_ACTIVE_SINGLE_PROPERTY, payload: dataPage });
                if (smallLoader) {
                    store.dispatch({
                        type: SPINNER_SMALL,
                        payload: {
                            [smallLoader]: false,
                        },
                    });
                }
                else {
                    store.dispatch({
                        type: SPINNER_ON,
                    });
                }
            });
            break;
        }
        case REORDER_PAGE_DOCUMENTS: {
            const { data, pageID, smallLoader, } = action.payload;
            if (smallLoader) {
                store.dispatch({
                    type: SPINNER_SMALL,
                    payload: {
                        [smallLoader]: true,
                    },
                });
            }
            else {
                store.dispatch({
                    type: SPINNER_ON,
                });
            }
            const dataPage = {
                id: pageID,
                smallLoader: smallLoader,
            };
            api.image.orderPageDocuments(pageID, data)
                .then(() => {
                store.dispatch({ type: GET_ACTIVE_SINGLE_PROPERTY, payload: dataPage });
                if (smallLoader) {
                    store.dispatch({
                        type: SPINNER_SMALL,
                        payload: {
                            [smallLoader]: false,
                        },
                    });
                }
                else {
                    store.dispatch({
                        type: SPINNER_ON,
                    });
                }
            })
                .catch(() => {
                store.dispatch({
                    type: SET_SCREEN_NOTIFICATION,
                    payload: {
                        state: true,
                        label: 'An error ocurred while saving the new documents order',
                        type: 'alert',
                    },
                });
                store.dispatch({ type: GET_ACTIVE_SINGLE_PROPERTY, payload: dataPage });
                if (smallLoader) {
                    store.dispatch({
                        type: SPINNER_SMALL,
                        payload: {
                            [smallLoader]: false,
                        },
                    });
                }
                else {
                    store.dispatch({
                        type: SPINNER_OFF,
                    });
                }
            });
            break;
        }
        case UPDATE_PAGE_DOCUMENT: {
            next(action);
            const { documentIds, pageID, smallLoader, } = action.payload;
            delete action.payload.pageID;
            delete action.payload.user;
            delete action.payload.body.mimeType;
            if (smallLoader) {
                store.dispatch({
                    type: SPINNER_SMALL,
                    payload: {
                        [smallLoader]: true,
                    },
                });
            }
            else {
                store.dispatch({
                    type: SPINNER_ON,
                });
            }
            delete action.payload.body.url;
            delete action.payload.documentIds;
            const dataPage = {
                id: pageID,
                smallLoader: smallLoader,
            };
            const { body } = action.payload;
            // Remove data that is not needed and could create issues
            delete body.user;
            delete body.loadUrl;
            delete body.url;
            api.image.updatePageDocument(pageID, body)
                .then(() => {
                if (documentIds) {
                    const pageDocsReorder = {
                        pageID: pageID,
                        smallLoader: smallLoader,
                        data: {
                            documentIds: [...new Set(documentIds)],
                        },
                    };
                    store.dispatch({ type: REORDER_PAGE_DOCUMENTS, payload: pageDocsReorder });
                }
                else {
                    store.dispatch({ type: GET_ACTIVE_SINGLE_PROPERTY, payload: dataPage });
                    if (smallLoader) {
                        store.dispatch({
                            type: SPINNER_SMALL,
                            payload: {
                                [smallLoader]: false,
                            },
                        });
                        store.dispatch({
                            type: SPINNER_SMALL,
                            payload: {
                                saveData: true,
                            },
                        });
                    }
                    else {
                        store.dispatch({
                            type: SPINNER_OFF,
                        });
                    }
                }
            })
                .catch(() => {
                store.dispatch({
                    type: SET_SCREEN_NOTIFICATION,
                    payload: {
                        state: true,
                        label: 'An error ocurred while saving the document',
                        type: 'alert',
                    },
                });
                store.dispatch({ type: GET_ACTIVE_SINGLE_PROPERTY, payload: dataPage });
                if (smallLoader) {
                    store.dispatch({
                        type: SPINNER_SMALL,
                        payload: {
                            [smallLoader]: false,
                        },
                    });
                }
                else {
                    store.dispatch({
                        type: SPINNER_OFF,
                    });
                }
            });
            break;
        }
        // DISPATCH TO SINGLE IMAGES - DOCUMENT OBJECT
        case DELETE_DOCUMENT: {
            next(action);
            const { dealID, docID, id, indexPerson, saveAction, smallLoader, type, } = action.payload;
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
                        };
                        store.dispatch({ type: GET_ACTIVE_SINGLE_PROPERTY, payload: data });
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
                        }
                        else {
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
            const { docs, pageID, smallLoader, } = action.payload;
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
            }
            else {
                store.dispatch({
                    type: SPINNER_ON,
                });
            }
            api.image.updateDocument(action.payload.id, action.payload.body, '')
                .then((res) => {
                const docList = docs || store.getState().brixelForm.Property.values.documents;
                const docIndex = docList.findIndex((el) => el.id === res.data.id);
                if (docIndex > -1)
                    docList[docIndex] = res.data;
                else
                    docList.push(res.data);
                const data = {
                    id: pageID,
                    documents: docList,
                    setSuccessNotification: true,
                };
                store.dispatch({ type: SAVE_ACTIVE_SINGLE_PROPERTY, payload: data });
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
                }
                else {
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
            const { imageID, body, pageID, type, smallLoader, } = action.payload;
            api.image.updateImageDescription(pageID, imageID, type, body)
                .then(() => {
                store.dispatch({
                    type: GET_ACTIVE_SINGLE_PROPERTY,
                    payload: {
                        id: action.payload.pageID,
                        smallLoader: smallLoader,
                    },
                });
            });
            break;
        }
        default:
            next(action);
    }
};
export default checkCommon;
