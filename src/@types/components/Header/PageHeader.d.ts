import {ServicePackageType} from '@brixel-io/brixel-components/dist/@types/Model';

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
  handleSaveActiveSingleUser: (data: object) => void;
  handleSetActiveSingleProperty: (data: object) => void;
  handleSetActiveSinglePropertyActivePackage: (data?: object) => void;
  handleSetLanguage: (data: object) => void;
  handleSetUserTypes: (data: string) => void;
  isFlow?: boolean;
  isSecondLevelClass?: boolean;
  lang?: any;
  languages: LanguagesType[];
  loggedInUser?: object;
  onClose?: () => void;
  ownerProperties: object;
  packagesProperty: ServicePackageType[];
  showFooter: boolean;
  userType: string;
  windowDimensions: {
    width: number;
    height: number;
  };
}
