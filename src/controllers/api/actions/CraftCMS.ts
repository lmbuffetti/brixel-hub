import Base from '../config/Base';

class CraftCMS extends Base {
  private apiClient: any;
  getHubContent(data) {
    return this.apiClient.post('', data);
  }
}

export default CraftCMS;
