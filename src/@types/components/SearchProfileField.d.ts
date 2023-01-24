import {SearchProfileType} from '@brixel/brixel-components/dist/@types/Model';

export interface SearchProfileFieldType {
  changeFieldValue: (field: string, value: any) => void;
  field?: string;
  lang: string;
  onClick?: () => void;
  searchProfile: SearchProfileType;
}
