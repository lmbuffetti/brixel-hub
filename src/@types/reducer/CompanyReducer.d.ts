import type {CompanyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface CompanyReducerType {
  activeSingleCompany: CompanyType | object;
  activeSingleCompanyPackages: object[];
  companyListings: object[];
}
