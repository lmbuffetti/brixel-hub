import Base from '../config/Base';
import ep from '../../endPoints.constant';
class Property extends Base {
    addProperty(data, token) {
        const url = ep.property.addPage();
        return this.apiClient.post(url, { token }, data);
    }
    updateProperty(id, data) {
        const url = ep.property.pageById(id);
        return this.apiClient.put(url, {}, data);
    }
    getProperty(id) {
        const url = ep.property.pageById(id);
        return this.apiClient.get(url, {});
    }
    getPropertyByStub(stub) {
        const url = ep.property.pageByStub(stub);
        return this.apiClient.get(url, {});
    }
    deleteProperty(id) {
        const url = ep.property.pageById(id);
        return this.apiClient.delete(url, {});
    }
    getPropertySimplified(id) {
        const url = ep.property.pageByIdPublic(id);
        return this.apiClient.get(url, {});
    }
    getEstimation(id) {
        const url = ep.property.estimation(id);
        return this.apiClient.get(url, {});
    }
    saveScheduleVisit(data) {
        const url = ep.property.scheduleVisit();
        return this.apiClient.post(url, {}, data);
    }
    getPropertyVisitSchedule(id) {
        const url = ep.property.scheduleVisitId(id);
        return this.apiClient.get(url, {});
    }
    saveBuyerQualificationData(id, data) {
        const url = ep.property.buyerQualificationData(id);
        return this.apiClient.patch(url, {}, data);
    }
    changePublishReview(id, status) {
        const url = ep.property.publishReview(id, status);
        return this.apiClient.put(url, {}, {});
    }
    changePortalsReview(id, status) {
        const url = ep.property.portalsReview(id, status);
        return this.apiClient.put(url, {}, {});
    }
    packagePage(id) {
        const url = ep.property.packagePage(id);
        return this.apiClient.get(url, {});
    }
    sendScanTrial(id, data) {
        const url = ep.property.scanTrial(id);
        return this.apiClient.put(url, {}, data);
    }
    getPageDeals(id, data) {
        const url = ep.property.pageDeals(id, data);
        return this.apiClient.get(url, {});
    }
    getPageDealsCount(id) {
        const url = ep.property.pageDealsCount(id);
        return this.apiClient.get(url, {});
    }
    getPropertyVisits(id, order = 'visit', direction = 'DESC', quantity = 50, offset = 0) {
        const url = ep.property.visitsList(id, order, direction, quantity, offset);
        return this.apiClient.get(url, {});
    }
    setTermsAcceptance(id, data) {
        const url = ep.property.acceptTerms(id);
        return this.apiClient.post(url, {}, data);
    }
}
export default Property;
