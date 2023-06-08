import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface DetailMediaType {
  formValue: PropertyType,
  handleRotateImg: (data: object) => void,
  changeFieldValue: (field: string, value: object) => void,
  handleDeleteImg: (data: object) => void,
  isSmallLoading: {
    saveData: boolean;
    delete: boolean;
    rotate: boolean;
  },
  lang: string,
}
