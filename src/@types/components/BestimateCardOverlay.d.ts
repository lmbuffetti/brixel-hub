import {EstimationType} from '@brixel/brixel-components/dist/@types/Model';

export interface BestimateCardOverlayType {
  activeSinglePropertyId: string;
  bestimate: EstimationType['result'];
  clearEstimation?: boolean;
  handleSetModal?: (data: object) => void;
  lang: string;
  setBestimateMessage?: (val: boolean) => void;
  setPropertyEstimation: (data: object) => void;
  setSplashScreen: (data: string) => void;
  type?: string;
}
