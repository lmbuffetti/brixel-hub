import {
  CompanyType,
  DealType,
  LoggedUserType,
  PropertyType,
  SinglePropertyBookingSlotsType,
} from '@brixel/brixel-components/dist/@types/Model';

export interface ContactType {
  activeSingleCompany: CompanyType;
  activeSingleDeal: DealType;
  activeSingleProperty: PropertyType;
  activeSinglePropertyBookingSlots: SinglePropertyBookingSlotsType[];
  handleGetActiveSinglePropertyBookings: (data: object) => void;
  handleSetModal: (data: object) => void;
  isSmallLoading: {
    getProperty: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  userTypes?: string;
}
