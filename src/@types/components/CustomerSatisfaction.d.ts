import {LoggedUserType} from '@brixel/brixel-components/dist/@types/Model';

export interface CustomerSatisfactionType {
  handleUpdateUser: (data: object) => void;
  lang: string;
  loggedInUser: LoggedUserType;
  onClose: () => void;
}
