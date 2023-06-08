import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface AddContactBuyerType {
  activeSingleProperty: PropertyType;
  isSmallLoading: {
    sendMessage: string | boolean;
  };
  lang: string;
}
