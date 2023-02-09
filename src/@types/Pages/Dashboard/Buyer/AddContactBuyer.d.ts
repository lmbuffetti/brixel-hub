import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface AddContactBuyerType {
  activeSingleProperty: PropertyType;
  isSmallLoading: {
    sendMessage: string | boolean;
  };
  lang: string;
}
