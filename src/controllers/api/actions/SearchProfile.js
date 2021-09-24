import Base from '../config/Base';

import ep from '../../endPoints.constant';

class SearchProfile extends Base {
  searchProfileByUserID(id) {
    const url = ep.searchProfile.searchProfileByUserID(id);
    return this.apiClient.get(url);
  }

  createSearchProfile(data, token) {
    const url = ep.searchProfile.singleSearchProfile();
    return this.apiClient.post(url, { token }, data);
  }

  updateSearchProfile(data, id) {
    const url = ep.searchProfile.singleSearchProfileById(id);
    return this.apiClient.put(url, { }, data);
  }
}

export default SearchProfile;
