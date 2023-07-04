export interface ErrorBoundaryType {
  activeSingleProperty: object;
  children: any;
  handleSendSlackNotifications: (data: object) => void;
  lang: string;
  loggedInUser: object;
  pageError: boolean;
}
