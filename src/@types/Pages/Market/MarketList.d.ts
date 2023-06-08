import {CompanyType, LoggedUserType, PropertyListType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface MarketListType {

  allProperties: {
    total: number;
    data: PropertyListType[]
  };
  companyListings: CompanyType[];
  handleGetAllProperties: (data: object) => void;
  handleGetLastViewedProperties: () => void;
  handleGetNewProperties: (data: object) => void;
  handleGetPreMarketProperties: (data: object) => void;
  handleGetPremiumProperties: (data: object) => void;
  handleGetSellerProperties: (data: object) => void;
  handleGetWishlistProperties: (data: object) => void;
  handleGetwishlistProperties: (data: object) => void;
  lang: string;
  lastViewedProperties: object;
  loggedInUser: LoggedUserType;
  newProperties: {
    total: number;
    data: PropertyListType[]
  };
  ownerProperties: {
    total: number;
    data: PropertyListType[]
  };
  preMarketProperties: {
    total: number;
    data: PropertyListType[]
  };
  premiumProperties: {
    total: number;
    data: PropertyListType[]
  };
  setMarketOverlayProperty: (data: object) => void;
  setSplashScreen: (val: string) => void;
  userSearchProfiles?: object[];
  windowDimensions: {
    width: number;
    height: number;
  };
  wishlistProperties: {
    total: number;
    data: PropertyListType[]
  };
}
