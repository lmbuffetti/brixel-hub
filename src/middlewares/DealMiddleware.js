import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import {
  SPINNER_ON,
  SPINNER_OFF,
  REDIRECT_TO,
  SPINNER_SMALL_OFF,
  SET_SCREEN_NOTIFICATION, SPINNER_SMALL_ON,
} from '../actions/types/CommonTypes';

import {
  CREATE_DEAL,
  DELETE_ACTIVE_SINGLE_DEAL,
  GET_ACTIVE_SINGLE_DEAL,
  GET_DEAL_LISTINGS,
  GET_USER_DEALS,
  SAVE_ACTIVE_SINGLE_DEAL, SAVE_MAKE_OFFER,
  SET_ACTIVE_SINGLE_DEAL,
  SET_DEAL_LISTINGS,
  SET_USER_DEALS,
  UPDATE_DEALS_ORDER,
  UPDATE_MULTIPLE_DEALS,
  GET_BUYER_DEAL,
  SAVE_REVIEW_OFFER,
  SET_OFFER_LISTINGS,
  GET_OFFER_LISTINGS,
} from '../actions/types/DealTypes';

import {
  SET_DEAL_OWNER_HISTORY_LISTINGS, GET_HISTORY_LISTINGS,
} from '../actions/types/HistoryTypes';

import {
  GET_PAGE_DEALS,
} from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_USER_DEALS: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.user.getPagesByDealByUser(action.payload)
        .then((res) => {
          store.dispatch({ type: SET_USER_DEALS, payload: res.data });
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case GET_DEAL_LISTINGS: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      // eslint-disable-next-line no-case-declarations
      const queryParams = `?search=${action.payload.text}&order=${action.payload.order}&direction=${action.payload.direction}&company=${action.payload.company}`;
      api.deal.getDealsList(action.payload.resultsPerPage, action.payload.offset, queryParams)
        .then((response) => {
          if (response.data.length > 0) {
            const data = {
              packages: response.data,
              total: response.data.length,
            };
            store.dispatch({
              type: SET_DEAL_LISTINGS,
              payload: data,
            });
            store.dispatch({
              type: SPINNER_OFF,
            });
          } else {
            // Should dispatch error state
            store.dispatch({
              type: REDIRECT_TO,
              payload: {
                url: '/properties',
              },
            });
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case CREATE_DEAL: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      const {
        link,
      } = action.payload;
      delete action.payload.link;

      api.user.getUserByEmail(action.payload.leadEmail)
        .then((response) => {
          // User not found, we need to create a new one
          if (response.meta.normalizedStatus === 400) {
            const registerUser = omit(action.payload, ['page', 'stage', 'actionStub']);
            api.lead.createUserLead(registerUser)
              .then((res) => {
                if (res.meta.normalizedStatus === 200) {
                  const deal = {
                    page: action.payload.page,
                    user: res.data.id,
                    stage: action.payload.stage,
                    actionStub: action.payload.actionStub,
                  };
                  api.deal.createSingleDeal(deal)
                    .then((response1) => {
                      if (response1.meta.normalizedStatus === 200) {
                        store.dispatch({
                          type: SET_SCREEN_NOTIFICATION,
                          payload: {
                            state: true,
                            label: 'Deal created',
                            type: 'success',
                          },
                        });
                        store.dispatch({
                          type: GET_PAGE_DEALS,
                          payload: action.payload.page,
                        });
                        store.dispatch({
                          type: REDIRECT_TO,
                          payload: {
                            history: link,
                          },
                        });
                        store.dispatch({
                          type: SPINNER_OFF,
                        });
                      } else {
                        // TODO: Should dispatch error state
                        store.dispatch({
                          type: SET_SCREEN_NOTIFICATION,
                          payload: {
                            state: true,
                            label: response.data.errorMessage,
                            type: 'alert',
                          },
                        });
                        store.dispatch({
                          type: SPINNER_OFF,
                        });
                      }
                    });
                }
              });
          } else if (response.meta.normalizedStatus === 200) {
            // User already exists, we just need to create the deal
            const deal = {
              page: action.payload.page,
              user: response.data.id,
              stage: action.payload.stage,
              actionStub: action.payload.actionStub,
            };
            api.deal.createSingleDeal(deal)
              .then((response1) => {
                if (response1.meta.normalizedStatus === 200) {
                  store.dispatch({
                    type: SET_SCREEN_NOTIFICATION,
                    payload: {
                      state: true,
                      label: 'Deal created',
                      type: 'success',
                    },
                  });
                  store.dispatch({
                    type: GET_PAGE_DEALS,
                    payload: action.payload.page,
                  });
                  store.dispatch({
                    type: REDIRECT_TO,
                    payload: {
                      history: link,
                    },
                  });
                  store.dispatch({
                    type: SPINNER_OFF,
                  });
                } else {
                  // TODO: Should dispatch error state
                  store.dispatch({
                    type: SET_SCREEN_NOTIFICATION,
                    payload: {
                      state: true,
                      label: response1.data.errorMessage,
                      type: 'alert',
                    },
                  });
                  store.dispatch({
                    type: SPINNER_OFF,
                  });
                }
              });
          }
        });
      break;
    }
    case DELETE_ACTIVE_SINGLE_DEAL: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      delete action.payload.data.user;
      api.deal.deleteSingleDeal(action.payload.id)
        .then((response) => {
          if (response.meta.status === 200) {
            store.dispatch({
              type: SET_ACTIVE_SINGLE_DEAL,
              payload: {},
            });
            // store.dispatch({
            //   type: REDIRECT_TO,
            //   payload: { url: '/packages' },
            // });
            // store.dispatch({
            //   type: SET_SCREEN_NOTIFICATION,
            //   payload: { state: true, label: 'Package successfully deleted', type: 'success' },
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
    case GET_ACTIVE_SINGLE_DEAL: {
      next(action);
      const smallLoader = get(action.payload, 'smallLoader', false);
      if (!smallLoader) {
        store.dispatch({
          type: SPINNER_ON,
        });
      }
      const id = get(action.payload, 'id', action.payload);
      api.deal.getSingleDeal(id)
        .then((response) => {
          if (response.meta.status === 200) {
            let dealUserHistory = {};
            let call3;
            let updatedDeal;
            const queryParams = `?parent=${response.data.user.id}&order=createdAt&direction=ASC`;
            // eslint-disable-next-line no-return-assign
            const call2 = api.history.getHistoryList(10, 0, queryParams)
              .then((res) => {
                if (res.meta.status === 200) dealUserHistory = res.data;
              });

            if (response.data.newSeller === true) {
              const obj = cloneDeep(response.data);
              delete obj.user;
              set(obj, 'newSeller', false);
              call3 = api.deal.updateSingleDeal(action.payload, obj)
                .then((res2) => {
                  if (res2.meta.status === 200) {
                    updatedDeal = res2.data;
                    store.dispatch({
                      type: GET_PAGE_DEALS,
                      payload: store.getState().property.activeSingleProperty.id,
                    });
                  } else console.error('Error updating "New" flag');
                });
            }

            Promise.all([call2, call3]).then(() => {
              store.dispatch({
                type: SET_ACTIVE_SINGLE_DEAL,
                payload: has(updatedDeal, 'id') ? updatedDeal : response.data,
              });
              store.dispatch({
                type: SET_DEAL_OWNER_HISTORY_LISTINGS,
                payload: dealUserHistory,
              });
              if (!smallLoader) {
                store.dispatch({
                  type: SPINNER_OFF,
                });
              }
            });
          } else if (!smallLoader) {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case GET_BUYER_DEAL: {
      next(action);
      api.deal.getBuyerDeal(action.payload)
        .then((res) => {
          store.dispatch({
            type: SET_ACTIVE_SINGLE_DEAL,
            payload: res.data,
          });
        });
      break;
    }
    case SAVE_ACTIVE_SINGLE_DEAL: {
      next(action);
      if (action.payload.type !== 'archive') {
        store.dispatch({
          type: SPINNER_ON,
        });
      }

      const obj = cloneDeep(action.payload.data);
      delete obj.user;
      api.deal.updateSingleDeal(action.payload.id, obj)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({
              type: SET_ACTIVE_SINGLE_DEAL,
              payload: res.data,
            });
            store.dispatch({
              type: GET_PAGE_DEALS,
              payload: store.getState().property.activeSingleProperty.id,
            });
            store.dispatch({
              type: GET_HISTORY_LISTINGS,
              payload: {
                parent: action.payload.id,
                type: 'deal',
                resultsPerPage: 50,
                offset: 0,
                order: '',
                direction: 'DESC',
              },
            });
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                state: true,
                label: 'Your changes were saved',
                type: 'success',
              },
            });

            if (action.payload.type !== 'archive') {
              store.dispatch({
                type: SPINNER_OFF,
              });
            }
          } else {
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                state: true,
                label: 'Error archiving the deal',
                type: 'alert',
              },
            });
          }
        });
      break;
    }
    case UPDATE_DEALS_ORDER: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      const arr = cloneDeep(action.payload);
      api.deal.updateMultipleDeals(arr)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                state: true,
                label: 'Deals updated',
                type: 'success',
              },
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
    case UPDATE_MULTIPLE_DEALS: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      const arr = cloneDeep(action.payload);
      const {
        deals,
      } = arr;
      const multiCall = [];
      const resDeals = [];
      deals.forEach((deal) => {
        const obj = cloneDeep(deal.data);
        delete obj.user;
        const callAPI = api.deal.updateSingleDeal(deal.id, obj).then((res) => (resDeals.push(res.data)));
        multiCall.push(callAPI);
      });

      Promise.all(multiCall).then(() => {
        store.dispatch({
          type: GET_HISTORY_LISTINGS,
          payload: {
            parent: store.getState().deal.activeSingleDeal.id,
            type: 'deal',
            resultsPerPage: 50,
            offset: 0,
            order: '',
            direction: 'DESC',
          },
        });
        store.dispatch({
          type: GET_PAGE_DEALS,
          payload: store.getState().property.activeSingleProperty.id,
        });
        store.dispatch({
          type: SET_SCREEN_NOTIFICATION,
          payload: {
            state: true,
            label: 'Your changes were saved',
            type: 'success',
          },
        });
        store.dispatch({
          type: SPINNER_OFF,
        });
      });

      break;
    }
    case SAVE_MAKE_OFFER: {
      next(action);
      const objData = cloneDeep(action.payload);
      const {
        smallLoader,
        id,
      } = objData;
      delete objData.smallLoader;
      delete objData.id;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
      api.deal.makeOffer(id, objData)
        .then((res) => {
          if (!get(res.data, 'statusCode', null)) {
            if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: 'done' });
            store.dispatch({ type: SET_ACTIVE_SINGLE_DEAL, payload: res.data });
          } else if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: null });
        })
        .catch((err) => {
          console.error(err);
        });
      break;
    }
    case SAVE_REVIEW_OFFER: {
      next(action);
      const objData = cloneDeep(action.payload);
      const {
        smallLoader,
        id,
      } = objData;
      delete objData.smallLoader;
      delete objData.id;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
      api.deal.reviewOffer(id, objData)
        .then((res) => {
          if (!get(res.data, 'statusCode', null)) {
            if (smallLoader === 'saveNoteOffer') store.dispatch({ type: SPINNER_SMALL_ON, payload: 'close' });
            else if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: 'done' });
            store.dispatch({ type: SET_ACTIVE_SINGLE_DEAL, payload: res.data });
          } else if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: null });
        })
        .catch((err) => {
          console.error(err);
        });
      break;
    }
    case GET_OFFER_LISTINGS: {
      next(action);
      const objData = cloneDeep(action.payload);
      const {
        smallLoader,
        id,
      } = objData;
      delete objData.smallLoader;
      delete objData.id;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
      api.deal.getOfferListings(id)
        .then((res) => {
          if (!get(res.data, 'statusCode', null)) {
            if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
            store.dispatch({ type: SET_OFFER_LISTINGS, payload: res.data });
          } else if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: null });
        })
        .catch((err) => {
          console.error(err);
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
