import {ContactType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

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
  handleGetActiveSingleProperty: (darta: object) => void;
  handleInitForm: (darta: object) => void;
  handleSendVisitFeedback: (darta: object) => void;
  handleSetActiveSingleCompany: (data: string) => void;
  initialValues: FormValueType;
  isSmallLoading: {
    sendVisitSent: boolean;
    sendVisit: boolean;
  };
}
