import {
  PropertyType,
  ScheduleVisitSlotType,
} from '@brixel/brixel-components/dist/@types/Model';
import type {FormValueType} from './ScheduleVisit';

export interface ScheduleVisitComponentType {
  activeScheduleVisit: ScheduleVisitSlotType[];
  activeSingleProperty: PropertyType;
  formValue: FormValueType;
  initalValue: FormValueType;
  changeFieldValue: (field: string, val: object) => void;
  lang: string;
  onClick: () => void;
}
