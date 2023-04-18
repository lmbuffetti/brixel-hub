import {CompanyType, LoggedUserType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface ContactFormType {
  action?: string;
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, val: string | object) => void
  destroyForm: () => void
  errorValue: {
    location?: string;
    reset?: string;
    userMessage?: string;
  };
  formValue: {
    userName: string;
    userMessage: string;
    userEmail: string;
    userPhone: object;
  };
  handleSaveScheduleVisit: (data: object) => void
  handleSendMessage: (data: object) => void
  handleSpinnerSmall: (data: object) => void
  initialValues: object;
  isSmallLoading: {
    sendMessage: boolean | string;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  onChangeAction: (val: null | string) => void
  resetAction?: () => void
  scheduleVisit?: object[];
  type?: string;
}
