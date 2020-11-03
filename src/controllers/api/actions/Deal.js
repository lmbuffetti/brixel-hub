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
}

export default Deal;
