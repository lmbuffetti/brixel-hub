import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface PageType {
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, value: string) => void;
  formValue: PropertyType;
  handleSetModal: (data: object) => void;
  handleUpdatePublishedReview: (data: object) => void;
  isSmallLoading: {
    saveMarketingPage: boolean;
    pageReview: boolean;
  };
  lang: string;
  modal: ModalType;
}

export interface StatusType {
  text: string,
  color: string,
  state: string,
}
