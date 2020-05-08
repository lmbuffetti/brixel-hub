import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Company extends Base {
  getCompanyByStub(stub) {
    const url = ep.company.getCompanyByStub(stub);
    return this.apiClient.get(url, { });
  }

  getCompanyById(stub) {
    const url = ep.company.getCompanyById(stub);
    return this.apiClient.get(url, { });
  }
}

export default Company;
