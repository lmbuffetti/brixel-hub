import {SearchProfileType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface SearchProfileFieldType {
  field?: string;
  lang: string;
  onClick?: () => void;
  searchProfile: SearchProfileType;
}
