export interface TermsConditionUBSType {
  isSmallLoading: {
    sendData: boolean;
  };
  lang: string;
  onSaveData: (data?: string) => void;
  windowDimensions: object,
}
