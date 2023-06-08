import {PropertyType, StageOfferType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface OfferListType {
  activeSingleProperty: PropertyType;
  handleSetActiveSingleDeal: (data: object) => void
  offerListings: StageOfferType[];
}
