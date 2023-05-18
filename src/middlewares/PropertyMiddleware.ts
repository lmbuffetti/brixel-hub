import {change} from '@brixel/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import {
  REDIRECT_TO,
  SET_MODAL,
  SET_SAVED_SCREEN,
  SET_SCREEN_NOTIFICATION,
  SET_SPLASH_TYPE,
  SPINNER_OFF,
  SPINNER_ON,
  SPINNER_SMALL,
} from '../actions/types/CommonTypes';

import {CREATE_ESTIMATION, SEND_PROESTIMATION_NOTIFICATION} from '../actions/types/EstimationTypes';
import {SET_OWNED_PROPERTIES} from '../actions/types/MarketTypes';
import {
  CREATE_ACTIVE_SINGLE_PROPERTY,
  GET_ACTIVE_SINGLE_PROPERTY,
  GET_ACTIVE_SINGLE_PROPERTY_DEALS_COUNT,
  GET_ESTIMATION,
  GET_PACKAGE_PROPERTY,
  GET_PACKAGES_PROPERTY,
  GET_PAGE_DEALS,
  SAVE_ACTIVE_SINGLE_PROPERTY,
  SEND_SCAN_TRIAL_REQUEST,
  SET_ACTIVE_SINGLE_PROPERTY,
  SET_ACTIVE_SINGLE_PROPERTY_DEALS_COUNT,
  SET_ESTIMATION,
  SET_PACKAGE_PROPERTY,
  SET_PACKAGES_PROPERTY,
  SET_PAGE_DEALS,
  UPDATE_PORTALS_REVIEW,
  UPDATE_PUBLISHED_REVIEW,
  SAVE_SCHEDULE_VISIT,
  GET_ACTIVE_SINGLE_PROPERTY_VISITS,
  SET_ACTIVE_SINGLE_PROPERTY_VISITS,
} from '../actions/types/PropertyTypes';
import {SAVE_ACTIVE_SINGLE_USER} from '../actions/types/UserTypes';

import api from '../controllers/api/config';

import ActionStubs from '../resources/Utilities/timelineActionStubs';
import {DealType} from '@brixel/brixel-components/dist/@types/Model';
import {SET_SCHEDULE_VISIT} from '../actions/types/DealTypes';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    // DISPATCH TO CREATE SINGLE PROPERTY - used on onBoarding
    case CREATE_ACTIVE_SINGLE_PROPERTY: {
      next(action);
      const objData = action.payload;
      const {
        getEstimation, token, redirectToUserFlow, redirectToRewards,
        redirectToHome, smallLoader, createEstimation, redirectToUrl,
        extraLoading, baloiseInfo, termsUBS,
      } = objData;
      delete objData.getEstimation;
      delete objData.token;
      delete objData.redirectToUserFlow;
      delete objData.redirectToRewards;
      delete objData.redirectToHome;
      delete objData.smallLoader;
      delete objData.extraLoading;
      delete objData.createEstimation;
      delete objData.baloiseInfo;
      delete objData.termsUBS;
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
      api.property.addProperty(objData, token)
        .then((res) => {
          // store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
          if (!res.data.id) {
            store.dispatch({
              type: SET_MODAL,
              payload: {
                state: true,
                title: 'Ops something was wrong',
                small: true,
                body: '<p>Please contact our support</p>',
                showSupport: true,
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
              store.dispatch({ type: SPINNER_OFF });
              store.dispatch({ type: SPINNER_OFF });
              store.dispatch({ type: SPINNER_OFF });
              store.dispatch({ type: SPINNER_OFF });
            }
          } else {
            store.dispatch(change('GetStarted', 'pageID', res.data.id));
            store.dispatch(change('GetStarted', 'pageAnswer', res.data.packageFlowProcess));
            if (baloiseInfo) {
              const data = {
                id: res.data.owner,
              };
              if (baloiseInfo === 'baloiseBank') set(data, 'termsBaloiseBank', true);
              if (baloiseInfo === 'baloiseInsurance') set(data, 'termsBaloiseInsurance', true);
              if (baloiseInfo === 'both') {
                set(data, 'termsBaloiseBank', true);
                set(data, 'termsBaloiseInsurance', true);
              }
              store.dispatch({ type: SAVE_ACTIVE_SINGLE_USER, payload: data });
            }
            if (termsUBS) {
              const data = {
                id: res.data.owner,
              };
              set(data, 'termsUBS', termsUBS);
              store.dispatch({ type: SAVE_ACTIVE_SINGLE_USER, payload: data });
            }
            if (createEstimation) {
              const data = {
                owner: res.data.owner,
                page: res.data.id,
                generate: true,
                redirectTo: redirectToUrl.replace(':pageID', res.data.id),
                // redirectTo: redirectToUrl,
              };
              store.dispatch({ type: CREATE_ESTIMATION, payload: data });
              if (extraLoading) store.dispatch({ type: SPINNER_OFF });
              store.dispatch({
                type: SET_SCREEN_NOTIFICATION,
                payload: {
                  state: true,
                  type: 'done',
                },
              });
            } else if (getEstimation) {
              store.dispatch({ type: GET_ESTIMATION, payload: res.data.id });
              if (extraLoading) store.dispatch({ type: SPINNER_OFF });
            } else if (redirectToUrl) {
              store.dispatch({
                type: SET_SCREEN_NOTIFICATION,
                payload: {
                  state: true,
                  type: 'done',
                },
              });
              const defURL = redirectToUrl.replace(':pageID', res.data.id);
              window.location.assign(defURL);
            } else if (redirectToHome) {
              store.dispatch({
                type: SET_SCREEN_NOTIFICATION,
                payload: {
                  state: true,
                  type: 'done',
                },
              });
              window.location.assign(`/${res.data.id}/sell`);
            } else if (redirectToRewards) {
              store.dispatch({
                type: SET_SCREEN_NOTIFICATION,
                payload: {
                  state: true,
                  type: 'done',
                },
              });
              window.location.assign(`/${res.data.id}/home`);
            } else if (redirectToUserFlow) {
              store.dispatch({
                type: SET_SCREEN_NOTIFICATION,
                payload: {
                  state: true,
                  type: 'done',
                },
              });
              window.location.assign('/onBoarding/brixelComingInTown');
            } else if (smallLoader) {
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
          // store.dispatch(reset('Property'));
        })
        .catch(() => {
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
        });
      break;
    }
    // DISPATCH TO UPDATE SINGLE PROPERTY - by PROPERTY ID
    case SAVE_ACTIVE_SINGLE_PROPERTY: {
      next(action);
      const obj = cloneDeep(action.payload);
      const {
        estimationId,
        getEstimation,
        id,
        redirectTo,
        redirectToHome,
        sendNotification,
        setSuccessNotification,
        smallLoader,
        splashType,
      } = action.payload;
      delete obj.estimationId;
      delete obj.getEstimation;
      delete obj.id;
      delete obj.redirectTo;
      delete obj.redirectToHome;
      delete obj.sendNotification;
      delete obj.setSuccessNotification;
      delete obj.smallLoader;
      delete obj.splashType;
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

      // Set page version using timestamp, to control parallel page access/edit
      set(obj, 'version', store.getState().property.activeSingleProperty.updatedAt);

      const data = action.payload;
      if (get(data, 'photos', []).length > 0) {
        data.coverPhoto = data.photos[0];
      }
      api.property.updateProperty(id, obj)
        .then((res) => {
          // Page integrity is violated
          if (res.meta.status === 401 && res.data.errorMessage === 'ERROR_PAGE_INTEGRITY') {
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                state: true,
                label: 'Some information was updated by another user, please fill it again',
                type: 'alert',
                action: 'reloadButton',
              },
            });
          } else {
            if (splashType === 'bestimateTeaser') {
              store.dispatch({ type: SET_SPLASH_TYPE, payload: 'bestimateTeaser' });
            }
            if (splashType === 'bestimateResult') {
              store.dispatch({ type: SET_SPLASH_TYPE, payload: 'bestimateResult' });
              const estimationPayload = {
                owner: store.getState().user.loggedInUser.user.id,
                page: id,
                generate: true,
              };
              store.dispatch({ type: CREATE_ESTIMATION, payload: estimationPayload });
            }
            if (sendNotification) store.dispatch({ type: SEND_PROESTIMATION_NOTIFICATION, payload: { id: estimationId } });
            store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
            if (setSuccessNotification) {
              store.dispatch({
                type: SET_SCREEN_NOTIFICATION,
                payload: {
                  state: true,
                  type: 'done',
                },
              });
            }
            if (getEstimation) {
              store.dispatch({ type: GET_ESTIMATION, payload: res.data.id });
            }
            if (redirectTo) {
              store.dispatch({ type: REDIRECT_TO, payload: { history: redirectTo } });
            }
            if (redirectToHome) {
              window.location.assign(`/${res.data.id}/sell`);
            }
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
    // DISPATCH TO GET SINGLE PROPERTY - by PROPERTY ID
    case GET_ACTIVE_SINGLE_PROPERTY: {
      next(action);
      const {
        smallLoader,
        setSuccessNotification,
        multiLoader,
        stub,
      } = action.payload;
      delete action.payload.smallLoader;
      delete action.payload.setSuccessNotification;
      delete action.payload.multiLoader;
      delete action.payload.stub;
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
      const id = stub || action.payload.id;
      const fullVersion = get(action, 'payload.fullVersion', true);
      let apiEndPoint = (data) => (fullVersion ? api.property.getProperty(data) : api.property.getPropertySimplified(data));
      if (stub) apiEndPoint = (data) => api.property.getPropertyByStub(data);
      apiEndPoint(id)
        .then((res) => {
          if (get(res, 'data.statusCode', null)) {
            window.location.assign('/sell');
          }
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
          if (setSuccessNotification) {
            store.dispatch({ type: SET_SAVED_SCREEN });
          }
          if (multiLoader) store.dispatch({ type: SPINNER_OFF });
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
          store.dispatch({
            type: SPINNER_OFF,
          });
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
          window.location.assign('/sell');
        });
      break;
    }
    // DISPATCH TO GET USER PROPERTIES LIST - by PROPERTY ID
    case GET_ESTIMATION: {
      next(action);
      let type;
      let id;
      const { generate, smallLoader } = action.payload;
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
      if (has(action.payload, 'type') && action.payload.type === 'market') {
        type = true;
        // eslint-disable-next-line prefer-destructuring
        id = action.payload.id;
      } else {
        type = false;
        id = get(action.payload, 'id', action.payload);
      }
      api.property.getEstimation(id)
        .then((res) => {
          if (res.meta.normalizedStatus === 200) {
            store.dispatch({ type: SET_ESTIMATION, payload: res.data });
            if (typeof res.data.statusCode === 'undefined') {
              // window.location.href = `/packageFlow/${action.payload}/home`;
            }
          } else {
            const data = {
              owner: store.getState().user.loggedInUser.user.id,
              page: type === true ? id : store.getState().brixelForm.Property.values.id,
              generate: has(action.payload, 'generate') ? generate : true,
              reloadOnwProperties: get(action.payload, 'reloadOnwProperties', false),
            };
            store.dispatch({ type: CREATE_ESTIMATION, payload: data });
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
          const statusCode = get(err, 'meta.statusText.response.data.statusCode', null);
          if (statusCode === 404) {
            const data = {
              owner: store.getState().user.loggedInUser.user.id,
              page: type === true ? id : store.getState().brixelForm.Property.values.id,
              generate: has(action.payload, 'generate') ? generate : true,
              reloadOnwProperties: get(action.payload, 'reloadOnwProperties', false),
            };
            store.dispatch({ type: CREATE_ESTIMATION, payload: data });
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
          store.dispatch({ type: SET_ESTIMATION, payload: {} });
        });
      break;
    }
    // DISPATCH TO UPDATE PORTALS REVIEW - by PROPERTY ID
    case UPDATE_PORTALS_REVIEW: {
      next(action);
      const { smallLoader, page, status } = action.payload;
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
      api.property.changePortalsReview(page, status)
        .then((res) => {
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
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
    // DISPATCH TO UPDATE PUBLISHED PAGE REVIEW - by PROPERTY ID
    case UPDATE_PUBLISHED_REVIEW: {
      next(action);
      const { smallLoader, page, status } = action.payload;
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
      api.property.changePublishReview(page, status)
        .then((res) => {
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
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
    // DISPATCH TO GET PACKAGE FO PROPERTY - by PROPERTY ID
    case GET_PACKAGES_PROPERTY: {
      next(action);
      const { id, smallLoader } = action.payload;
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
      api.company.getPackagesCompany(id)
        .then((res) => {
          store.dispatch({ type: SET_PACKAGES_PROPERTY, payload: res.data });
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
    // DISPATCH TO GET PACKAGE FO PROPERTY - by PROPERTY ID
    case GET_PACKAGE_PROPERTY: {
      next(action);
      const {
        addToOwnerProp,
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
      api.property.packagePage(id)
        .then((res) => {
          if (res.meta.status === 200) {
            if (addToOwnerProp) {
              const ownProp = get(store.getState(), 'market.ownerProperties', {});
              if (get(ownProp, 'data', null)) {
                const indexProp = ownProp.data.findIndex((item) => item.id === id);
                if (ownProp.data[indexProp].servicePackage) ownProp.data[indexProp].servicePackage = res.data;
              }
              store.dispatch({ type: SET_OWNED_PROPERTIES, payload: ownProp });
            } else {
              store.dispatch({ type: SET_PACKAGE_PROPERTY, payload: res.data });
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
          } else {
            // TODO: Should dispatch error state
          }
        });
      break;
    }
    // SEND TRIAL REQUEST
    case SEND_SCAN_TRIAL_REQUEST: {
      next(action);
      const { page, data, smallLoader } = action.payload;
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
      api.property.sendScanTrial(page, data)
        .then(() => {
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
    // GET DEALS BY PAGE
    case GET_PAGE_DEALS: {
      next(action);
      const {
        id,
        order,
        direction,
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
      const queryParams = `?order=${order || 'updatedAt'}&direction=${direction || 'DESC'}`;
      api.property.getPageDeals(id, queryParams)
        .then((response) => {
          const calls = [];
          const deals = response.data;
          Object.keys(deals).forEach((key) => {
            // We only need user actions for the property on this deal when the deal is on stage 'Interested'
            if (deals[key] === 'Interested') {
              // if get user push
              if (has(deals, 'user.id')) {
                const queryParams2 = `?parent=${deals.user.id}&child=${id}&order=updatedAt&direction=DESC&historyType=user`;
                // @ts-ignore
                calls.push(api.history.getHistoryList(50, 0, queryParams2, ActionStubs.DealOwner));
              }
            }
          });

          store.dispatch({
            type: SET_PAGE_DEALS,
            payload: deals,
          });
          if (calls.length > 0) {
            Promise.all(calls).then((res) => {
              // Process the user history for each deal
              res.forEach((userHistory) => {
                // We need the the user history filtered by the active property
                const userHistoryFiltered = filter(get(userHistory, 'data.data', []), (el) => get(el, 'child', '') === action.payload.id);
                // We need the most recent entry, which is the first position based on the direction written on the queryparams
                const mostRecentUserHistoryFiltered = userHistoryFiltered[0];
                const dealIndex = findIndex(deals, (d: DealType) => d.user.id === get(mostRecentUserHistoryFiltered, 'parent', ''));
                set(deals[dealIndex], 'lastAction', mostRecentUserHistoryFiltered);
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
              store.dispatch({
                type: SET_PAGE_DEALS,
                payload: deals,
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
          } else if (smallLoader) {
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
    case GET_ACTIVE_SINGLE_PROPERTY_DEALS_COUNT: {
      next(action);
      const { id, smallLoader } = action.payload;
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
      api.property.getPageDealsCount(id).then((res) => {
        if (res.meta.status === 200) {
          store.dispatch({
            type: SET_ACTIVE_SINGLE_PROPERTY_DEALS_COUNT,
            payload: res.data,
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
    // SAVE SCHEDULE VISIT
    case SAVE_SCHEDULE_VISIT: {
      const { data, smallLoader } = action.payload;
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
      api.property.saveScheduleVisit(data)
        .then((res) => {
          store.dispatch({
            type: SET_SCHEDULE_VISIT,
            payload: [res.data],
          });
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: 'saved',
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        })
      break;
    }
    // GET VISITS BY PAGE
    case GET_ACTIVE_SINGLE_PROPERTY_VISITS: {
      const { id, smallLoader } = action.payload;
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
      api.property.getPropertyVisits(id)
        .then((res) => {
          store.dispatch({
            type: SET_ACTIVE_SINGLE_PROPERTY_VISITS,
            payload: res.data,
          });
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: 'saved',
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        })
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
