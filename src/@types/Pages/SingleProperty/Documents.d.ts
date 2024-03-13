import {CompanyType, DocumentType, LoggedUserType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface DocumentTypePage extends DocumentType {
  chosen?: boolean;
  selected?: boolean;
  url?: string;
  loadUrl?: string;
}
export interface DocumentsPageType {
  activeSingleCompany: CompanyType,
  activeSingleProperty: PropertyType
  changeFieldValue: (field: string, value: string | object | Array) => void
  formValue: PropertyType
  handleDeleteDocument: (data: object) => void
  handleUpdateDocument: (data: object) => void
  handleOrderDocuments: (data: object) => void
  handleGetActiveSingleProperty: (data: object) => void
  handleSpinnerSmall: (data: object) => void
  isBuyer?: boolean
  // handleUpdateDocument: (data: object) => void
  lang: string
  isSmallLoading: {
    editDocument: boolean
    saveData: boolean
    downloadMedia: boolean
    uploadMedia: boolean
    loadingMedia: boolean
    getProperty: boolean
    deleteMedia: boolean
  }
  loggedInUser: LoggedUserType
  setNotification: (data: object) => void
}

export interface DocumentsPageBuyerType {
  activeSingleProperty: PropertyType,
  lang: string,
}
