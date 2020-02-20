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
}

export default Gamification;
