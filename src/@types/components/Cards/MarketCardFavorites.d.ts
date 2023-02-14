import {LoggedUserType, PropertyListType} from '@brixel/brixel-components/dist/@types/Model';

export interface MarketCardFavoritesType {
  activeSingleProperty: PropertyListType;
  handleSetModal: (data: object) => void;
  handleUpdateFavorites: (data: object) => void;
  isSmallLoading: object;
  lang: string;
  loggedInUser: LoggedUserType;
}
