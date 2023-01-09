import type {LanguagesType} from './Header/PageHeader';
import {LoggedUserType} from '@brixel/brixel-components/dist/@types/Model';

export interface AccountDropdownType {
  className?: string;
  handleSaveActiveSingleUser: (data: object) => void;
  lang: string;
  languages: LanguagesType[];
  loggedInUser: LoggedUserType;
  preventExit: boolean;
  setUnsavedModal: (data: object) => void;
}
