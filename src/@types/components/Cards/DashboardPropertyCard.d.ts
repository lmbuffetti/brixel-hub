import {CompanyType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface DashboardPropertyCardProps {
  activeSingleCompany: CompanyType
  activeSingleProperty: PropertyType;
  estimation: object;
  handleSetModal(...args: unknown[]): unknown;
  lang: string;
  smallLayout?: boolean;
  type?: string;
}
