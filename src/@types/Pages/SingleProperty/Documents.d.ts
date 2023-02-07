import {DocumentType, LoggedUserType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface DocumentTypePage extends DocumentType {
  chosen?: boolean;
  selected?: boolean;
}


export interface DocumentsPageType {
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, value: string | DocumentType[]) => void;
  formValue: PropertyType;
  handleDeleteDocument: (data: object) => void;
  handleMultiUploadDocument: (data: object) => void;
  handleSaveActiveSingleProperty: (data: object) => void;
  isBuyer?: boolean;
  isSmallLoading: {
    deleteMedia: boolean;
    uploadMedia: boolean;
  };
  loggedInUser: LoggedUserType;
  lang: string;
  userType: string;
}
