import {CompanyType, LoggedUserType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface TermsConditionUBSType {
  activeSingleCompany: CompanyType;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  company: CompanyType;
  destroyForm: () => void;
  formValue: PropertyType;
  handleGetActiveSingleCompany: (data: object) => void;
  handleSaveActiveSingleUser: (data: object) => void;
  handleSpinnerOff: () => void;
  initForm: (data: object) => void;
  initialValues: object;
  isSmallLoading: {
    sendData: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  translations: object;
  windowDimensions: object,
}
