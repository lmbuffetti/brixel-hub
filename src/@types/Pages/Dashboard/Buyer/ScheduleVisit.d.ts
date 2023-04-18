import {
  LoggedUserType,
  PropertyType,
  // SinglePropertyBookingSlotsType,
  DealsType,
} from '@brixel/brixel-components/dist/@types/Model';
import type {ScheduleVisitSlotType} from './ScheduleVisitComponent';

export interface FormValueType {
  scheduleVisit: ScheduleVisitSlotType[];
  deal: string;
  message: string;
}

export interface ScheduleVisitType {
  activeSingleDeal: DealsType,
  activeSingleProperty: PropertyType;
  errorValue: object;
  formValue: FormValueType;
  hanldeSaveScheduleVisit: (data: object) => void;
  handleGetBuyerDeal: (data: object) => void;
  handleGetActiveSingleProperty: (data: object) => void;
  hanldeGetScheduleVisit: (data: object) => void;
  initForm: (data: object) => void;
  initialValues: FormValueType;
  lang: string;
  loggedInUser: LoggedUserType;
  translations: object;
}

