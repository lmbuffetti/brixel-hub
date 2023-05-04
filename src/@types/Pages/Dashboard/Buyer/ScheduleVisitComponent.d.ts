import {
  PropertyType,
  ScheduleVisitSlotType,
} from '@brixel/brixel-components/dist/@types/Model';
import type {FormValueType} from './ScheduleVisit';

export interface ScheduleVisitComponentType {
  changeFieldValue: (field: string, val: object) => void;
  lang: string;
}
