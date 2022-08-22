import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Deal extends Base {
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

  makeOffer(id, data) {
    const url = ep.deal.makeOffer(id);
    return this.apiClient.post(url, {}, data);
  }

  reviewOffer(id, data) {
    const url = ep.deal.reviewOffer(id);
    return this.apiClient.post(url, {}, data);
  }

  getBuyerDeal(id) {
    const url = ep.deal.buyerDeal(id);
    return this.apiClient.get(url);
  }

  getOfferListings(id) {
    const url = ep.deal.offerListings(id);
    return this.apiClient.get(url);
  }

  sendVisitFeedback(id, sendSlack, data) {
    const url = ep.deal.visitFeedback(id, sendSlack);
    return this.apiClient.put(url, {}, data);
  }

  closingIdentification(id, personType, data) {
    const url = ep.deal.closingIdentification(id, personType);
    return this.apiClient.post(url, {}, data);
  }
  
  saveFinanceCertificate(data) {
    const url = ep.financing.financialCertificate();
    return this.apiClient.post(url, {}, data);
  }
}

export default Deal;
