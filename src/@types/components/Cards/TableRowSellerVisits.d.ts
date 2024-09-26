import {PropertyType, ScheduleVisitRequestType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface TableRowSellerVisitsType {
  activeSingleProperty: PropertyType;
  lang: string;
  loggedInUser: LoggedUserType;
  visit: ScheduleVisitRequestType;
}
