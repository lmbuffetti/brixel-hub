/* eslint-disable no-case-declarations */
import get from 'lodash/get';
import { reset } from 'redux-form';
import {
  GET_ESTIMATION,
  SET_ESTIMATION,
  GET_MARKET_CHECK,
  SET_MARKET_CHECK,
  GET_ACTIVE_SINGLE_PROPERTY,
  CREATE_ACTIVE_SINGLE_PROPERTY,
  SAVE_ACTIVE_SINGLE_PROPERTY,
  DELETE_ACTIVE_SINGLE_PROPERTY,
  GET_PROPERTY_LISTINGS,
  SET_ACTIVE_SINGLE_PROPERTY,
  SET_PROPERTY_LISTINGS,
  CREATE_PROPERTY_VISIT_SCHEDULE,
  SAVE_PROPERTY_VISIT_SCHEDULE,
  DELETE_PROPERTY_VISIT_SCHEDULE,
  GET_ACTIVE_SINGLE_PROPERTY_BOOKINGS,
  SET_ACTIVE_SINGLE_PROPERTY_BOOKINGS,
  SAVE_PROPERTY_VISIT_BOOKING,
  CREATE_PROPERTY_VISIT_BOOKING,
  UPDATE_PORTALS_REVIEW,
  UPDATE_PUBLISHED_REVIEW,
  GET_PACKAGES_PROPERTY,
  SET_PACKAGES_PROPERTY,
  SAVE_UPGRADE_PLAN,
} from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';
import {
  SPINNER_ON,
  SPINNER_OFF,
  SPINNER_SMALL_ON,
  SPINNER_SMALL_OFF,
  REDIRECT_TO,
  SET_SAVED_SCREEN,
} from '../actions/types/CommonTypes';
import { cutValue, roundFifty, roundFiveThousand } from '../utils/helpers';
import properties from '../resources/localData/properties.json';
import page from '../resources/localData/page.json';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case CREATE_ACTIVE_SINGLE_PROPERTY: {
      next(action);
      const {
        getEstimation, token, redirectToUserFlow, redirectToRewards,
        redirectToHome, smallLoader
      } = action.payload;
      delete action.payload.getEstimation;
      delete action.payload.token;
      delete action.payload.redirectToUserFlow;
      delete action.payload.redirectToRewards;
      delete action.payload.redirectToHome;
      delete action.payload.smallLoader;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
      else store.dispatch({ type: SPINNER_ON });
      api.property.addProperty(action.payload, token)
        .then((res) => {
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
          if (getEstimation) {
            store.dispatch({ type: GET_ESTIMATION, payload: res.data.id });
          } else if (redirectToRewards) {
            window.location.href = `/packageFlow/${action.payload}/rewards`;
          } else if (redirectToHome) {
            window.location.href = `/${res.data.id}/rewards`;
          } else if (redirectToUserFlow) {
            window.location.href = '/onBoarding/brixelComingInTown';
          } else {
            if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
            else store.dispatch({ type: SPINNER_OFF });
          }
          //store.dispatch(reset('Property'));
        })
        .catch(() => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case SAVE_ACTIVE_SINGLE_PROPERTY: {
      next(action);
      const { id, redirectTo, redirectToHome, smallLoader, setSuccessNotification, getEstimation } = action.payload;
      delete action.payload.id;
      delete action.payload.redirectTo;
      delete action.payload.smallLoader;
      delete action.payload.redirectToHome;
      delete action.payload.setSuccessNotification;
      delete action.payload.getEstimation;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
      else store.dispatch({ type: SPINNER_ON });
      const data = action.payload;
      if (get(data, 'photos', []).length > 0) {
        data.coverPhoto = data.photos[0];
      }
      api.property.updateProperty(id, action.payload)
        .then((res) => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
          if (getEstimation) {
            store.dispatch({ type: GET_ESTIMATION, payload: res.data.id });
          }
          if (redirectTo) {
            store.dispatch({ type: REDIRECT_TO, payload: { history: redirectTo } });
          }
          if (setSuccessNotification) {
            store.dispatch({ type: SET_SAVED_SCREEN });
          }
          if (redirectToHome) {
            window.location.href = `/${res.data.id}/home`;
          }
        });
      break;
    }
    case DELETE_ACTIVE_SINGLE_PROPERTY: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.property.deleteProperty(action.payload.id)
        .then((response) => {
          if (response.meta.status === 200) {
            store.dispatch({
              type: SET_ACTIVE_SINGLE_PROPERTY,
              payload: {},
            });
            store.dispatch({
              type: REDIRECT_TO,
              payload: { url: '/' },
            });
          } else {
            // TODO: Should dispatch error state

          }
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case GET_ACTIVE_SINGLE_PROPERTY: {
      next(action);
      const { smallLoader, setSuccessNotification, multiLoader } = action.payload;
      delete action.payload.smallLoader;
      delete action.payload.setSuccessNotification;
      delete action.payload.multiLoader;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
      else store.dispatch({ type: SPINNER_ON });
      const fullVersion = get(action, 'payload.fullVersion', true);
      const apiEndPoint = (data) => fullVersion ? api.property.getProperty(data) : api.property.getPropertySimplified(data);
      apiEndPoint(action.payload.id)
        .then((res) => {
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
          if (setSuccessNotification) {
            store.dispatch({ type: SET_SAVED_SCREEN });
          }
          if (multiLoader) store.dispatch({ type: SPINNER_OFF });
        })
        .catch(() => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
          if (window.location.href.includes('localhost')) {
            store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: page });
          }
          if (multiLoader) store.dispatch({ type: SPINNER_OFF });
          // window.location.href = `/`;
        });
      break;
    }
    case GET_PROPERTY_LISTINGS:
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const { setAsSingle, multiLoader } = action.payload;
      delete action.payload.setAsSingle;
      delete action.payload.multiLoader;
      api.property.getProperties(action.payload.limit, action.payload.offset)
        .then((res) => {
          if (setAsSingle) {
            store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data[0] });
          } else {
            store.dispatch({ type: SET_PROPERTY_LISTINGS, payload: res.data });
          }
          store.dispatch({ type: SPINNER_OFF });
          if (multiLoader) store.dispatch({ type: SPINNER_OFF });
        })
        .catch(() => {
          if (window.location.href.includes('localhost')) {
            if (setAsSingle) {
              store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: page });
            } else {
              store.dispatch({ type: SET_PROPERTY_LISTINGS, payload: properties });
            }
          }
          store.dispatch({ type: SPINNER_OFF });
          if (multiLoader) store.dispatch({ type: SPINNER_OFF });
        });
      break;
    case GET_ESTIMATION:
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.property.getEstimation(action.payload)
        .then((res) => {
          store.dispatch({ type: SPINNER_OFF });
          store.dispatch({ type: SET_ESTIMATION, payload: res.data });
          if (typeof res.data.statusCode === 'undefined') {
            // window.location.href = `/packageFlow/${action.payload}/rewards`;
          }
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    case GET_MARKET_CHECK: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const {
        north,
        south,
        west,
        east,
        propertyType,
        minLivingSpace,
        maxLivingSpace,
        stateCode,
      } = action.payload;
      const urlSpace = `?propertyType=${propertyType}&livingSpaceMin=${minLivingSpace}&livingSpaceMax=${maxLivingSpace}&southLatitude=${south}&northLatitude=${north}&westLongitude=${west}&eastLongitude=${east}&limit=50&skip=0&countryCode=${stateCode}`;
      const marketData = {};
      const getMarketData = async () => {
        await api.property.getPriceDistribution(urlSpace)
          .then((res) => {
            marketData.priceDistribution = res.data;
            marketData.priceDistribution.medianRounded = roundFiveThousand(res.data.median);
            const newPriceDistribution = [];
            Object.keys(res.data.pricesDistribution)
              .map((item, index) => {
                const min = item.split('-')[0];
                const max = item.split('-')[1];
                let curEl = false;
                if (+min <= +res.data.median && +max >= +res.data.median) curEl = true;
                return newPriceDistribution.push({
                  priceRangeStart: item.split('-')[0],
                  numberOfProperties: res.data.pricesDistribution[item],
                  rangeStep: +item.split('-')[1] - +item.split('-')[0],
                  rangePrice: `${cutValue(min)} - ${cutValue(max)}`,
                  median: roundFiveThousand(res.data.median.toFixed(0)),
                  id: index,
                  curEl,
                });
              });
            marketData.priceDistribution.chartRangePrice = newPriceDistribution;
          })
          .catch(() => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getLivingSpaceDistribution(urlSpace)
          .then((res) => {
            marketData.livingSpacesDistribution = res.data;
          })
          .catch(() => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getPricePerSpace(urlSpace)
          .then((res) => {
            marketData.pricePerSpace = res.data;
            marketData.pricePerSpace.medianRounded = roundFifty(res.data.median);
            const newPriceDistribution = [];
            Object.keys(res.data.pricesPerM2Distribution)
              .map((item, index) => {
                const min = item.split('-')[0];
                const max = item.split('-')[1];
                let curEl = false;
                if (+min <= +res.data.median && +max >= +res.data.median) curEl = true;
                return newPriceDistribution.push({
                  priceRangeStart: item.split('-')[0],
                  numberOfProperties: res.data.pricesPerM2Distribution[item],
                  rangeStep: +item.split('-')[1] - +item.split('-')[0],
                  rangePrice: `${cutValue(min)} - ${cutValue(max)}`,
                  median: roundFifty(res.data.median.toFixed(0)),
                  id: index,
                  curEl,
                });
              });
            marketData.pricePerSpace.chartRangePrice = newPriceDistribution;
          })
          .catch(() => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getMarketDays(urlSpace)
          .then((res) => {
            marketData.daysOnMarketDistribution = res.data;
          })
          .catch(() => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getContructionYears(urlSpace)
          .then((res) => {
            marketData.constructionYearDistribution = res.data;
          })
          .catch(() => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getMerged(urlSpace)
          .then((res) => {
            marketData.list = res.data;
          })
          .catch(() => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getMergedBySubtype(urlSpace)
          .then((res) => {
            marketData.countBySubType = res.data;
          })
          .catch(() => {
            store.dispatch({ type: SPINNER_OFF });
          });
        store.dispatch({ type: SET_MARKET_CHECK, payload: marketData });
        store.dispatch({ type: SPINNER_OFF });
      };
      getMarketData();
      break;
    }
    case CREATE_PROPERTY_VISIT_SCHEDULE: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON, payload: action.payload.smallLoader || 'visitSchedule' });
      api.property.createPropertyVisitSchedule(action.payload)
        .then((response) => {
          if (response.meta.status === 201) {
            store.dispatch({
              type: GET_ACTIVE_SINGLE_PROPERTY,
              payload: action.payload.page,
            });
            store.dispatch({ type: SPINNER_SMALL_OFF });
          } else {
            // TODO: Should dispatch error state
            store.dispatch({ type: SPINNER_SMALL_OFF });
          }
        });
      break;
    }
    case SAVE_PROPERTY_VISIT_SCHEDULE: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON, payload: action.payload.smallLoader || 'saveVisitSchedule' });
      api.property.updatePropertyVisitSchedule(action.payload.scheduleId, action.payload.data)
        .then((response) => {
          if (response.meta.status === 200) {
            store.dispatch({
              type: GET_ACTIVE_SINGLE_PROPERTY,
              payload: { id: action.payload.data.page, smallLoader: true, setSuccessNotification: true },
            });
            store.dispatch({ type: SPINNER_SMALL_OFF });
          } else {
            // TODO: Should dispatch error state
            store.dispatch({ type: SPINNER_SMALL_OFF });
          }
        });
      break;
    }
    case DELETE_PROPERTY_VISIT_SCHEDULE: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.property.deletePropertyVisitSchedule(action.payload.scheduleId)
        .then((response) => {
          if (response.meta.status === 200) {
            store.dispatch({
              type: GET_ACTIVE_SINGLE_PROPERTY,
              payload: { id: action.payload.pageId, smallLoader: true  },
            });
            store.dispatch({ type: SPINNER_OFF });
          } else {
            // TODO: Should dispatch error state
            store.dispatch({ type: SPINNER_OFF });
          }
        });
      break;
    }
    case GET_ACTIVE_SINGLE_PROPERTY_BOOKINGS: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON, payload: action.payload.smallLoader || 'booking' });
      const { id } = action.payload;
      api.property.getPageVisits(id).then((response) => {
        store.dispatch({
          type: SET_ACTIVE_SINGLE_PROPERTY_BOOKINGS,
          payload: response.data,
        });
        store.dispatch({ type: SPINNER_SMALL_OFF });
      });
      break;
    }
    case SAVE_PROPERTY_VISIT_BOOKING: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON, payload: action.payload.smallLoader || 'saveBooking' });
      const { scheduleId, data } = action.payload;
      delete action.payload.id;
      api.property.updatePropertyVisit(scheduleId, data)
        .then(() => {
          store.dispatch({
            type: GET_ACTIVE_SINGLE_PROPERTY_BOOKINGS,
            payload: { id: data.page },
          });
          store.dispatch({ type: SPINNER_SMALL_OFF });
        });
      break;
    }
    case CREATE_PROPERTY_VISIT_BOOKING: {
      next(action);
      const { page } = action.payload;
      api.property.createPropertyVisit(action.payload)
        .then(() => {
          store.dispatch({
            type: GET_ACTIVE_SINGLE_PROPERTY_BOOKINGS,
            payload: { id: page },
          });
        });
      break;
    }
    case UPDATE_PORTALS_REVIEW: {
      next(action);
      const { smallLoader, page, status } = action.payload;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
      else store.dispatch({ type: SPINNER_ON });
      api.property.changePortalsReview(page, status)
        .then((res) => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
        });
      break;
    }
    case UPDATE_PUBLISHED_REVIEW: {
      next(action);
      const { smallLoader, page, status } = action.payload;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
      else store.dispatch({ type: SPINNER_ON });
      api.property.changePublishReview(page, status)
        .then((res) => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
        });
      break;
    }
    case GET_PACKAGES_PROPERTY: {
      next(action);
      const { smallLoader } = action.payload;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
      else store.dispatch({ type: SPINNER_ON });
      api.property.getPackageList(10, 0)
        .then((res) => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
          store.dispatch({ type: SET_PACKAGES_PROPERTY, payload: res.data });
        });
      break;
    }
    case SAVE_UPGRADE_PLAN: {
      next(action);
      const { smallLoader, page, data } = action.payload;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: smallLoader });
      else store.dispatch({ type: SPINNER_ON });
      api.property.saveUpgradePlan(page, data)
        .then((res) => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
          //store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
          // console.log(res.data);
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
