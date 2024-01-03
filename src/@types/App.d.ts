import {
  CompanyType,
  LoggedUserType,
  ModalDataType,
  NotificationType,
  PhotosType,
  PropertyType,
} from '@brixel-io/brixel-components/dist/@types/Model';
import {BaseByDataType} from '@brixel-io/brixel-components/dist/@types/Configuration/ConfigurationType';
import type {LanguagesType} from './components/Header/PageHeader';

export interface AppType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  config: BaseByDataType;
  handleCheckToken: (data: object) => void;
  handleGetActiveSingleCompany: (data: object) => void;
  handleGetImageType: (data: object) => void;
  handleGetTranslations: (data: object, path: string) => void;
  handleReset: (form: string, data: object) => void;
  handleSaveActiveSingleUser: (data: object) => void;
  handleSetActiveSingleDeal: (data: object) => void;
  handleSetActiveSingleProperty: (data: object) => void;
  handleSetLanguage: (lng: string) => void;
  handleSetModal: (data: object) => void;
  handleSetNotification: (data: object) => void;
  handleSetUserTypes: (val: string) => void;
  handleSetWindowsDimension: (data: object) => void;
  handleSpinnerOff: () => void;
  isLoading?: boolean;
  isSmallLoading: object;
  lang: string;
  languages: LanguagesType[];
  loggedInUser: LoggedUserType;
  modal: ModalDataType;
  notification: NotificationType[];
  pageError: boolean;
  redirectTo?: {
    history: string;
    url: string;
  };
  splashScreenType?: {
    component?: any;
    props: object;
  } | string;
  teamAvatars: PhotosType[];
  userTypes?: string;
  windowDimensions: {
    width: number;
    height: number;
  };
  translations: object;
}
