import {CompanyType, LocationType, NotificationType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface LoginSignupType {
  changeFieldValue: (formName: string, fild: string, val: string | boolean) => void
  company: CompanyType;
  disableEmailRegister?: boolean;
  errorValue: object;
  formError: object;
  windowDimensions: object,
  formName: string;
  formValue: {
    location: LocationType;
    login: {
      email: string;
      password: string;
    }
  };
  handleRecoverPassword: (data: object) => void
  handleSetFormError: (data: object) => void
  isSmallLoading: {
    recoverPassword: boolean;
  };
  lang: string;
  loggedInUser: {
    token: string;
    user: LoginSignupType;
  };
  notification: NotificationType[];
  onChangeLogin?: (page: string) => void
  onDisableValidation?: (val: boolean) => void
  onSubmit?: (val: string) => void
  skipPhone?: boolean;
}
