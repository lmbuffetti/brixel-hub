import {EstimationType} from '@brixel/brixel-components/dist/@types/Model';

export interface ModalPropertyEstimationType {
  handleGenerateEstimation: (data: object) => void;
  isSmallLoading: {
    generateEstimation: boolean;
  };
  lang: string;
  ownerEstimations: EstimationType[];
}
