import ep from '../../endPoints.constant';
import Base from '../config/Base';

class Market extends Base {
  getAllProperties(paginationLimit, paginationSkip, data) {
    const url = ep.market.allProperties(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  getLastViewed() {
    const url = ep.market.lastViewed();
    return this.apiClient.get(url, {});
  }

  getNewInRadar(paginationLimit, paginationSkip, data) {
    const url = ep.market.newInRadar(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  getOwnedEstimations(paginationLimit, paginationSkip, data) {
    const url = ep.market.ownedEstimations(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  getOwnedProperties(paginationLimit, paginationSkip, data) {
    const url = ep.market.ownedProperties(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  getPreMarketProperties(paginationLimit, paginationSkip, data) {
    const url = ep.market.preMarket(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  getPremiumProperties(paginationLimit, paginationSkip, data) {
    const url = ep.market.premium(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  getFavoriteProperties(paginationLimit, paginationSkip, data) {
    const url = ep.market.favorites(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  getDeals(paginationLimit, paginationSkip, data) {
    const url = ep.market.deal(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  preMarketStats(query) {
    const url = ep.market.preMarketStats(query);
    return this.apiClient.get(url);
  }

  getWishlists(paginationLimit, paginationSkip, data) {
    const url = ep.market.wishlists(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  getBuyerProperties(paginationLimit, paginationSkip, data) {
    const url = ep.market.buyer(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }
}

export default Market;
