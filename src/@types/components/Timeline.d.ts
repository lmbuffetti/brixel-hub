import {CompanyType, DealType, NoteHistoryType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface TimelineType {
  activeDeal: DealType;
  activeDealHistoryList: {
    total: number;
    data: DealType[];
  };
  activeDealNotes: NoteHistoryType[];
  activeDealOwnerHistoryList: {
    total: number;
    data: DealType[];
  };
  activeProperty: PropertyType;
  activePropertyHistoryList: {
    total: number;
    data: DealType[];
  };
  activePropertyNotes: NoteHistoryType[];
  activePropertyOwnerHistoryList: {
    total: number;
    data: DealType[];
  };
  activeSingleCompany: CompanyType;
  className?: string;
  handleCreateNote(...args: unknown[]): unknown;
  handleSaveNote(...args: unknown[]): unknown;
  isDeal?: boolean;
  isSmallLoading: {
    saveNote: boolean;
  };
  lang: string;
  loggedInUser: LoggedInUser;
}
