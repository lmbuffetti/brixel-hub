import {CompanyType, DocumentType, LoggedUserType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface DocumentTypePage extends DocumentType {
  chosen?: boolean;
  selected?: boolean;
}


export interface DocumentsPageType {
  activeSingleCompany: CompanyType,
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, value: string | DocumentType[]) => void;
  formValue: PropertyType;
  handleDeleteDocument: (data: object) => void
  handleGetActiveSingleProperty: (data: object) => void
  handleSaveActiveSingleProperty: (data: object) => void
  handleSpinnerSmall: (data: object) => void
  isBuyer?: boolean;
  isSmallLoading: {
    deleteMedia: boolean;
    uploadMedia: boolean;
  };
  loggedInUser: LoggedUserType;
  lang: string;
  userType: string;
}
