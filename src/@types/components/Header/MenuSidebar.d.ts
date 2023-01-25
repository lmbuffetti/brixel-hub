import {DealType} from '@brixel/brixel-components/dist/@types/Model';

export interface NavigationType {
  path: string;
  icon: string;
  name: string;
  submenu?: {
    name: string;
    path: string;
    title: string;
  }[];
  title: string;
}

export interface MenuSidebarType {
  activeSingleDeal: DealType;
  lang: string;
  onClickLink?: () => void;
  userType?: string;
  windowDimensions: {
    width: number;
    height: number;
  };
}
