import {PropertyType, StageOfferType} from '@brixel-io/brixel-components/dist/@types/Model';
import {BaseByDataType} from '@brixel-io/brixel-components/dist/@types/Configuration/ConfigurationType';

export interface OfferListingsType {
  activeSingleProperty: PropertyType;
  data: StageOfferType[];
  getConfigEnv: BaseByDataType;
  onChangeLocation: (data: string) => void;
  lang: string;
}
