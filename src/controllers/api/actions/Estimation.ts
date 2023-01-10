import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Estimation extends Base {
  private apiClient: any;
  generateEstimation(id, token) {
    const url = ep.estimation.generateEstimation(id);
    return this.apiClient.post(url, { token });
  }

  getEstimationList(paginationLimit, paginationSkip, ownerId, data) {
    const url = ep.estimation.getEstimationsList(paginationLimit, paginationSkip, ownerId, data);
    return this.apiClient.get(url);
  }

  createEstimation(data, token) {
    const url = ep.estimation.createEstimation();
    return this.apiClient.post(url, { token }, data);
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

  proEstimationNotification(id) {
    const url = ep.estimation.proEstimationNotification(id);
    return this.apiClient.post(url, {}, {});
  }

  getEstimationsList(paginationLimit, paginationSkip, ownerId, data) {
    const url = ep.estimation.getEstimationsList(paginationLimit, paginationSkip, ownerId, data);
    return this.apiClient.get(url);
  }
}

export default Estimation;
