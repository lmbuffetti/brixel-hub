import {CompanyType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface SupportType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  expanded?: boolean;
  handleSendSupportMessage: (data: object) => void;
  hideClose?: boolean;
  isFixed?: boolean;
  isSmallLoading: {
    supportMessage: boolean;
  };
  lang: string;
  layout?: string;
  onClose?: () => void;
  requestDone: boolean;
}
