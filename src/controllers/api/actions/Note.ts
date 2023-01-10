import Base from '../config/Base';

import ep from '../../endPoints.constant';

class Note extends Base {
  private apiClient: any;
  updateSingleNote(id, data) {
    const url = ep.note.singleNote(id);
    return this.apiClient.put(url, {}, data);
  }

  createSingleNote(data, type) {
    const url = ep.note.createSingleNote(type);
    return this.apiClient.post(url, {}, data);
  }

  getNotesList(type, id, paginationLimit, paginationSkip, data) {
    const url = ep.note.getListOfNotes(type, id, paginationLimit, paginationSkip, data);
    return this.apiClient.get(url);
  }
}

export default Note;
