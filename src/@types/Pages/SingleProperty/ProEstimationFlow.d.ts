import {EstimationType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface ProEstimationFlowType {
  activeSingleProperty: PropertyType;
  estimation: EstimationType;
  formValue: PropertyType;
  handleDestroy: () => void;
  handleGetEstimation: (data: object) => void;
  handleReset: (data: object) => void;
  handleSaveActiveSingleProperty: (data: object) => void;
  handleSetModal: (data: object) => void;
  initForm: (data: object) => void;
  initialValues: object;
  isSmallLoading: {
    saveData: boolean;
  };
  lang: string;
}
