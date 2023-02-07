import {CompanyType, DocumentType, LoggedUserType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';
import type {FormValueType} from './MakeOffer';

export interface Key4RegistrationType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  activeSinglePropertyDocs: DocumentType[];
  formValue: FormValueType;
  lang: string;
  loggedInUser: LoggedUserType;
  onClick: () => void;
  onCloseGoBack: () => void;
}
