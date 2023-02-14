import {PropertyListType} from '@brixel/brixel-components/dist/@types/Model';

export interface MarketCardSmallType {
  className?: string;
  estimation?: object;
  handleSetActiveSingleProperty(...args: unknown[]): unknown;
  handleSetEstimation(...args: unknown[]): unknown;
  handleSetSplashType(...args: unknown[]): unknown;
  item?: PropertyListType;
  lang: string;
  readOnly?: boolean;
  setMarketOverlayProperty(...args: unknown[]): unknown;
  setSplashScreen(...args: unknown[]): unknown;
  showAddess?: boolean;
  skeleton: object;
  type?: string;
}
