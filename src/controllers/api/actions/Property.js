import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Property extends Base {
  addProperty(data, token) {
    const url = ep.property.addPage();
    return this.apiClient.post(url, {token}, data);
  }

  getProperties(limit, offset) {
    const url = ep.property.page(limit, offset);
    return this.apiClient.get(url, {});
  }

  getEstimation(id) {
    const url = ep.property.estimation(id);
    return this.apiClient.put(url, {});
  }
}

export default Property;
