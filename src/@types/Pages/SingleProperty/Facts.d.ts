import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FactsType {
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  formValue: PropertyType;
  handleSaveData: (val: string) => void;
  lang: string;
  windowDimensions: {
    width: number;
    height: number;
  }
}
