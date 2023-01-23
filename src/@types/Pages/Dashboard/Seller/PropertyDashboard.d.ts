import type {FormValueType} from './Dashboard';

export interface PropertyDashboardType {
  formValue: FormValueType;
  lang: string;
  windowDimensions: {
    width: number;
    height: number;
  };
}
