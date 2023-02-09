export interface WelcomeSellerType {
  handleGetActiveSingleProperty: (data: object) => void;
  handleSetPageData: (data: object | null) => void;
  handleSpinnerOff: () => void;
  lang: string;
}
