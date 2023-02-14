import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface MarketMapType {
  activeProperty?: PropertyType;
  lang: string;
  properties: PropertyType[];
  subMinHeight?: string;
  windowDimensions: {
    width: number;
    height: number;
  };
  zoom?: number;
}
