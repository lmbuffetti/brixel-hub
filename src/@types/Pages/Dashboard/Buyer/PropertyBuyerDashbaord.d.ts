import {DealType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface PropertyBuyerDashboardType {
  activeSingleDeal: DealType,
  formValue: PropertyType,
  lang: string,
  windowDimensions: {
    width: number;
    height: number;
  }
}
