import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface FinanceCertificateType {
  activeSingleProperty: PropertyType
  changeFieldValue: (field: string, value: number) => void,
  lang: string;
  onClick: () => void;
}
