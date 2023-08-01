import {CompanyType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface SupportType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  handleSendSupportMessage: (data: object) => void;
  hideClose?: boolean;
  isMobile?: boolean;
  isSmallLoading: {
    supportMessage: boolean;
  };
  lang: string;
  onClose?: () => void;
  requestDone: boolean;
  handleSetModal: (data: object) => void;
}
