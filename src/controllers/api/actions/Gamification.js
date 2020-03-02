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

  getGameHistory(limit, offset, userID) {
    const url = ep.gamification.gameHistoryList(limit, offset, userID);
    return this.apiClient.get(url, { }, { });
  }

  getGameHistoryByUser(userID) {
    const url = ep.gamification.gameHistoryByUserId(userID);
    return this.apiClient.get(url, { }, { });
  }

  addGameHistory(id, data) {
    const url = ep.gamification.gameHistoryByUser(id);
    return this.apiClient.post(url, {}, data);
  }

}

export default Gamification;
