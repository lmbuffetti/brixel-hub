import {SearchProfileType} from '@brixel/brixel-components/dist/@types/Model';

export interface SearchProfileFieldType {
  field?: string;
  lang: string;
  onClick?: () => void;
  searchProfile: SearchProfileType;
}
