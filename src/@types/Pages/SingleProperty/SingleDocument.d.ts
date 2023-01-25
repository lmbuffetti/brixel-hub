import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface SingleDocumentType {
  activeSingleProperty: PropertyType;
  handleUpdateDocument: (data: object) => void;
  initialValues: PropertyType;
  isRequestDone: boolean;
  isSmallLoading: {
    saveData: boolean;
  };
  setRequestDone: (val: boolean) => void;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  formValue: PropertyType;
  lang: string;
}
