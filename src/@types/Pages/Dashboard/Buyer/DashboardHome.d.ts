import {
  CompanyType,
  LoggedUserType,
  PropertyType,
  ScheduleVisitRequestType,
} from '@brixel-io/brixel-components/dist/@types/Model';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';

export interface DashboardHomeType {
  activeSingleOffer: OfferType
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  dealID: number
  handleGetActiveSingleOffer: (data: object) => void;
  handleGetScheduleVisit: (data: object) => void;
  isSmallLoading: {
    getProperty: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  scheduleVisit: ScheduleVisitRequestType[] | null;
  userTypes?: string;
}
