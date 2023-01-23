import {
  CompanyType,
  DealType,
  DocumentType,
  EstimationType,
  HistoryType,
  LoggedUserType,
  PropertyType,
} from '@brixel/brixel-components/dist/@types/Model';
import type {FormValueType} from './Dashboard';

export interface DashboardHomeType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  activeSinglePropertyDeals?: DealType;
  activeSinglePropertyDealsCount: object;
  activeSinglePropertyHistory: HistoryType[];
  documents: DocumentType[];
  estimation: EstimationType;
  formValue: FormValueType;
  handleGetActiveSinglePropertyDealsCount: (data: object) => void;
  handleGetEstimation: (data: object) => void;
  handleGetPageDeals: (data: object) => void;
  handleSetModal: (data: object) => void;
  lang: string;
  loggedInUser: LoggedUserType;
  onProgressStep: (data: object) => void;
  splashScreenType: string;
  windowDimensions: {
    width: number;
    height: number;
  };
}
