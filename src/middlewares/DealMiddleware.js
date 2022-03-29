import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import {
  SPINNER_ON,
  SPINNER_OFF,
  REDIRECT_TO,
  SET_SCREEN_NOTIFICATION,
  SPINNER_SMALL,
} from '../actions/types/CommonTypes';

import {
  CREATE_DEAL,
  DELETE_ACTIVE_SINGLE_DEAL,
  GET_ACTIVE_SINGLE_DEAL,
  GET_BUYER_DEAL,
  GET_DEAL_LISTINGS,
  GET_OFFER_LISTINGS,
  GET_USER_DEALS,
  SAVE_ACTIVE_SINGLE_DEAL, SAVE_MAKE_OFFER,
  SAVE_CLOSING_IDENTIFICATION,
  SAVE_REVIEW_OFFER,
  SEND_VISIT_FEEDBACK,
  SET_ACTIVE_SINGLE_DEAL,
  SET_DEAL_LISTINGS,
  SET_OFFER_LISTINGS,
  SET_USER_DEALS,
  UPDATE_DEALS_ORDER,
  UPDATE_MULTIPLE_DEALS,
} from '../actions/types/DealTypes';

import {
  SET_DEAL_OWNER_HISTORY_LISTINGS, GET_HISTORY_LISTINGS,
} from '../actions/types/HistoryTypes';

import {
  GET_PAGE_DEALS,
} from '../actions/types/PropertyTypes';

import { exampleDeal } from '../resources/exampleDeal';

import api from '../controllers/api/config';

const ActionStubs = require('../resources/timelineActionStubs');

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_USER_DEALS: {
      next(action);
      const {
        id,
        smallLoader,
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
      api.user.getPagesByDealByUser(id)
        .then((res) => {
          store.dispatch({ type: SET_USER_DEALS, payload: res.data });
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
    case GET_DEAL_LISTINGS: {
      next(action);
      const {
        company,
        direction,
        offset,
        order,
        resultsPerPage,
        smallLoader,
        text,
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
      // eslint-disable-next-line no-case-declarations
      const queryParams = `?search=${text}&order=${order}&direction=${direction}&company=${company}`;
      api.deal.getDealsList(resultsPerPage, offset, queryParams)
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
          } else {
            // Should dispatch error state
            store.dispatch({
              type: REDIRECT_TO,
              payload: {
                url: '/properties',
              },
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
    case CREATE_DEAL: {
      next(action);
      const {
        link,
        smallLoader,
      } = action.payload;
      delete action.payload.link;
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
                            type: 'done',
                          },
                        });
                        store.dispatch({
                          type: GET_PAGE_DEALS,
                          payload: {
                            id: action.payload.page,
                            smallLoader,
                          },
                        });
                        store.dispatch({
                          type: REDIRECT_TO,
                          payload: {
                            history: link,
                          },
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
                      type: 'done',
                    },
                  });
                  store.dispatch({
                    type: GET_PAGE_DEALS,
                    payload: {
                      id: action.payload.page,
                      smallLoader,
                    },
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
      const {
        id,
        smallLoader,
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
      delete action.payload.data.user;
      api.deal.deleteSingleDeal(id)
        .then((response) => {
          if (response.meta.status === 200) {
            store.dispatch({
              type: SET_ACTIVE_SINGLE_DEAL,
              payload: {},
            });
          } else {
            // TODO: Should dispatch error state
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
    case GET_ACTIVE_SINGLE_DEAL: {
      next(action);
      const {
        id,
        smallLoader,
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
      if (id === 'sample') {
        const country = get(store.getState(), 'property.activeSingleProperty.location.countryCode', 'CH');
        store.dispatch({
          type: SET_ACTIVE_SINGLE_DEAL,
          payload: exampleDeal(country),
        });
      } else {
        api.deal.getSingleDeal(id)
          .then((response) => {
            if (response.meta.status === 200) {
              let dealUserHistory = {};
              let call3;
              let updatedDeal;
              const queryParamsDealUser = `?parent=${response.data.user.id}&order=createdAt&direction=ASC&historyType=user`;
              // eslint-disable-next-line no-return-assign
              const call2 = api.history.getHistoryList(10, 0, queryParamsDealUser, ActionStubs.DealOwner)
                .then((res) => {
                  if (res.meta.status === 200) dealUserHistory = res.data;
                });

              if (response.data.newSeller === true) {
                const obj = cloneDeep(response.data);
                delete obj.user;
                set(obj, 'newSeller', false);
                call3 = api.deal.updateSingleDeal(id, obj)
                  .then((res2) => {
                    if (res2.meta.status === 200) {
                      updatedDeal = res2.data;
                      store.dispatch({
                        type: SET_ACTIVE_SINGLE_DEAL,
                        payload: updatedDeal,
                      });
                    } else {
                      // eslint-disable-next-line no-console
                      console.error('Error updating "New" flag');
                    }
                  });
              }
              Promise.all([call2, call3]).then(() => {
                // Set the parent of each history entry with the user
                // associated with the deal api call
                dealUserHistory.data.forEach((entry) => {
                  set(entry, 'parent', response.data.user);
                });

                store.dispatch({
                  type: SET_ACTIVE_SINGLE_DEAL,
                  payload: has(updatedDeal, 'id') ? updatedDeal : response.data,
                });
                store.dispatch({
                  type: SET_DEAL_OWNER_HISTORY_LISTINGS,
                  payload: dealUserHistory,
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
            } else if (!smallLoader) {
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
      }
      break;
    }
    case GET_BUYER_DEAL: {
      next(action);
      const {
        id,
        smallLoader,
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
      api.deal.getBuyerDeal(id)
        .then((res) => {
          console.log(res.data);
          if (!res.data) {
            const deal = {
              page: id,
              user: get(store.getState(), 'user.loggedInUser.user.id', ''),
              stage: 'Interested',
              actionStub: 'add-favorite',
            };
            api.deal.createSingleDeal(deal)
              .then((response1) => {
                if (response1.meta.normalizedStatus === 200) {
                  store.dispatch({
                    type: SET_ACTIVE_SINGLE_DEAL,
                    payload: response1.data,
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
          } else {
            store.dispatch({
              type: SET_ACTIVE_SINGLE_DEAL,
              payload: res.data,
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
          }
        });
      break;
    }
    case SAVE_ACTIVE_SINGLE_DEAL: {
      next(action);
      const {
        data,
        id,
        smallLoader,
        type,
      } = action.payload;
      if (type !== 'archive') {
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
      }

      const obj = cloneDeep(data);
      delete obj.user;
      api.deal.updateSingleDeal(id, obj)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({
              type: SET_ACTIVE_SINGLE_DEAL,
              payload: res.data,
            });
            store.dispatch({
              type: GET_PAGE_DEALS,
              payload: {
                id: store.getState().property.activeSingleProperty.id,
                smallLoader,
              },
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
                type: 'done',
              },
            });

            if (action.payload.type !== 'archive') {
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
      const {
        data,
        smallLoader,
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
      const arr = cloneDeep(data);
      api.deal.updateMultipleDeals(arr)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({
              type: GET_PAGE_DEALS,
              payload: {
                id: store.getState().property.activeSingleProperty.id,
                smallLoader,
              },
            });
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                state: true,
                label: 'Deals updated',
                type: 'done',
              },
            });
          } else {
            // TODO: Should dispatch error state
          }
          if (!smallLoader) {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case UPDATE_MULTIPLE_DEALS: {
      next(action);
      const {
        deals,
        smallLoader,
      } = action.payload;
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
      const arrDeals = cloneDeep(deals);
      const multiCall = [];
      const resDeals = [];
      arrDeals.forEach((deal) => {
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
          payload: {
            id: store.getState().property.activeSingleProperty.id,
            smallLoader,
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
    case SAVE_MAKE_OFFER: {
      next(action);
      const objData = cloneDeep(action.payload);
      const {
        smallLoader,
        id,
      } = objData;
      delete objData.smallLoader;
      delete objData.id;
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
      api.deal.makeOffer(id, objData)
        .then((res) => {
          if (!get(res.data, 'statusCode', null)) {
            const { data } = res;
            store.dispatch({ type: SET_ACTIVE_SINGLE_DEAL, payload: data });
          }
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: 'done',
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      break;
    }
    case SAVE_REVIEW_OFFER: {
      next(action);
      const objData = cloneDeep(action.payload);
      const {
        act,
        smallLoader,
        id,
      } = objData;
      delete objData.smallLoader;
      delete objData.id;
      delete objData.act;
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
      api.deal.reviewOffer(id, objData)
        .then((res) => {
          if (!get(res.data, 'statusCode', null)) {
            if (act === 'saveNote') {
              store.dispatch({
                type: SPINNER_SMALL,
                payload: {
                  [smallLoader]: 'close',
                },
              });
            } else if (smallLoader) {
              store.dispatch({
                type: SPINNER_SMALL,
                payload: {
                  [smallLoader]: 'done',
                },
              });
            }
            store.dispatch({ type: SET_ACTIVE_SINGLE_DEAL, payload: res.data });
          } else if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
              },
            });
          }
          if (!smallLoader) {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
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
      api.deal.getOfferListings(id)
        .then((res) => {
          if (!get(res.data, 'statusCode', null)) {
            let { data } = res;
            if (data.length === 0) {
              const country = get(store.getState(), 'property.activeSingleProperty.location.countryCode', 'CH');
              const sampleData = exampleDeal(country);
              data = [
                {
                  deal: 'sample',
                  offer: sampleData.closing.stageOffer.offer,
                  user: sampleData.user,
                },
              ];
            }
            store.dispatch({ type: SET_OFFER_LISTINGS, payload: data });
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
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      break;
    }
    case SEND_VISIT_FEEDBACK: {
      next(action);
      const objData = cloneDeep(action.payload);
      const {
        smallLoader,
        id,
        sendSlack,
      } = objData;
      delete objData.smallLoader;
      delete objData.id;
      delete objData.sendSlack;
      delete objData.status;
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
      api.deal.sendVisitFeedback(id, sendSlack, objData)
        .then(() => {
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
                [`${smallLoader}Sent`]: true,
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      break;
    }
    case SAVE_CLOSING_IDENTIFICATION: {
      next(action);
      const objData = cloneDeep(action.payload);
      const {
        smallLoader,
        id,
        personType,
      } = objData;
      delete objData.smallLoader;
      delete objData.id;
      delete objData.personType;
      delete objData.status;
      delete objData.allImgs;
      delete objData.actions;
      delete objData.saveAction;
      delete objData.user;
      delete objData.completedAt;
      delete objData.completedBy;
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
      api.deal.closingIdentification(id, personType, objData)
        .then((response) => {
          store.dispatch({
            type: SET_ACTIVE_SINGLE_DEAL,
            payload: response.data,
          });
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
                [`${smallLoader}Sent`]: true,
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
