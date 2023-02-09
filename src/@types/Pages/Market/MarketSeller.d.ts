import {LoggedUserType} from '@brixel/brixel-components/dist/@types/Model';

export interface MarketSellerType {
  destroyForm: () => void;
  handleGetFavoritesProperties: (data: object) => void;
  handleGetPremiumProperties: (data: object) => void;
  handleGetSellerProperties: (data: object) => void;
  handleSpinnerOff: () => void;
  loggedInUser: LoggedUserType;
}
