import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Property extends Base {
  addProperty(data) {
    const url = ep.property.addPage();
    return this.apiClient.post(url, {}, data);
  }

  getEstimation(id) {
    const url = ep.property.estimation(id);
    return this.apiClient.put(url, {});
  }
}

export default Property;
