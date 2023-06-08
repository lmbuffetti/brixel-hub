import {CompanyType, LoggedUserType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface CustomerSatisfactionType {
  activeSingleCompany: CompanyType;
  handleSaveRate: (data: object) => void;
  handleUpdateUser: (data: object) => void;
  isSmallLoading: {
    saveDataCustomer: boolean;
  }
  lang: string;
  loggedInUser: LoggedUserType;
  onClose: () => void;
}
