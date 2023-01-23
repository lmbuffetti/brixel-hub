import {
  HistoryType,
  LoggedUserType,
  NoteHistoryType,
  PropertyType,
  ServicePackageType,
} from '@brixel/brixel-components/dist/@types/Model';

export interface SellerSidebarType {
  activeCompanyPackages: ServicePackageType,
  activeSingleProperty: PropertyType,
  activeSinglePropertyHistory: HistoryType[],
  activeSinglePropertyNotes: NoteHistoryType[],
  activeSingleUserHistory: HistoryType[],
  handleGetHistoryFeed: (data: object) => void,
  handleGetNoteListings: (data: object) => void,
  lang: string,
  loggedInUser: LoggedUserType,
}
