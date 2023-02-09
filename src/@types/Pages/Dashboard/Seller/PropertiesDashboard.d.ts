import {LoggedUserType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

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
