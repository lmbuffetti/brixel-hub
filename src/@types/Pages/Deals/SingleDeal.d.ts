import {DealType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

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
  lang: string;
  windowDimensions: {
    width: number;
    height: number;
  };
}
