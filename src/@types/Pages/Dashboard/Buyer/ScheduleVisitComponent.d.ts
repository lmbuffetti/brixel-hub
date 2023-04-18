import {
  PropertyType,
  // SinglePropertyBookingSlotsType,
} from '@brixel/brixel-components/dist/@types/Model';
import type {FormValueType} from './ScheduleVisit';

export interface ScheduleVisitSlotType {
  end: number,
  start: number,
  isAllDay: boolean,
  timezone: string,
}

export interface ScheduleVisitComponentType {
  activeScheduleVisit: ScheduleVisitSlotType[];
  activeSingleProperty: PropertyType;
  activeSinglePropertyBookingSlots: SinglePropertyBookingSlotsType[];
  formValue: FormValueType;
  initalValue: FormValueType;
  changeFieldValue: (field: string, val: object) => void;
  lang: string;
  onClick: () => void;
}
