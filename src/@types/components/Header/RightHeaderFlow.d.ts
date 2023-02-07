import {LoggedUserType} from '@brixel/brixel-components/dist/@types/Model';
import type {LanguagesType} from './PageHeader';

export interface RightHeaderFlowType {
  handleSetLanguage: (data: object) => void;
  lang?: string;
  languages?: LanguagesType[];
  loggedInUser?: LoggedUserType;
  userType: string;
}
