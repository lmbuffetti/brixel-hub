import {CompanyType, SearchProfileType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface SearchProfileListType {
  activeSingleCompany: CompanyType;
  changeFieldValue: (field: string, value: string) => void;
  handleDeleteUserSearchProfile: (data: object) => void;
  handleSetModal: (data: object) => void;
  handleUpdateSearchProfile: (data: object) => void;
  initForm: (data: object) => void;
  isSmallLoading: object;
  lang: string;
  onChangeProfile: (val: string) => void;
  userActiveSearchProfileId?: string;
  userSearchProfiles?: SearchProfileType[];
}
