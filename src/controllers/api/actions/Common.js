import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Common extends Base {
  sendSlackNotification(data, channel) {
    const url = ep.common.sendSlackNotification(channel);
    return this.apiClient.post(url, {}, data);
  }

  sendMessage(data) {
    const url = ep.common.sendMessage();
    return this.apiClient.post(url, { }, data);
  }

  sendSupportMessage(data) {
    const url = ep.common.sendSupportMessage();
    return this.apiClient.post(url, { }, data);
  }
}

export default Common;
