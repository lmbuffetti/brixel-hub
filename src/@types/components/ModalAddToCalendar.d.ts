import {
  DealType,
  PropertyType,
  ScheduleVisitRequestType,
} from '@brixel/brixel-components/dist/@types/Model';

export interface ModalAddToCalendarType {
  activeSingleDeal: DealType;
  activeSingleProperty: PropertyType;
  handleSetModal: (data: object) => void;
  lang: string;
  scheduleVisit: ScheduleVisitRequestType[];
}
