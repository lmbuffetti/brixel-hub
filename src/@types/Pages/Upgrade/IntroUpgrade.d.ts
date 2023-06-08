import {
  CompanyType,
  LoggedUserType,
  PropertyType,
  ServicePackageType,
} from '@brixel-io/brixel-components/dist/@types/Model';

export interface IntroUpgradeType {
  activeSingleCompany: CompanyType;
  activeSingleCompanyPackages: ServicePackageType[];
  activeSingleProperty: PropertyType;
  activeSinglePropertyPackage: ServicePackageType[];
  companyListings: CompanyType[];
  handleGetActiveCompanyPackages: (data: object) => void;
  handleGetActiveSingleCompany: (data: object) => void;
  handleGetPackageProperty: (data: object) => void;
  isSmallLoading: object;
  lang: string;
  loggedInUser: LoggedUserType;
  ownerProperties: {
    total: number;
    data: PropertyType;
  };
  packages: ServicePackageType[];
  scrollHash?: string;
}
