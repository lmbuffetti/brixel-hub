export interface ProtectedRouteType {
  allowAccess?: boolean | string;
  children: any;
  isTest: boolean;
  loggedInUser: {
    token: string;
    user: LoggedInUser;
  };
  userTypes?: string;
}
