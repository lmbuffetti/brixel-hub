import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface DashboardOfferType {
  activeSingleProperty: PropertyType;
  handleGetOfferListings: (data: object) => void;
}
