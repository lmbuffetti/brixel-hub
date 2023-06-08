import {DealType, PropertyType, StageOfferType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FormValueType extends StageOfferType['offer'] {
  action: string;
  id: string;
  note: string;
  smallLoader: string;
  status: string | boolean | null;
}

export interface ReviewOfferType {
  activeSingleDeal: DealType;
  activeSingleOffer: StageOfferType;
  activeSingleProperty: PropertyType;
  destroyForm: () => void;
  formValue: FormValueType;
  handleReviewOffer: (data: object) => void;
  handleSetActiveSingleDeal: (data: object) => void;
  handleSmallSpinner: (data: object) => void;
  isSmallLoading: {
    saveOffer: string | boolean;
  };
  lang: string;
  setSplashScreen: (data: string) => void;
}
