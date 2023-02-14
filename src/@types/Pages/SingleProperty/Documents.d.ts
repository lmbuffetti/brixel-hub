import {LoggedUserType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface DocumentsPageType {
  activeSingleProperty: PropertyType;
  formValue: PropertyType;
  handleDeleteDocument: (data: object) => void;
  handleMultiUploadDocument: (data: object) => void;
  isBuyer?: boolean;
  isSmallLoading: {
    deleteMedia: boolean;
    uploadMedia: boolean;
  };
  loggedInUser: LoggedUserType;
  lang: string;
  userType: string;
}
