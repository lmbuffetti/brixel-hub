import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Portals extends Base {
  getPortalsUrls(pageID) {
    const url = ep.portals.getPortalsUrls(pageID);
    return this.apiClient.get(url);
  }

  getPortals(pageID) {
    const url = ep.portals.getPortals(pageID);
    return this.apiClient.get(url);
  }

  setPortalUrl(pageID, portalName, data) {
    const url = ep.portals.portalUrl(pageID, portalName);
    return this.apiClient.put(url, {}, data);
  }

  deletePortalUrl(pageID, portalName) {
    const url = ep.portals.portalUrl(pageID, portalName);
    return this.apiClient.delete(url);
  }

  setPortalExport(pageID, portalName, data) {
    const url = ep.portals.portalExport(pageID, portalName);
    return this.apiClient.put(url, {}, data);
  }
}

export default Portals;
