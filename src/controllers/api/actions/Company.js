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

  getDefaultCompany() {
    const url = ep.company.getDefaultCompany();
    return this.apiClient.get(url, { });
  }

  getCompanyListing(data) {
    const url = ep.company.companyList(data);
    return this.apiClient.get(url, { });
  }

  getPackagesCompany(data) {
    const url = ep.company.getPackagesCompany(data);
    return this.apiClient.get(url, { });
  }
}

export default Company;
