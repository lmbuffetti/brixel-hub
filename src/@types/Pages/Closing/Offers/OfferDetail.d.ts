import {DealType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface OfferDetailType {
  activeSingleDeal: DealType,
  activeSingleProperty: PropertyType,
  handleGetActiveSingleDeal: (data: object) => void,
  isBuyer?: boolean,
  lang: string,
  windowDimensions: {
    width: number;
    height: number;
  },
}
