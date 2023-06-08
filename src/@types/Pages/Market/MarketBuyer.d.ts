import {LoggedUserType, SearchProfileType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface MarketBuyerType {
  activeSearchProfile?: SearchProfileType;
  destroyForm: () => void;
  handleGetActiveSingleCompany: (data: object) => void;
  handleGetBuyerProperties: (data: object) => void;
  handleGetOwnedEstimations: (data: object) => void;
  handleGetUserSearchProfiles: (val: string) => void;
  handleGetWishlistProperties: (data: object) => void;
  handleSpinnerOff: () => void;
  lang: string;
  loggedInUser: LoggedUserType;
}
