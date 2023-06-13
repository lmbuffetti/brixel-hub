import type {LoggedUserType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface DashboardPropertyCardSoldProps {
  activeSingleProperty: PropertyType;
  lang: string;
  loggedInUser: LoggedUserType;
}
