import {
  CompanyType,
  DealType,
  DocumentType,
  LocationType,
  LoggedUserType,
  PropertyType,
} from '@brixel/brixel-components/dist/@types/Model';

export interface FormValueType extends PropertyType {
  affordability: any
  document?: DocumentType[];
  loanToValueRatio: any
  amount: number
  mortgageAmount: any
  company: string
  affordabilityCheck: any
  loanValueCheck: any
  id: string
  propertyLocation: LocationType
  propertyPrice: number
  propertyPriceCurrency: string
  subtype: any
}

export interface FinancingType {
  activeSingleCompany: CompanyType;
  activeSingleDeal: DealType;
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, data: string | number | object) => void;
  destroyForm: () => void;
  errorValue: object;
  formValue: FormValueType;
  handleCreateEstimation: (data: object) => void;
  handleGetActiveSingleCompany: (data: object) => void;
  handleGetActiveSingleProperty: (data: object) => void;
  handleGetBuyerDeal: (data: object) => void;
  handleMultiUploadDocument: (data: object) => void;
  handleReset: (data: object) => void;
  handleSaveFinancingRequest: (data: object) => void;
  initForm: (data: object) => void;
  initValues: object;
  initialValues: PropertyType;
  isSmallLoading: {
    sendData: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
}
