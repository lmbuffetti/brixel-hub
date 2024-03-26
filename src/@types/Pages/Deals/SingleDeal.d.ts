import {DealType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import ScheduleVisit from '../../../Pages/Dashboard/Buyer/ScheduleVisit/ScheduleVisit';

export interface SingleDealType {
  activeSingleVisitFeedback: any;
  activeSingleDeal: DealType;
  activeDealHistoryList: {
    total: number;
    data: DealType[];
  };
  activeSingleProperty: PropertyType;
  activeSinglePropertyDeals: DealType[];
  getActiveDeal: (data: object) => void;
  getDealNotes: (data: object) => void;
  getHistoryList: (data: object) => void;
  handleGetScheduleVisit: (data: object) => void
  handleSaveDeal: (data: object) => void;
  handleSaveMultipleDeal: (data: object) => void;
  setActiveSingleDealHistory: (data: object) => void;
  setActiveSingleDealOwnerHistory: (data: object) => void;
  setDeal: (data: object) => void;
  setDealNotes: (data: object) => void;
  scheduleVisit: ScheduleVisit
  lang: string;
  windowDimensions: {
    width: number;
    height: number;
  };
}
