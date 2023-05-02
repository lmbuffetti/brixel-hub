import {
  LoggedUserType,
  PropertyType,
  ScheduleVisitSlotType,
  DealsType,
  ModalDataType,
} from '@brixel/brixel-components/dist/@types/Model';
import {ScheduleVisitRequestType} from '@brixel/brixel-components/dist/@types/Models/ContactSchedule';

export interface FormValueType {
  scheduleVisit: ScheduleVisitSlotType;
  scheduleVisits: ScheduleVisitSlotType[];
  deal: string;
  message: string;
}

export interface ScheduleVisitType {
  activeSingleDeal: DealsType,
  activeScheduleVisit: ScheduleVisitRequestType,
  activeSingleProperty: PropertyType;
  errorValue: object;
  formValue: FormValueType;
  changeFieldValue: (data: string, value: any) => void;
  hanldeSaveScheduleVisit: (data: object) => void;
  handleSetModal: (data: object) => void;
  initForm: (data: object) => void;
  initialValues: FormValueType;
  isSmallLoading: {
    sendData: boolean | string;
  }
  lang: string;
  loggedInUser: LoggedUserType;
  modalData: ModalDataType;
  translations: object;
}

