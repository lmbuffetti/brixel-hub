import {EstimationType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface BestimateCardOverlayType {
  bestimate: EstimationType['result'];
  clearEstimation?: boolean;
  handleSetModal: (data: object) => void;
  lang: string;
  setBestimateMessage?: (val: boolean) => void;
  setPropertyEstimation: (data: object) => void;
}
