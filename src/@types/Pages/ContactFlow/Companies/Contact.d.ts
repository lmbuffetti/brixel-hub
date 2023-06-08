import {CompanyType, LoggedUserType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FormValueType {
  analysis?: string;
  company?: string | null;
  deal?: string,
  id?: string,
  page?: string,
  phone?: {
    prefix: string,
    number: string,
  },
  time?: {
    hour?: string,
    timestamp?: number,
  }
  type?: string,
  user?: string,
  userType?: string,
}

export interface ContactType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  changeFieldValue:(field: string, val: string | number) => void;
  destroyForm:() => void;
  errorValue: object;
  formValue: FormValueType;
  handleGetActiveSingleCompany:({ id: string }) => void;
  handleGetActiveSingleProperty:({fullVersion: string, id: string, multiLoader: string}) => void;
  handleGetBuyerDeal:({id: string, actionStub: string}) => void;
  handleSendMessageContact:(val: FormValueType) => void;
  handleReset:(val: FormValueType) => void;
  initForm:(data: FormValueType) => void;
  initialValues: FormValueType;
  initValues: object;
  isSmallLoading: {
    sendData: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
}
