import {CompanyType, DealType, LoggedUserType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface DashboardType {
  activeSingleCompany: CompanyType;
  activeSingleDeal: DealType;
  activeSingleProperty: PropertyType
  handleGetActiveSingleCompany: ({id: string}) => void
  handleGetActiveSingleProperty: (data: object) => void;
  handleGetBuyerDeal: ({id: string, actionStub: string}) => void;
  handleGetScheduleVisit: ({id: string, direction: string, order: string}) => void;
  handleGetFavoritesProperties: (data: object) => void;
  handleSetUserTypes: (val: string) => void;
  handleSpinnerOff: () => void
  loggedInUser: LoggedUserType;
}
