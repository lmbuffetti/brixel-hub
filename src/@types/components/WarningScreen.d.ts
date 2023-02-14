export interface WarningScreenType {
  formName: string;
  handleReset: (formName: string, data: object) => void;
  handleSetModal: (data: object) => void;
  initialValue: object;
  isSmallLoading: {
    saveData: boolean;
  };
  lang: string;
  onClose: () => void;
  saveFunc?: () => void;
}
