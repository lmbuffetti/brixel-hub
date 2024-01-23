import type {FormValueType} from './IdentificationFlow';

export interface EditBuyerDataType {
  dealID: string;
  forceStep?: number;
  formValue: FormValueType;
  handleDeleteDocument: (data: object) => void;
  handleSaveClosingIdentification: (data: object) => void;
  initialValues: object;
  lang: string;
  loggedInUser: object;
  profileId: number;
  userType: string;
}
