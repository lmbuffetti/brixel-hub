import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Property extends Base {
  addProperty(data, token) {
    const url = ep.property.addPage();
    return this.apiClient.post(url, { token }, data);
  }

  updateProperty(id, data) {
    const url = ep.property.pageById(id);
    return this.apiClient.put(url, {}, data);
  }

  getProperty(id) {
    const url = ep.property.pageById(id);
    return this.apiClient.get(url, {});
  }

  deleteProperty(id) {
    const url = ep.property.pageById(id);
    return this.apiClient.delete(url, {});
  }

  getPropertySimplified(id) {
    const url = ep.property.mapPageById(id);
    return this.apiClient.get(url, {});
  }

  getProperties(limit, offset) {
    const url = ep.property.page(limit, offset);
    return this.apiClient.get(url, {});
  }

  getEstimation(id) {
    const url = ep.property.estimation(id);
    return this.apiClient.put(url, {});
  }

  // Endpoints for time slots available in order to book a visit to a property
  getPropertyScheduleListings(id) {
    const url = ep.property.getPropertyScheduleListings(id);
    return this.apiClient.get(url);
  }

  createPropertyVisitSchedule(data) {
    const url = ep.property.createPropertyVisitSchedule();
    return this.apiClient.post(url, {}, data);
  }

  deletePropertyVisitSchedule(id) {
    const url = ep.property.propertyVisitScheduleById(id);
    return this.apiClient.delete(url, {});
  }

  getPropertyVisitSchedule(id) {
    const url = ep.property.propertyVisitScheduleById(id);
    return this.apiClient.get(url, {});
  }

  updatePropertyVisitSchedule(id, data) {
    const url = ep.property.propertyVisitScheduleById(id);
    return this.apiClient.put(url, {}, data);
  }

  // Endpoints for property visits requested by users
  getPropertyVisitListings() {
    const url = ep.property.getPropertyVisitListings();
    return this.apiClient.get(url);
  }

  createPropertyVisit(data) {
    const url = ep.property.createPropertyVisit();
    return this.apiClient.post(url, {}, data);
  }

  deletePropertyVisit(id) {
    const url = ep.property.propertyVisitById(id);
    return this.apiClient.delete(url, {});
  }

  getPropertyVisit(id) {
    const url = ep.property.propertyVisitById(id);
    return this.apiClient.get(url, {});
  }

  updatePropertyVisit(id, data) {
    const url = ep.property.propertyVisitById(id);
    return this.apiClient.put(url, {}, data);
  }

  getPageVisits(id) {
    const url = ep.property.getPageVisits(id);
    return this.apiClient.get(url, {});
  }

  changePublishReview(id, status) {
    const url = ep.property.publishReview(id, status);
    return this.apiClient.put(url, {}, {});
  }

  changePortalsReview(id, status) {
    const url = ep.property.portalsReview(id, status);
    return this.apiClient.put(url, {}, {});
  }

  // PACAKGE - UPGRADE
  getPackageList(limit, offset) {
    const url = ep.property.packagesList(limit, offset);
    return this.apiClient.get(url, {});
  }

  saveUpgradePlan(id, data) {
    const url = ep.property.upgradePlan(id);
    return this.apiClient.put(url, {}, data);
  }

  // BRIXELATOR
  getPriceDistribution(data) {
    const url = ep.brixelator.getPriceDistribution(data);
    return this.apiClient.get(url, { baseUrlType: 'brixelator' });
  }

  getLivingSpaceDistribution(data) {
    const url = ep.brixelator.getLivingSpaceDistribution(data);
    return this.apiClient.get(url, { baseUrlType: 'brixelator' });
  }

  getMerged(data) {
    const url = ep.brixelator.getMerged(data);
    return this.apiClient.get(url, { baseUrlType: 'brixelator' });
  }

  getPricePerSpace(data) {
    const url = ep.brixelator.getPricePerSpace(data);
    return this.apiClient.get(url, { baseUrlType: 'brixelator' });
  }

  getMarketDays(data) {
    const url = ep.brixelator.getMarketDays(data);
    return this.apiClient.get(url, { baseUrlType: 'brixelator' });
  }

  getContructionYears(data) {
    const url = ep.brixelator.getContructionYears(data);
    return this.apiClient.get(url, { baseUrlType: 'brixelator' });
  }

  getMergedBySubtype(data) {
    const url = ep.brixelator.getMergedBySubtype(data);
    return this.apiClient.get(url, { baseUrlType: 'brixelator' });
  }

  getMaketAggregate(data) {
    const url = ep.brixelator.getMaketAggregate(data);
    return this.apiClient.get(url, { baseUrlType: 'brixelator' });
  }
}

export default Property;
