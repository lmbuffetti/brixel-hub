import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface DashboardPropertyCardProps {
  activeSingleProperty: PropertyType;
  estimation: object;
  handleSetModal(...args: unknown[]): unknown;
  lang: string;
  smallLayout?: boolean;
  type?: string;
}
