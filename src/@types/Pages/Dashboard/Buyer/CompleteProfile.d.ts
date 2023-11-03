import {CompanyType, LoggedInUserType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FormValueType {
  buyerStatus: string;
  buyerStatusOther?: string;
  involvedPurchaseProperty: string;
  involvedPurchasePropertyOther?: string;
  financingProof: string;
  relationshipLocationProperty: string;
  watch3dTour: string;
  propertyAppealed: string;
}

export interface CompleteProfileType {
  activeSingleCompany: CompanyType;
  changeFieldValue: (data: string, value: any) => void;
  handleGetActiveSingleProperty: (data: object) => void,
  handleGetActiveSingleCompany: (data: object) => void,
  destroyForm: () => void;
  formValue: FormValueType,
  lang: string;
  loggedInUser: LoggedInUserType;
  translations: object,
}
