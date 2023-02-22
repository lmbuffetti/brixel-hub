import {
  LoggedUserType,
  PropertyType,
  SinglePropertyBookingSlotsType,
} from '@brixel/brixel-components/dist/@types/Model';

export interface ScheduleVisitComponentType {
  activeSingleProperty: PropertyType;
  activeSinglePropertyBookingSlots: SinglePropertyBookingSlotsType[];
  changeFieldValue: (field: string, val: object) => void;
  lang: string;
  onClick: () => void;
}
