import {CompanyType, LoggedUserType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface ProtectedRouteType {
  activeSingleCompany: CompanyType;
  allowAccess?: boolean | string;
  children: any;
  isTest?: boolean;
  loggedInUser: LoggedUserType;
  userTypes?: string;
}
