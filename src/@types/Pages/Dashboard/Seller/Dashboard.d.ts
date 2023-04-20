import {
  CompanyType,
  LoggedUserType,
  NotificationDataType,
  PropertyType,
  ScheduleType,
} from '@brixel/brixel-components/dist/@types/Model';

export interface FormValueType extends PropertyType {
  schedule: ScheduleType;
}
export interface DashboardType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  errorValue?: object;
  formValue: FormValueType;
  handleGetActiveSingleCompany: (data: object) => void;
  handleGetActiveSingleProperty: (data: object) => void;
  handleGetScheduleVisit: (data: object) => void;
  handleGetActiveSinglePropertyEstimation: (data: object) => void;
  handleGetImageType: () => void;
  handleGetPackageProperty: (data: object) => void;
  handleReset: (data: object) => void;
  handleSaveActiveSingleProperty: (data: object) => void;
  handleSetScreenNotification: (data: object) => void;
  handleSetUserTypes: (val: string) => void;
  handleSpinnerOff: () => void;
  imageType: object[];
  initForm: (data: object) => void;
  initialValues: PropertyType;
  isLoading: boolean;
  isSmallLoading: {
    saveData: boolean;
  };
  loggedInUser: LoggedUserType;
  notification: NotificationDataType[];
}
