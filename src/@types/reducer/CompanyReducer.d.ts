import type {CompanyType} from '@brixel/brixel-components/dist/@types/Model';

export interface CompanyReducerType {
  activeSingleCompany: CompanyType | object;
  activeSingleCompanyPackages: object[];
  companyListings: object[];
}
