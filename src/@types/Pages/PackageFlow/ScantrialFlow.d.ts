import {CompanyType, LoggedUserType, PhoneNumberType} from '@brixel/brixel-components/dist/@types/Model';

export interface FormValueType {
  bookType?: string;
  dateBook?: string;
  email?: string;
  fullDate?: string;
  hourBook?: string;
  name?: string;
  phone?: PhoneNumberType;
  date?: string;
  analysis?: string;
}

export interface ScanTrialFlowType {
  activeSingleCompany: CompanyType;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  destroyForm: () => void;
  errorValue: object;
  formValue: FormValueType;
  handleGetActiveSingleCompany: (data: object) => void;
  handleReset: (data: object) => void;
  handleSendScanTrial: (data: object) => void;
  handleSpinnerOff: () => void;
  initForm: (data: object) => void;
  initialValues: object;
  isSmallLoading: {
    sendData: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
}
