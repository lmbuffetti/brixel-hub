import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Estimation extends Base {
  generateEstimation(id) {
    const url = ep.estimation.generateEstimation(id);
    return this.apiClient.put(url, {});
  }

  getEstimationList(paginationLimit, paginationSkip, data) {
    const url = ep.estimation.getEstimationList(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  createEstimation(data) {
    const url = ep.estimation.createEstimation();
    return this.apiClient.post(url, {}, data);
  }

  deleteEstimation(id) {
    const url = ep.estimation.estimationById(id);
    return this.apiClient.delete(url, {});
  }

  getEstimation(id) {
    const url = ep.estimation.estimationById(id);
    return this.apiClient.get(url, {});
  }

  saveEstimation(id, data) {
    const url = ep.estimation.estimationById(id);
    return this.apiClient.put(url, {}, data);
  }
}

export default Estimation;
