import {DealType, NotificationDataType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface DealsType {
  activeSingleProperty: PropertyType;
  activeSinglePropertyDeals: {
    interested: {
      total: number;
      data: DealType;
    };
    visit: {
      total: number;
      data: DealType;
    };
    offer: {
      total: number;
      data: DealType;
    }
  };
  handleGetPageDeals: (data: object) => void;
  handleSaveDeal: (data: object) => void;
  notification: NotificationDataType[];
  resetSingleDeal: (data: object) => void;
  saveMultipleDeals: (data: object) => void;
  setActiveSinglePropertyDeals: (data: object) => void;
  setPreventExit: (val: boolean) => void;
  smallLoader: {
    loadDeal: boolean;
  };
  lang: string;
  windowDimensions: {
    width: number;
    height: number
  }
}
