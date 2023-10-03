import {ContactType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FormValueType {
  reasons: string[],
  otherReason: string,
  priceChangeAlert: boolean | null,
}

export interface VisitFeedbackType {
  activeSingleProperty: PropertyType;
  contacts: ContactType;
  errorValue: object;
  formValue: FormValueType;
  lng: string;
  handleGetActiveSingleProperty: (data: object) => void;
  handleSetLanguage: (data: string) => void;
  handleInitForm: (data: object) => void;
  handleSendVisitFeedback: (data: object) => void;
  handleSetActiveSingleCompany: (data: string) => void;
  initialValues: FormValueType;
  isSmallLoading: {
    sendVisitSent: boolean;
    sendVisit: boolean;
  };
}
