import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Gamification extends Base {
  getGroupList(limit, offset) {
    const url = ep.gamification.groupList(limit, offset);
    return this.apiClient.get(url, { }, { });
  }

  getGameAchievementList(limit, offset) {
    const url = ep.gamification.gameAchievementList(limit, offset);
    return this.apiClient.get(url, { }, { });
  }

  getGameHistory(limit, offset) {
    const url = ep.gamification.gameHistoryList(limit, offset);
    return this.apiClient.get(url, { }, { });
  }

  addGameHistory(id, data) {
    const url = ep.gamification.gameHistoryList(id);
    return this.apiClient.post(url, {}, data);
  }

}

export default Gamification;
