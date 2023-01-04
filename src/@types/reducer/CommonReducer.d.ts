export interface CommonReducerType {
  configUrl: object;
  country: object;
  errorMsg: object;
  featureFlags: object;
  formError: object;
  history: object;
  isLoading: number;
  isSmallLoading: object;
  language: string;
  languages: object[],
  modal: {
    state: boolean;
    title: string;
    body: string;
    action: object;
    multiActions: object[];
  },
  notification: object[];
  percentage: number;
  preventExitFromScreen: boolean;
  redirectTo?: object | null;
  requestDone: boolean;
  setPageData?: object | null;
  skeleton: object;
  splashScreenType: string;
  translation: object;
  unsavedChangesModal: {
    state: boolean;
    link: string;
  },
  windowDimensions?: {
    width?: number;
    height?: number;
  },
  wizard: object;
}
