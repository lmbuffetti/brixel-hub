import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface DetailMediaType {
  changeFieldValue: (field: string, value: object) => void,
  formValue: PropertyType,
  handleDeleteImg: (data: object) => void,
  handleGetActiveSingleProperty: (data: object) => void,
  handleSpinnerSmall: (data: object) => void,
  handleUpdateImageDescription: (data: object) => void,
  isSmallLoading: {
    delete: boolean;
    rotate: boolean;
    rotateImg: boolean;
    saveData: boolean;
    updateDescription: boolean;
  },
  lang: string,
}
