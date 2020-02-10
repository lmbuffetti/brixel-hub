import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Property extends Base {
  addProperty(data, token) {
    const url = ep.property.addPage();
    return this.apiClient.post(url, {token}, data);
  }

  updateProperty(id, data) {
    const url = ep.property.pageById(id);
    return this.apiClient.put(url, {}, data);
  }

  getProperty(id) {
    const url = ep.property.pageById(id);
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

  // BRIXELATOR
  getPriceDistribution(data) {
    const url = ep.brixeletor.getPriceDistribution(data);
    return this.apiClient.get(url, {baseUrlType: 'brixelator'});
  }
  getLivingSpaceDistribution(data) {
    const url = ep.brixeletor.getLivingSpaceDistribution(data);
    return this.apiClient.get(url, {baseUrlType: 'brixelator'});
  }
  getMerged(data) {
    const url = ep.brixeletor.getMerged(data);
    return this.apiClient.get(url, {baseUrlType: 'brixelator'});
  }
  getPricePerSpace(data) {
    const url = ep.brixeletor.getPricePerSpace(data);
    return this.apiClient.get(url, {baseUrlType: 'brixelator'});
  }
  getMarketDays(data) {
    const url = ep.brixeletor.getMarketDays(data);
    return this.apiClient.get(url, {baseUrlType: 'brixelator'});
  }
  getContructionYears(data) {
    const url = ep.brixeletor.getContructionYears(data);
    return this.apiClient.get(url, {baseUrlType: 'brixelator'});
  }
  getMergedBySubtype(data) {
    const url = ep.brixeletor.getMergedBySubtype(data);
    return this.apiClient.get(url, {baseUrlType: 'brixelator'});
  }
  getMaketAggregate(data) {
    const url = ep.brixeletor.getMaketAggregate(data);
    return this.apiClient.get(url, {baseUrlType: 'brixelator'});
  }
}

export default Property;
