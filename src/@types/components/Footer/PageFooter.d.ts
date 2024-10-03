import {CompanyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface PageFooterType {
  activeSideBar?: boolean;
  activeSingleCompany: CompanyType;
  className?: string;
  lang: string;
  translations: object
}
