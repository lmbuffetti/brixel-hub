import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Upload extends Base {
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

  orderPageDocuments(id, data) {
    const url = ep.upload.reorderDocument(id);
    return this.apiClient.put(url, {}, data);
  }

  updatePageDocument(id, data) {
    const url = ep.upload.updatePageDocument(id);
    return this.apiClient.patch(url, {}, data);
  }

  deletePageDocument(id, docID) {
    const url = ep.upload.deletePageDocument(id, docID);
    return this.apiClient.delete(url, {
      id,
    });
  }

  getPrivateDocument(id) {
    const url = ep.upload.singlePrivateDocument(id);
    return this.apiClient.get(url, {baseUrlType: 'self', responseType: 'blob'}, {}, {'Content-Type': 'application/octet-stream'});
  }



  updateImageDescription(pageID: string, imgID: string, type: 'image' | 'floorPlan', data: object) {
    const url = ep.upload.updateDescription(pageID, type, imgID);
    return this.apiClient.put(url, {}, data);
  }

  orderPageImages(pageID, type: 'image' | 'floorPlan', data) {
    const url = ep.upload.orderImages(pageID, type);
    return this.apiClient.put(url, {}, data);
  }

  deletePageImages(id, type: 'image' | 'floorPlan', photoID) {
    const url = ep.upload.deletePageImages(id, type, photoID);
    return this.apiClient.delete(url, {
      id,
    });
  }

  addImgTags(pageID: string, imgID: string, tag: string) {
    const url = ep.upload.imgTags(pageID, imgID, tag);
    return this.apiClient.put(url, {}, {});
  }

  deleteImgTags(pageID: string, imgID: string, tag: string) {
    const url = ep.upload.imgTags(pageID, imgID, tag);
    return this.apiClient.delete(url, {}, {});
  }
}

export default Upload;
