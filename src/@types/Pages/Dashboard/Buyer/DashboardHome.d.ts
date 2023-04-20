import {
  CompanyType,
  LoggedUserType,
  PropertyType, ScheduleVisitRequestType,
  SinglePropertyBookingSlotsType,
} from '@brixel/brixel-components/dist/@types/Model';

export interface ContactType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  activeSinglePropertyBookingSlots: SinglePropertyBookingSlotsType[];
  handleGetScheduleVisit: (data: object) => void;
  handleSetModal: (data: object) => void;
  isSmallLoading: {
    getProperty: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  scheduleVisit: ScheduleVisitRequestType[];
  userTypes?: string;
}
