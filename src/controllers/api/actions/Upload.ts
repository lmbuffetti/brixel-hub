import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Upload extends Base {
  private apiClient: any;
  rotateImg(id, angle) {
    const url = ep.upload.rotate(id, angle);
    return this.apiClient.put(url);
  }

  addImage(data, onUploading) {
    const url = ep.upload.addImage();
    return this.apiClient.post(url, { action: onUploading }, data);
  }

  getImageType() {
    const url = ep.upload.imageType();
    return this.apiClient.get(url);
  }

  deleteImg(id) {
    const url = ep.upload.singleImage(id);
    return this.apiClient.delete(url);
  }

  uploadDocument(data, onUploading, id) {
    const url = ep.upload.document();
    return this.apiClient.post(url, { action: onUploading, id }, data);
  }

  deleteDocument(id) {
    const url = ep.upload.singleDocument(id);
    return this.apiClient.delete(url);
  }

  updateDocument(id, data, onUploading) {
    const url = ep.upload.singleDocument(id);
    return this.apiClient.put(url, { action: onUploading }, data);
  }
}

export default Upload;
