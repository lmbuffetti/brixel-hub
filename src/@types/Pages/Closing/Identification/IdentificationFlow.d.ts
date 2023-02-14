import {
  DealType,
  DocumentType,
  LocationType,
  LoggedUserType,
  PropertyType,
  StageIdentificationType,
} from '@brixel/brixel-components/dist/@types/Model';

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
  activeSingleDeal: DealType;
  activeSingleProperty: PropertyType;
  destroyForm: () => void
  errorValue: object;
  formValue: FormValueType;
  handleDeleteDocument: (data: object) => void
  handleGetActiveSingleDeal: (data: object) => void
  handleMultiUploadDocument: (data: object) => void
  handleSaveClosingIdentification: (data: object) => void
  handleChangeSmallLoading: (data: object) => void
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
