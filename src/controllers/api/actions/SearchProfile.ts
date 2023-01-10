import ep from '../../endPoints.constant';
import Base from '../config/Base';

class SearchProfile extends Base {
  private apiClient: any;
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

  deleteSearchProfile(id) {
    const url = ep.searchProfile.singleSearchProfileById(id);
    return this.apiClient.delete(url, { }, {});
  }
}

export default SearchProfile;
