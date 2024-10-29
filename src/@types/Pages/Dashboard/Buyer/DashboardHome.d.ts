import {
  CompanyType,
  LoggedUserType,
  StageOfferType,
  PropertyType,
  ScheduleVisitRequestType,
} from '@brixel-io/brixel-components/dist/@types/Model';
import {OfferType} from '@brixel-io/brixel-components/dist/@types/Models/Deals';

export interface ContactType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  handleGetScheduleVisit: (data: object) => void;
  isSmallLoading: {
    getProperty: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  offer: OfferType
  scheduleVisit: ScheduleVisitRequestType[] | null;
  userTypes?: string;
}
