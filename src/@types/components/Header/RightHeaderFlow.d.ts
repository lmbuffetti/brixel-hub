import {LoggedUserType} from '@brixel-io/brixel-components/dist/@types/Model';
import type {LanguagesType} from './PageHeader';

export interface RightHeaderFlowType {
  handleSetLanguage: (data: object) => void;
  lang?: string;
  languages?: LanguagesType[];
  loggedInUser?: LoggedUserType;
  onClose: () => void;
  userType: string;
}
