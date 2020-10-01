import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Deal extends Base {
  getUserDealLists(id) {
    const url = ep.deal.dealByUserID(id);
    return this.apiClient.get(url, { }, { });
  }
}

export default Deal;
