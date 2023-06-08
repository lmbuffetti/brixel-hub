import {
  ScheduleVisitSlotType,
} from '@brixel-io/brixel-components/dist/@types/Model';

export interface ScheduleVisitComponentType {
  changeFieldValue: (field: string, val: object) => void;
  formValue?: ScheduleVisitSlotType;
  lang: string;
}
