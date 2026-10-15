import Base from '../config/Base';
import ep from '../../endPoints.constant';
class History extends Base {
    getHistoryList(paginationLimit, paginationSkip, query, data) {
        const url = ep.history.getHistoryListOfParent(paginationLimit, paginationSkip, query);
        return this.apiClient.post(url, {}, data);
    }
}
export default History;
