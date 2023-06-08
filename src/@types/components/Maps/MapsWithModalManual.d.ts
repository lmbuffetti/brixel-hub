import {PropertyListType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface MapsWithModalManualType {
  changeFieldValue: (form: string, field: string, value?: string | null) => void;
  className?: string;
  country?: {
    value: string;
    full: string;
  }[];
  formName: string;
  formValue: PropertyListType;
  lang: string;
  showMap?: boolean;
  syncErrors: object;
  windowDimensions: {
    width: number;
    height: number;
  };
}
