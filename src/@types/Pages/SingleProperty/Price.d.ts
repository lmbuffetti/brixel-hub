import {DocumentType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface PriceType {
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;

  estimation: PropertyType;
  formValue: PropertyType;
  handleGenerateBestimate: (val: string) => void;
  handleGetEstimation: (data: object) => void;
  handleSetHistory: (data: object) => void;
  lang: string;
  proEstimation?: {
    document: DocumentType;
  };
  handleSetModal: (val: object) => void;
}
