export interface CommonReducerType {
  configUrl: object;
  country: object;
  errorMsg: object;
  featureFlags: object;
  formError: object;
  history: object;
  isLoading: number;
  isSmallLoading: object;
  language: string | null;
  languages: object[],
  modal: object,
  notification: object;
  percentage: number;
  preventExitFromScreen: boolean;
  redirectTo: object | null;
  requestDone: boolean;
  setPageData: object | null;
  skeleton: object;
  splashScreenType: string;
  translation: object;
  unsavedChangesModal: object,
  windowDimensions: object,
  wizard: object;
}
