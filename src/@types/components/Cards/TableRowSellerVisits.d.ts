import {DealType, PropertyType, ScheduleVisitRequestType} from '@brixel/brixel-components/dist/@types/Model';

export interface TableRowSellerVisitsType {
  activeSingleProperty: PropertyType;
  lang: string;
  loggedInUser: LoggedUserType;
  visit: ScheduleVisitRequestType;
}
