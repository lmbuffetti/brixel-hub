import {ServicePackageType} from '@brixel/brixel-components/dist/@types/Model';

export interface LanguagesType {
  value?: string;
  shortValue?: string;
  shortLabel?: string;
  label?: string;
  code: string;
  name: string;
}

export interface PageHeaderType {
  activeCompanyPackages: ServicePackageType[];
  activeSingleProperty: object;
  changeZIndex?: (val: number) => void;
  handleSaveActiveSingleUser(...args: unknown[]): unknown;
  handleSetActiveSingleProperty(...args: unknown[]): unknown;
  handleSetActiveSinglePropertyActivePackage(...args: unknown[]): unknown;
  handleSetLanguage(...args: unknown[]): unknown;
  handleSetUserTypes(...args: unknown[]): unknown;
  isFlow?: boolean;
  lang?: any;
  languages: LanguagesType[];
  loggedInUser?: object;
  ownerProperties: object;
  packagesProperty: ServicePackageType[];
  showFooter: boolean;
  userType: string;
  windowDimensions: {
    width: number;
    height: number;
  };
}
