import {CompanyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface UpgradeType {
  activeSingleCompany: CompanyType;
  handleGetActiveSingleCompanyPackages: (data: object) => void;
  lang: string;
}
