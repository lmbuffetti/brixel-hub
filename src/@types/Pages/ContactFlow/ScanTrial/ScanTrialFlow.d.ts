import {
  CompanyType,
  LoggedUserType,
  PropertyType,
  ScanTrialModelType,
} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FormValueType extends ScanTrialModelType {
  analysis?: string;
  name?: string,
  bookType?: string;
  date?: Date;
  dateBook?: string;
  email?: string,
  fullDate?: string;
  hourBook?: string;
  phone?: {
    prefix?: string;
    number?: string,
  },
  userID?: string;
}

export interface ScanTrialFlowType {

  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  activeSingleScanTrial?: ScanTrialModelType;
  destroyForm:() => void;
  errorValue: object;
  formValue: FormValueType;
  handleGetActiveSingleCompany:({ id: string }) => void;
  handleGetActiveSingleProperty:({fullVersion: string, id: string, multiLoader: string}) => void;
  handleGetBuyerDeal:({id: string, actionStub: string}) => void;
  handleGetHistoryFeed(...args: unknown[]): unknown;
  handleReset:(val: FormValueType) => void;
  handleSendMessageContact:(val: FormValueType) => void;
  handleSendScanTrial(...args: unknown[]): unknown;
  handleSetPropertyHistory(...args: unknown[]): unknown;
  initForm:(data: FormValueType) => void;
  initValues: object;
  initialValues: FormValueType;
  isSmallLoading: {
    sendData: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
}
