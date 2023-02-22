import {LoggedUserType} from '@brixel/brixel-components/dist/@types/Model';

export interface ProtectedRouteType {
  allowAccess?: boolean | string;
  children: any;
  isTest?: boolean;
  loggedInUser: LoggedUserType;
  userTypes?: string;
}
