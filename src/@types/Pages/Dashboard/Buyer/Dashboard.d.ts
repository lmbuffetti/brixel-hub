import {CompanyType, DealType, LoggedUserType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface DashboardType {
  activeSingleCompany: CompanyType;
  activeSingleDeal: DealType;
  activeSingleProperty: PropertyType
  handleGetActiveSingleCompany: ({id: string}) => void
  handleGetActiveSingleProperty: (data: object) => void;
  handleGetBuyerDeal: ({id: string, actionStub: string}) => void;
  handleGetFavoritesProperties: (data: object) => void;
  handleGetScheduleVisit: ({id: string, direction: string, order: string}) => void;
  handleSetUserTypes: (val: string) => void;
  handleSpinnerOff: () => void
  hanldeGetScheduleVisit: (data: object) => void;
  loggedInUser: LoggedUserType;
}
