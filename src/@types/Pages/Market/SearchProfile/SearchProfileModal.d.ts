import {LoggedUserType, SearchProfileType} from '@brixel/brixel-components/dist/@types/Model';
import type {FromValueType} from './SearchProfileForm';

export class SearchProfileMultiActions {
  btnType: 'Primary' | 'Secondary';
  className?: string;
  clr: ThemeType['theme'];
  func: () => void;
  name: string;
  round: boolean;
}


export interface SearchProfileModalType {
  activeSearchProfile: SearchProfileType;
  formValue: FromValueType;
  handleCreateUserSearchProfile: (data: object) => void;
  handleSetUserActiveSearchProfile: (data: object) => void;
  handleUpdateSearchProfile: (data: object) => void;
  initialValues: SearchProfileType;
  isSmallLoading: {
    saveData: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  userSearchProfiles?: SearchProfileType[];
}
