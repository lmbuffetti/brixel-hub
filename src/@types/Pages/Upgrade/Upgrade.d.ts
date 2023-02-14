import {CompanyType} from '@brixel/brixel-components/dist/@types/Model';

export interface UpgradeType {
  activeSingleCompany: CompanyType;
  handleGetActiveSingleCompanyPackages: (data: object) => void;
  lang: string;
}
