import {
  LoggedUserType,
  ModalDataType,
  PropertyType,
  SearchProfileType,
} from '@brixel/brixel-components/dist/@types/Model';

export interface MarketCategoryListBuyerType {
  activeSearchProfile?: SearchProfileType;
  buyerProperties: {
    total: number;
    data: PropertyType[];
  };
  filterPropType?: {
    active?: boolean;
    value: string;
    label?: string;
  }[];
  handleGetActiveBuyerProperties: (data: object) => void;
  handleGetActiveSingleCompany: (data: object) => void;
  handleSetModal: (data: object) => void;
  lang: string;
  loggedInUser: LoggedUserType;
  modalLearnMoreSrchPrf: ModalDataType,
  setSplashScreen: (val: string) => void;
  skeleton: {
    buyerProperties: string;
  };
  splashScreenType: string;
  userSearchProfiles?: object[];
  windowDimensions: {
    width: number;
    height: number;
  };
}
