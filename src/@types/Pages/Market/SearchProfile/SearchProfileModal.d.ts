import {LoggedUserType, SearchProfileType} from '@brixel/brixel-components/dist/@types/Model';
import type {FromValueType} from './SearchProfileForm';

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
