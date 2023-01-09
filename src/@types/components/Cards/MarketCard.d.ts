import {
  CompanyType,
  LoggedUserType,
  PropertyListType,
  ServicePackageType
} from '@brixel/brixel-components/dist/@types/Model';

export interface CompanyTypeListType extends CompanyType {
  tags: string[];
  hideAddress: boolean;
  servicePackages: ServicePackageType[];
}

export interface MarketCardProps {
  companyDetail?: object;
  companyListings: CompanyTypeListType[];
  estimation: object;
  favoritesProperties: PropertyListType[];
  handleGenerateBestimate(...args: unknown[]): unknown;
  handleGetEstimation(...args: unknown[]): unknown;
  handleGetPackageProperty(...args: unknown[]): unknown;
  handleMarkNotInterested(...args: unknown[]): unknown;
  handleSetModal(...args: unknown[]): unknown;
  handleUpdateFavorites(...args: unknown[]): unknown;
  index?: number;
  isSmallLoading: object;
  item?: PropertyTypeList;
  lang: string;
  layout?: string;
  loggedInUser: LoggedUserType;
  onSetActiveProperty?(...args: unknown[]): unknown;
  preventClick?: boolean;
  setMarketOverlayProperty(...args: unknown[]): unknown;
  setPropertyEstimation(...args: unknown[]): unknown;
  setSplashScreen(...args: unknown[]): unknown;
  skeleton: object;
  type?: string;
  wishlistProperties: PropertyTypeList[];
}
