import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Property extends Base {
  validateToken(token) {
    const url = ep.user.tokenValidationWithUser();
    return this.apiClient.get(url, { token });
  }

  getToken(data, remeberMe) {
    const url = ep.user.getToken();
    return this.apiClient.get(url, {type: 'login'}, remeberMe, {}, data);
  }

  recoverPassword(email) {
    const url = ep.user.recoverPassword(email);
    return this.apiClient.put(url, {}, {});
  }

  createUser(data) {
    const url = ep.user.createUser();
    return this.apiClient.post(url, {}, data);
  }

  updateUser(id, data) {
    const url = ep.user.updateUser(id);
    return this.apiClient.put(url, {}, data);
  }

  getFavoritesPages() {
    const url = ep.user.favoritePages();
    return this.apiClient.get(url, {});
  }

  getPublicUser(id) {
    const url = ep.user.getPublicUser(id);
    return this.apiClient.get(url, {});
  }

  getDocuments(id, data) {
    const url = ep.user.getDocuments(id);
    return this.apiClient.put(url, {}, data);
  }

  getPropertiesOfUser(id) {
    const url = ep.user.getPropertiesOfUser(id);
    return this.apiClient.get(url, {});
  }

  validateUser(email) {
    const url = ep.user.validateUser(email);
    return this.apiClient.get(url, {});
  }
}

export default Property;
