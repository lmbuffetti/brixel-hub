import Base from '../config/Base';

class CraftCMS extends Base {
  getHubContent(data) {
    return this.apiClient.post('', data);
  }
}

export default CraftCMS;
