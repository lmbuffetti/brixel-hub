import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Common extends Base {
  sendMessage(data) {
    const url = ep.common.sendMessage();
    return this.apiClient.post(url, { }, data);
  }

  sendGenericMessage(data) {
    const url = ep.common.sendGenericMessage();
    return this.apiClient.post(url, {}, data);
  }

  sendScheduleVisit(data) {
    const url = ep.common.sendScheduleVisit();
    return this.apiClient.post(url, {}, data);
  }

  sendSlackNotification(data, channel) {
    const url = ep.common.sendSlackNotification(channel);
    return this.apiClient.post(url, {}, data);
  }
}

export default Common;
