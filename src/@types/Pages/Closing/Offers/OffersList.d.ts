import {PropertyType, StageOfferType} from '@brixel/brixel-components/dist/@types/Model';

export interface OfferListType {
  activeSingleProperty: PropertyType;
  handleSetActiveSingleDeal: (data: object) => void
  offerListings: StageOfferType[];
}
