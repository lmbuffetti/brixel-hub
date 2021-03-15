import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Deal extends Base {
  getUserDealLists(id) {
    const url = ep.deal.dealByUserID(id);
    return this.apiClient.get(url, { }, { });
  }

  updateSingleDeal(id, data) {
    const url = ep.deal.singleDeal(id);
    return this.apiClient.put(url, {}, data);
  }

  getSingleDeal(id) {
    const url = ep.deal.singleDeal(id);
    return this.apiClient.get(url, {});
  }

  deleteSingleDeal(id) {
    const url = ep.deal.singleDeal(id);
    return this.apiClient.delete(url, {});
  }

  createSingleDeal(data) {
    const url = ep.deal.createSingleDeal();
    return this.apiClient.post(url, {}, data);
  }

  getDealsList(paginationLimit, paginationSkip, data) {
    const url = ep.deal.getListOfDeals(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  updateMultipleDeals(data) {
    const url = ep.deal.updateMultipleDeals();
    return this.apiClient.put(url, {}, data);
  }

  makeOffer(id) {
    const url = ep.deal.makeOffer(id);
    return this.apiClient.post(url, {}, data);
  }

  reviewOffer(id) {
    const url = ep.deal.reviewOffer(id);
    return this.apiClient.post(url, {}, data);
  }

  getBuyerDeal(id) {
    const url = ep.deal.buyerDeal(id);
    return this.apiClient.get(url);
  }
}

export default Deal;
