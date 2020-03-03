import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Upload extends Base {
  rotateImg(id, angle) {
    const url = ep.upload.rotate(id, angle);
    return this.apiClient.put(url);
  }

  addImage(data) {
    const url = ep.upload.addImage();
    return this.apiClient.post(url, {}, data);
  }

  getImageType() {
    const url = ep.upload.imageType();
    return this.apiClient.get(url);
  }

  deleteImg(id) {
    const url = ep.upload.singleImage(id);
    return this.apiClient.delete(url);
  }

  uploadDocument(data) {
    const url = ep.upload.document();
    return this.apiClient.post(url, {}, data);
  }

  deleteDocument(id) {
    const url = ep.upload.singleDocument(id);
    return this.apiClient.delete(url);
  }

  updateDocument(id, data) {
    const url = ep.upload.singleDocument(id);
    return this.apiClient.put(url, {}, data);
  }
}

export default Upload;
