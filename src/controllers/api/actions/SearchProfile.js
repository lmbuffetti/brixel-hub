import Base from '../config/Base';

import ep from '../../endPoints.constant';

class SearchProfile extends Base {
  searchProfileByUserID(id) {
    const url = ep.searchProfile.searchProfileByUserID(id);
    return this.apiClient.get(url);
  }

  updateSearchProfile(data) {
    const url = ep.searchProfile.singleSearchProfile();
    return this.apiClient.post(url, {}, data);
  }
}

export default SearchProfile;
