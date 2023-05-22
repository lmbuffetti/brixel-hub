import {DocumentType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface SingleFolderType {
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, value: any) => void;
  formValue: DocumentType;
  handleUpdateDocument: (data: object) => void;
  initForm: (val: object) => void;
  initialValues: DocumentType;
  isRequestDone: boolean;
  isSmallLoading: {
    saveData: boolean;
  };
  lang: string;
  setRequestDone: (val: boolean) => void;
}
