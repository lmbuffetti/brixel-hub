import Base from '../config/Base';

import ep from '../../endPoints.constant';

class History extends Base {
  getSingleHistory(id) {
    const url = ep.history.historyById(id);
    return this.apiClient.get(url, {});
  }

  deleteSingleHistory(id) {
    const url = ep.history.historyById(id);
    return this.apiClient.delete(url, {});
  }

  getHistoryList(paginationLimit, paginationSkip, data) {
    const url = ep.history.getHistoryListOfParent(paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  createHistory(data) {
    const url = ep.history.createHistory();
    return this.apiClient.post(url, {}, data);
  }
}

export default History;
