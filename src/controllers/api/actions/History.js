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

  getHistoryList(paginationLimit, paginationSkip, query, data) {
    const url = ep.history.getHistoryListOfParent(paginationLimit, paginationSkip, query);
    return this.apiClient.put(url, {}, data);
  }

  createHistory(data) {
    const url = ep.history.createHistory();
    return this.apiClient.post(url, {}, data);
  }

  historyFeed(id, paginationLimit, paginationSkip, query, data) {
    const url = ep.history.historyFeed(id, paginationLimit, paginationSkip, query);
    return this.apiClient.post(url, {}, data);
  }
}

export default History;
