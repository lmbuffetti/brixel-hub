import {CompanyType, LoggedUserType} from '@brixel/brixel-components/dist/@types/Model';

export interface CustomerSatisfactionType {
  activeSingleCompany: CompanyType;
  handleSaveRate: (data: object) => void;
  handleUpdateUser: (data: object) => void;
  isSmallLoading: {
    saveData: boolean;
  }
  lang: string;
  loggedInUser: LoggedUserType;
  onClose: () => void;
}
