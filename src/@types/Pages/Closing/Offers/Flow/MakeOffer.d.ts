import {
  CompanyType,
  DealType,
  DocumentType,
  LoggedUserType,
  PropertyType,
} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FormValueType {
  financeBuyer?: object;
  affordabilityCheck?; null,
  loanValueCheck?; null,
  financeCertificate?; null,
  company?; string,
  id?; string,
  propertyLocation?; LocationType,
  amount?; number,
  propertyPrice?; number,
  propertyPriceCurrency?; number,
  noDocument?; number,
  documents?: DocumentType[];
  document?: DocumentType[];
}

export interface MakeOfferType {
  activeSingleCompany: CompanyType;
  activeSingleDeal: DealType;
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, value: number | object | string) => void;
  destroyForm: () => void;
  errorValue: object;
  formValue: FormValueType;
  handleGetActiveSingleCompany: (data: object) => void;
  handleGetActiveSingleProperty: (data: object) => void;
  handleGetBuyerDeal: (data: object) => void;
  handleMultiUploadDocument: (data: object) => void;
  handleReset: (data: object) => void;
  handleSaveMakeOffer: (data: object) => void;
  handleSetModal: (data: object) => void;
  initForm: (data: object) => void;
  isTest: boolean;
  initialValues: FormValueType;
  handleSpinnerSmallOff: () => void;
  isSmallLoading: {
    sendData: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  translations: object;
}
