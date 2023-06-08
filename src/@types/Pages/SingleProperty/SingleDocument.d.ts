import {DocumentType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface SingleDocumentType {
  activeSingleProperty: PropertyType;
  handleUpdateDocument: (data: object) => void;
  initialValues: PropertyType;
  isRequestDone: boolean;
  isSmallLoading: {
    saveData: boolean;
  };
  setRequestDone: (val: boolean) => void;
  initForm: (val: object) => void;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  formValue: DocumentType;
  lang: string;
}
