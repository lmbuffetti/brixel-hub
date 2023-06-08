import {LoggedUserType, PropertyListType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface MarketCardMapType {
  handleUpdateFavorites: (data: object) => void;
  isSmallLoading: object;
  item: PropertyListType;
  lang: string;
  loggedInUser: LoggedUserType;
  onClick(...args: unknown[]): unknown;
  onHover(...args: unknown[]): unknown;
  skeleton: object;
  type?: string;
  wishlistProperties: PropertyListType[];
}
