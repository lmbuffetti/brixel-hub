import {CompanyType, LoggedUserType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import type {FormValueType} from './ScanTrialFlow';

export interface BookTrialFlowType {

  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  changeFieldValue:(field: string, val: string | number) => void;
  destroyForm:() => void;
  errorValue: object;
  formValue: FormValueType;
  handleGetActiveSingleCompany:({ id: string }) => void;
  handleGetActiveSingleProperty:({fullVersion: string, id: string, multiLoader: string}) => void;
  handleGetBuyerDeal:({id: string, actionStub: string}) => void;
  handleReset:(val: FormValueType) => void;
  handleSendMessageContact:(val: FormValueType) => void;
  initForm:(data: FormValueType) => void;
  initValues: object;
  initialValues: FormValueType;
  isSmallLoading: {
    sendData: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  onClick(...args: unknown[]): unknown;
  showError: boolean;
  syncErrors: object;
}
