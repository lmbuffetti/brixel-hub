/* eslint-disable no-case-declarations */
import get from 'lodash/get';
import {
  GET_ESTIMATION,
  SET_ESTIMATION,
  GET_MARKET_CHECK,
  SET_MARKET_CHECK,
  GET_ACTIVE_SINGLE_PROPERTY,
  CREATE_ACTIVE_SINGLE_PROPERTY,
  SAVE_ACTIVE_SINGLE_PROPERTY,
  DELETE_ACTIVE_SINGLE_PROPERTY, GET_PROPERTY_LISTINGS, SET_ACTIVE_SINGLE_PROPERTY, SET_PROPERTY_LISTINGS,
} from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';
import {
  SPINNER_ON,
  SPINNER_OFF,
  SPINNER_SMALL_ON,
  SPINNER_SMALL_OFF,
  REDIRECT_TO,
  SET_SCREEN_NOTIFICATION,
} from '../actions/types/CommonTypes';
import { cutValue, roundFifty, roundFiveThousand } from '../utils/helpers';
import { SET_LOGGED_IN_USER } from '../actions/types/UserTypes';
import properties from '../resources/localData/properties';
import page from '../resources/localData/page';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case CREATE_ACTIVE_SINGLE_PROPERTY:
      next(action);
      const { getEstimation, token, redirectToUserFlow, redirectToRewards, redirectToHome, smallLoader } = action.payload;
      delete action.payload.getEstimation;
      delete action.payload.token;
      delete action.payload.redirectToUserFlow;
      delete action.payload.redirectToRewards;
      delete action.payload.redirectToHome;
      delete action.payload.smallLoader;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON });
      else store.dispatch({ type: SPINNER_ON });
      api.property.addProperty(action.payload, token)
        .then((res) => {
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
          if (getEstimation) {
            store.dispatch({ type: GET_ESTIMATION, payload: res.data.id });
          } else if (redirectToRewards) {
            window.location.href = `/packageFlow/${action.payload}/rewards`;
          } else if (redirectToHome) {
            window.location.href = `/${res.data.id}/home`;
          }
          if (redirectToUserFlow) {
            window.location.href = '/onBoarding/brixelComingInTown';
          } else {
            if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
            else store.dispatch({ type: SPINNER_OFF });
          }

        })
        .catch(() => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
        });
      break;
    case SAVE_ACTIVE_SINGLE_PROPERTY: {
      next(action);
      const { id, redirectTo, redirectToHome, smallLoader, setSuccessNotification } = action.payload;
      delete action.payload.id;
      delete action.payload.redirectTo;
      delete action.payload.smallLoader;
      delete action.payload.redirectToHome;
      delete action.payload.setSuccessNotification;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON });
      else store.dispatch({ type: SPINNER_ON });
      api.property.updateProperty(id, action.payload)
        .then((res) => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
          if (redirectTo) {
            store.dispatch({ type: REDIRECT_TO, payload: { history: redirectTo } });
          }
          if (setSuccessNotification) {
            const notification = ({
              state: true,
              type: 'success',
              label: 'Changes saved',
            });
            store.dispatch({ type: SET_SCREEN_NOTIFICATION, payload: notification })
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

    case GET_ACTIVE_SINGLE_PROPERTY:
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const fullVersion = get(action, 'payload.fullVersion', true);
      const apiEndPoint = (data) => fullVersion ? api.property.getProperty(data) : api.property.getPropertySimplified(data);
      apiEndPoint(action.payload.id)
        .then((res) => {
          store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data });
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_OFF });
          if (window.location.href.includes('localhost')) {
            store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: page });
          }
          // window.location.href = `/`;
        });
      break;
    case GET_PROPERTY_LISTINGS:
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const { setAsSingle } = action.payload;
      delete action.payload.setAsSingle;
      api.property.getProperties(action.payload.limit, action.payload.offset)
        .then((res) => {
          if (setAsSingle) {
            store.dispatch({ type: SET_ACTIVE_SINGLE_PROPERTY, payload: res.data[0] });
          } else {
            store.dispatch({ type: SET_PROPERTY_LISTINGS, payload: res.data });
          }
          store.dispatch({ type: SPINNER_OFF });
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
          .catch((res) => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getLivingSpaceDistribution(urlSpace)
          .then((res) => {
            marketData.livingSpacesDistribution = res.data;
          })
          .catch((res) => {
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
          .catch((res) => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getMarketDays(urlSpace)
          .then((res) => {
            marketData.daysOnMarketDistribution = res.data;
          })
          .catch((res) => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getContructionYears(urlSpace)
          .then((res) => {
            marketData.constructionYearDistribution = res.data;
          })
          .catch((res) => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getMerged(urlSpace)
          .then((res) => {
            marketData.list = res.data;
          })
          .catch((res) => {
            store.dispatch({ type: SPINNER_OFF });
          });
        await api.property.getMergedBySubtype(urlSpace)
          .then((res) => {
            marketData.countBySubType = res.data;
          })
          .catch((res) => {
            store.dispatch({ type: SPINNER_OFF });
          });
        store.dispatch({ type: SET_MARKET_CHECK, payload: marketData });
        store.dispatch({ type: SPINNER_OFF });
      };
      getMarketData();
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
