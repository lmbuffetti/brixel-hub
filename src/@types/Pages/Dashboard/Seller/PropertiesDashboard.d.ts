import {LoggedUserType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface PropertiesDashboardType {
  form: {
    Property: PropertyType;
  };
  activeSingleProperty: PropertyType;
  handleGetUserProperties:(val: string) => void;
  handleSpinnerOff:() => void;
  lang: string;
  loggedInUser: LoggedUserType;
  userProperties: PropertyType[];
}
