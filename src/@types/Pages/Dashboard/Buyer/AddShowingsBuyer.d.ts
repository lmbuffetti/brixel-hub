import {
  LoggedUserType,
  PropertyType,
  SinglePropertyBookingSlotsType,
} from '@brixel/brixel-components/dist/@types/Model';

export interface FormValueType {
  page: string;
  name: string;
  slots: SinglePropertyBookingSlotsType[];
  scheduleVisitFree: SinglePropertyBookingSlotsType[];
  phone: {
    prefix: string;
    number: string;
  };
  email: string;
  language: string
  getByUser: string;
  message: string;
}

export interface AddShowingsBuyerType {
  activeSingleProperty: PropertyType;
  activeSinglePropertyBookingSlots: SinglePropertyBookingSlotsType[];
  errorValue: object;
  formValue: FormValueType;
  handleCreatePropertyVisitBooking(...args: unknown[]): unknown;
  handleGetActiveSingleProperty(...args: unknown[]): unknown;
  handleGetActiveSinglePropertyBookings(...args: unknown[]): unknown;
  initForm(...args: unknown[]): unknown;
  initialValues: FormValueType;
  lang: string;
  loggedInUser: LoggedUserType;
  translations: object;
}

