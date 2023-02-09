import {
  CompanyType,
  EstimationType,
  LoggedUserType,
  NotificationDataType,
  PropertyType,
  ServicePackageType,
} from '@brixel/brixel-components/dist/@types/Model';

export interface MarketCategoryListSellerType {
  activeMarketOverlayProperty: PropertyType;
  activeSingleCompany: CompanyType;
  activeSingleCompanyPackages: ServicePackageType[];
  activeSingleProperty: PropertyType;
  activeSinglePropertyActivePackage: ServicePackageType;
  activeSinglePropertyPackage: ServicePackageType[];
  bestimate: EstimationType['result'];
  companyListings: CompanyType[];
  estimation: object;
  handleGetActiveCompanyPackages: (data: object) => void;
  handleGetActiveSingleCompany: (data: object) => void;
  handleGetCompanyListing: () => void;
  handleGetEstimation: (data: object) => void;
  handleGetPackageProperty: (data: object) => void;
  handleSetActiveSingleCompany: (data: object) => void;
  handleSetActiveSingleProperty: (data: object) => void;
  handleSetHistory: (data: object) => void;
  isSmallLoading: {
    pkgComapny: boolean;
    loadPackages: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  notification: NotificationDataType[];
  ownerProperties: {
    total: number;
    data: PropertyType[];
  };
  premiumProperties:  {
    total: number;
    data: PropertyType[];
  };
  setMarketOverlayProperty: (data: object) => void;
  setPropertyEstimation: (data: object) => void;
  setSplashScreen: (val: string) => void;
  skeleton: {
    own: boolean;
  };
  splashScreenType: string;
}
