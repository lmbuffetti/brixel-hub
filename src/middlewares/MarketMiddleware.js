import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';

import { SKELETON_OFF, SKELETON_ON } from '../actions/types/CommonTypes';
import {
  GET_ALL_PROPERTIES,
  GET_BUYER_PROPERTIES,
  GET_FAVORITES_PROPERTIES,
  GET_LAST_VIEWED_PROPERTIES,
  GET_NEW_PROPERTIES,
  GET_OWNED_ESTIMATIONS,
  GET_OWNED_PROPERTIES,
  GET_PREMARKET_PROPERTIES,
  GET_PREMARKET_STATS,
  GET_PREMIUM_PROPERTIES,
  GET_WISHLIST_PROPERTIES,
  SET_ALL_PROPERTIES,
  SET_BUYER_PROPERTIES,
  SET_FAVORITES_PROPERTIES,
  SET_NEW_PROPERTIES,
  SET_OWNED_ESTIMATIONS,
  SET_OWNED_PROPERTIES,
  SET_PREMARKET_PROPERTIES,
  SET_PREMARKET_STATS,
  SET_PREMIUM_EUROPE_PROPERTIES,
  SET_PREMIUM_PROPERTIES,
  SET_WISHLIST_PROPERTIES,
} from '../actions/types/MarketTypes';

import { SET_ACTIVE_MARKET_OVERLAY_PROPERTY_LISTS } from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';

const checkLead = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_OWNED_PROPERTIES: {
      next(action);
      store.dispatch({ type: SKELETON_ON, payload: { own: 'CardImageText' } });
      const queryParams = `?order=${action.payload.order}&direction=${action.payload.direction}`;
      api.market.getOwnedProperties(action.payload.resultsPerPage, action.payload.offset, queryParams)
        .then((res) => {
          if (res.meta.status === 200) {
            const calls = [];
            // Means it is the category list page, we need to get the bestimate
            if (action.payload.resultsPerPage === 10) {
              res.data.data.forEach((prop) => {
                if (prop.properties.propertyType === 'Apartment' || prop.properties.propertyType === 'House') calls.push(api.property.getEstimation(prop.id));
              });
              Promise.all(calls).then((response) => {
                response.forEach((resEst, key) => {
                  if (resEst.meta.normalizedStatus === 400) set(res.data.data[key], 'estimation', {});
                  if (resEst.meta.normalizedStatus === 200) set(res.data.data[key], 'estimation', resEst.data);
                });
                store.dispatch({ type: SET_OWNED_PROPERTIES, payload: res.data });
              });
            } else store.dispatch({ type: SET_OWNED_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SKELETON_OFF, payload: { own: false } });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF, payload: { own: false } });
        });
      break;
    }
    case GET_FAVORITES_PROPERTIES: {
      next(action);
      store.dispatch({ type: SKELETON_ON, payload: { favorite: 'CardImageTextVertical' } });
      const queryParams = `?order=${action.payload.order}&direction=${action.payload.direction}`;
      api.market.getFavoriteProperties(action.payload.resultsPerPage, action.payload.offset, queryParams)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_FAVORITES_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SKELETON_OFF, payload: { favorite: false } });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF, payload: { favorite: false } });
        });
      break;
    }
    case GET_ALL_PROPERTIES: {
      next(action);
      store.dispatch({ type: SKELETON_ON, payload: { allProperties: 'CardImageTextVertical' } });
      let queryParams = `?order=${action.payload.order}&direction=${action.payload.direction}`;
      if (action.payload.searchProfileId) queryParams = `?searchprofileid=${action.payload.searchProfileId}&order=${action.payload.order}&direction=${action.payload.direction}`;
      api.market.getAllProperties(action.payload.resultsPerPage, action.payload.offset, queryParams)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_ALL_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SKELETON_OFF, payload: { allProperties: false } });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF, payload: { allProperties: false } });
        });
      break;
    }
    case GET_NEW_PROPERTIES: {
      next(action);
      const { overlayCard } = action.payload;
      store.dispatch({ type: SKELETON_ON, payload: { favorite: 'CardImageTextVertical' } });
      let queryParams = `?order=${action.payload.order}&direction=${action.payload.direction}`;
      if (action.payload.searchProfileId) queryParams = `?searchprofileid=${action.payload.searchProfileId}&order=${action.payload.order}&direction=${action.payload.direction}`;
      api.market.getNewInRadar(action.payload.resultsPerPage, action.payload.offset, queryParams)
        .then((res) => {
          if (res.meta.status === 200 && !overlayCard) {
            store.dispatch({ type: SET_NEW_PROPERTIES, payload: res.data });
          }
          if (res.meta.status === 200 && overlayCard) {
            const propertyList = get(store.getState(), 'market.newProperties.data', []);
            propertyList.push(...res.data.data);
            store.dispatch({ type: SET_ACTIVE_MARKET_OVERLAY_PROPERTY_LISTS, payload: propertyList });
          }
          store.dispatch({ type: SKELETON_OFF, payload: { favorite: false } });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF, payload: { favorite: false } });
        });
      break;
    }
    case GET_OWNED_ESTIMATIONS: {
      next(action);
      const {
        direction,
        offset,
        isBuyer,
        order,
        ownerId,
        resultsPerPage,
      } = action.payload;
      store.dispatch({ type: SKELETON_OFF, payload: { estimation: 'CardImageTextVertical' } });
      let queryParams = `&order=${order}&direction=${direction}`;
      if (isBuyer) queryParams += '&buyerOnly=true';
      api.estimation.getEstimationsList(resultsPerPage, offset, ownerId, queryParams)
        .then((res) => {
          if (res.meta.status === 200) {
            const redData = (res.data.data).filter((item) => get(item, 'data.title', null) !== null);
            const redExcludedData = (res.data.data).filter((item) => get(item, 'data.title', null) === null);
            const countData = res.data;
            countData.total -= redExcludedData.length;
            store.dispatch({ type: SET_OWNED_ESTIMATIONS, payload: { ...countData, data: redData } });
          }
          store.dispatch({ type: SKELETON_OFF, payload: { estimation: false } });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF, payload: { estimation: false } });
        });
      break;
    }
    case GET_LAST_VIEWED_PROPERTIES: {
      next(action);
      const loadSkeleton = cloneDeep(get(store.getState(), 'common.skeleton', {}));
      loadSkeleton.favorite = 'CardImageTextVertical';
      /*
      store.dispatch({
        type: SKELETON_ON,
        payload: {
          ...loadSkeleton,
        },
      });
      api.market.getLastViewed()
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_LAST_VIEWED_PROPERTIES, payload: res.data });
          }
          loadSkeleton = cloneDeep(get(store.getState(), 'common.skeleton', {}));
          loadSkeleton.favorite = false;
          store.dispatch({ type: SKELETON_OFF, payload: loadSkeleton });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF });
        });
       */
      break;
    }
    case GET_PREMARKET_PROPERTIES: {
      next(action);
      const {
        direction,
        offset,
        order,
        resultsPerPage,
        searchProfileId,
      } = action.payload;
      store.dispatch({ type: SKELETON_ON, payload: { favorite: 'CardImageTextVertical' } });
      let queryParams = `?order=${order}&direction=${direction}`;
      if (searchProfileId) queryParams = `?searchprofileid=${searchProfileId}&order=${order}&direction=${direction}`;
      api.market.getPreMarketProperties(resultsPerPage, offset, queryParams)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_PREMARKET_PROPERTIES, payload: res.data });
            const propertyList = cloneDeep(get(store.getState(), 'property.activeMarketOverlayPropertyLists', [])) || [];
            res.data.data.forEach((property) => {
              const checkProp = propertyList.findIndex((prop) => prop.id === property.id);
              if (checkProp === -1) propertyList.push(property);
            });
            store.dispatch({ type: SET_ACTIVE_MARKET_OVERLAY_PROPERTY_LISTS, payload: propertyList });
          }
          store.dispatch({ type: SKELETON_OFF, payload: { favorite: false } });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF, payload: { favorite: false } });
        });
      break;
    }
    case GET_PREMIUM_PROPERTIES: {
      next(action);
      const {
        allCountry,
        direction,
        offset,
        order,
        resultsPerPage,
        resultType,
        searchProfileId,
      } = action.payload;
      store.dispatch({ type: SKELETON_ON, payload: { favorite: 'CardImageTextVertical' } });
      let queryParams = `?order=${order}&direction=${direction}`;
      if (searchProfileId) queryParams = `?searchprofileid=${searchProfileId}&order=${order}&direction=${direction}`;
      if (allCountry) queryParams += '&allCountry=true';
      if (resultType) queryParams += `&resultType=${resultType}`;
      api.market.getPremiumProperties(resultsPerPage, offset, queryParams)
        .then((res) => {
          if (res.meta.status === 200) {
            if (resultType === 'europe') store.dispatch({ type: SET_PREMIUM_EUROPE_PROPERTIES, payload: res.data });
            else store.dispatch({ type: SET_PREMIUM_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SKELETON_OFF, payload: { favorite: false } });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF, payload: { favorite: false } });
        });
      break;
    }
    case GET_WISHLIST_PROPERTIES: {
      next(action);
      store.dispatch({ type: SKELETON_ON, payload: { wishlist: 'CardImageTextVertical' } });
      const queryParams = `?order=${action.payload.order || 'updatedAt'}&direction=${action.payload.direction || 'DESC'}`;
      api.market.getWishlists(action.payload.resultsPerPage || 50, action.payload.offset || 0, queryParams)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_WISHLIST_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SKELETON_OFF, payload: { wishlist: false } });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF, payload: { wishlist: false } });
        });
      break;
    }
    case GET_PREMARKET_STATS: {
      next(action);
      const {
        id,
      } = action.payload;
      let query = '';
      if (id) query = `?searchprofileid=${id}`;
      api.market.preMarketStats(query)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_PREMARKET_STATS, payload: res.data });
          }
        })
      break;
    }
    case GET_BUYER_PROPERTIES: {
      const {
        limit,
        offset,
        order,
        direction,
        searchProfileId,
        type, // all|published|premarket
      } = action.payload;
      store.dispatch({ type: SKELETON_ON, payload: { buyerProperties: 'CardImageTextVertical' } });
      let query = `?type=${type}&order=${order}&direction=${direction}`;
      if (searchProfileId) query += `&searchprofileid=${searchProfileId}`;
      api.market.getBuyerProperties(limit, offset, query)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_BUYER_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SKELETON_OFF, payload: { buyerProperties: false } });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF, payload: { buyerProperties: false } });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkLead;
