import {CompanyType, EstimationType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface ResumeBestimateType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  condition: EstimationType['result'];
  estimation: EstimationType;
  handleCreateEstimation: (data: object) => void;
  handleGenerateBestimate: (data: string) => void;
  handleGetEstimation: (data: object | string) => void;
  history: object;
  lang: string;
}
