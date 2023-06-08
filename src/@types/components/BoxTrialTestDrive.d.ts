import {CompanyType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface BoxTrialTestDirveType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  className?: string;
  isLarge?: boolean;
  lang: string;
  windowDimensions: {
    width: number;
    height: number;
  };
}
