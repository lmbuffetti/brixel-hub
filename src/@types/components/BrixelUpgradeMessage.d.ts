export interface BrixelUpgradeMessageType {
  activeSingleProperty: object;
  btnLabel?: string;
  className?: string;
  description?: string;
  descriptionConfirm?: string;
  isSmallLoading: {
    saveData: boolean;
  };
  lang: string;
  onClick?: () => void;
  onClose?: () => void;
  onOpentour?: (val: string) => void;
  redirectUrl?: string;
  showClose?: boolean;
  title?: string;
  titleConfirm?: string;
  trialRequest?: boolean;
  unlockFunction?: boolean;
  virtualTour?: string;
}
