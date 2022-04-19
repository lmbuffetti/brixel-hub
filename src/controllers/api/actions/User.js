import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Property extends Base {
  validateToken(token) {
    const url = ep.user.tokenValidationWithUser();
    return this.apiClient.get(url, { token });
  }

  getToken(data, remeberMe) {
    const url = ep.user.getToken();
    return this.apiClient.get(url, { type: 'login' }, remeberMe, {}, data);
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
    const url = ep.user.userById(id);
    return this.apiClient.put(url, {}, data);
  }

  addFavorite(id, data) {
    const url = ep.user.addFavorite(id);
    return this.apiClient.put(url, {}, data);
  }

  addAsNotInterested(pageId) {
    const url = ep.user.addAsNotInterested(pageId);
    return this.apiClient.put(url, {});
  }

  removeAsNotInterested(pageId) {
    const url = ep.user.removeAsNotInterested(pageId);
    return this.apiClient.put(url, {});
  }

  removeFavorite(id, data) {
    const url = ep.user.removeFavorite(id);
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

  getPropertiesOfUser(id, limit) {
    const url = ep.user.getPropertiesOfUser(id, limit);
    return this.apiClient.get(url, {});
  }

  validateUser(email) {
    const url = ep.user.validateUser(email);
    return this.apiClient.get(url, {});
  }

  getLeadsByUser(id) {
    const url = ep.user.leadsByUser(id);
    return this.apiClient.get(url, {});
  }

  getUserByEmail(email) {
    const url = ep.user.getUserByEmail(email);
    return this.apiClient.get(url, {});
  }

  userScanTrial(data) {
    const url = ep.user.scanTrial();
    return this.apiClient.post(url, {}, data);
  }
}

export default Property;
