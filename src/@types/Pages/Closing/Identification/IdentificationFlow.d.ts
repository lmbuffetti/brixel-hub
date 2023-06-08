import {
  DealType,
  DocumentType,
  LocationType,
  LoggedUserType,
  PropertyType,
  StageIdentificationType,
} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FormValueType extends StageIdentificationType {
  persons: {
    fullName?: string;
    document: DocumentType[],
    dateBirth: string,
    maritialStatus: string,
    matrimonialPropertyRegime: string,
    nationality: string,
    typeOfOwnership: string,
    currentLivingAddress: {
      address: string,
      zipCode: string,
      city: string,
    },
  }[];
}

export interface IdentificationFlowType {
  activeSingleCompany: CompaniesType;
  activeSingleDeal: DealType;
  activeSingleProperty: PropertyType;
  destroyForm: () => void
  errorValue: object;
  formValue: FormValueType;
  handleChangeSmallLoading: (data: object) => void
  handleDeleteDocument: (data: object) => void
  handleGetActiveSingleDeal: (data: object) => void
  handleGetActiveSingleCompany: (data: object) => void
  handleGetActiveSingleProperty: (data: object) => void
  handleMultiUploadDocument: (data: object) => void
  handleSaveClosingIdentification: (data: object) => void
  handleSpinnerOff: () => void
  initForm: (data: object) => void
  initialValues: object;
  isSmallLoading: {
    sendDataSent?: boolean;
    sendData?: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  handleReset: (data: object) => void
  syncErrors: {
    location?: LocationType;
  };
}
