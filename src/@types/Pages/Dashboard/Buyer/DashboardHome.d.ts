import {
  CompanyType,
  LoggedUserType,
  PropertyType, ScheduleVisitRequestType,
} from '@brixel-io/brixel-components/dist/@types/Model';

export interface ContactType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  handleGetScheduleVisit: (data: object) => void;
  isSmallLoading: {
    getProperty: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  scheduleVisit: ScheduleVisitRequestType[] | null;
  userTypes?: string;
}
