import {DealType} from '@brixel/brixel-components/dist/@types/Model';

export interface BrixelClosingTreeType {
  activeSingleClosing: object;
  activeSingleDeal: DealType;
  activeSingleOffer: DealType['closing']['stageOffer'];
  className?: string;
  dealID: string;
  isBuyer?: boolean;
  lang: string;
  propID: string;
  handleSetModal: (data: object) => void;
  windowDimensions: {
    width: number;
    height: number;
  };
}
