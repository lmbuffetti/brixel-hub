import type {LoggedUserType} from '../Model';

export interface UserReducerType {
  documents: DocumentType | {},
  favorites: any,
  loggedUser: LoggedUserType | {},
}
