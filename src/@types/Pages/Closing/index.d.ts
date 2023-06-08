import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface BestimateType {
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, value: string | boolean | null | string[] | number) => void;
  errorValue: object;
  formValue: PropertyType;
  handleReset: (form: string, data: object) => void;
  handleSaveActiveSingleProperty: (data: object) => void;
  initForm: (data: object) => void;
  initialValues: object;
  initialValuesPage: object;
  lang: string;
}
