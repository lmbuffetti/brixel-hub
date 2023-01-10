import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Lead extends Base {
  private apiClient: any;
  getLeadList(leadType, paginationLimit, paginationSkip, data) {
    const url = ep.lead.getLeadList(leadType, paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }

  createUserLead(data) {
    const url = ep.lead.singleUserLead();
    return this.apiClient.post(url, {}, data);
  }
}

export default Lead;
