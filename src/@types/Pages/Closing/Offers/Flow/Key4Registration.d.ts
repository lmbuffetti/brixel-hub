import {CompanyType, DocumentType, LoggedUserType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import type {FormValueType} from './MakeOffer';

export interface Key4RegistrationType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  activeSinglePropertyDocs: DocumentType[];
  formValue: FormValueType;
  isTest: boolean;
  lang: string;
  loggedInUser: LoggedUserType;
  onClick: () => void;
  onCloseGoBack: () => void;
}
