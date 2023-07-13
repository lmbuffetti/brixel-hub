import {CompanyType, SearchProfileType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface SearchProfileFieldType {
  activeSingleCompany: CompanyType;
  field?: string;
  lang: string;
  onClick?: () => void;
  searchProfile: SearchProfileType;
}
