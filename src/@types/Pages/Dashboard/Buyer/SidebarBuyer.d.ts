import {DealType, HistoryType, LoggedUserType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface SidebarBuyerType {
  activeCompanyPackages: object,
  activeDealHistory: HistoryType[],
  activeSingleProperty: PropertyType,
  activeSinglePropertyDeals: DealType,
  activeSinglePropertyHistory: HistoryType[],
  activeSingleUserHistory: HistoryType[],
  handleGetHistoryFeed: (data: object) => void,
  lang: string,
  loggedInUser: LoggedUserType,
}
