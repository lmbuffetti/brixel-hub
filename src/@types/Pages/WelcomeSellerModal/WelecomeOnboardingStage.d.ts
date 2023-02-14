import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface WelecomeOnboardingStageType {
  activeSingleProperty: PropertyType;
  changeFieldValue: (form: string, field: string, val: string) => void;
  lang: string;
}
