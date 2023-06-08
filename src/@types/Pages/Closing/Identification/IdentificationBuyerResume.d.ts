import {QuestionInputType} from '@brixel-io/brixel-components/dist/@types/Model';
import type {FormValueType} from './IdentificationFlow';

export interface IdentificationBuyerResumeType {
  cardInput?: QuestionInputType[];
  dealID: string;
  formValue: FormValueType;
  isSmallLoading: {
    sendData: boolean;
  };
  lang: string;
  onBack(...args: unknown[]): unknown;
  onClick(...args: unknown[]): unknown;
  syncErrors: {
    persons: object[];
  };
  userType: string;
}
