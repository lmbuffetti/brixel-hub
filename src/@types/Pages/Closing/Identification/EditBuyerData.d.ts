export interface EditBuyerDataType {
  dealID: string;
  forceStep?: number;
  formValue: object;
  handleDeleteDocument: (data: object) => void;
  handleUploadDocument: (data: object) => void;
  initialValues: object;
  lang: string;
  loggedInUser: object;
  profileId: number;
  userType: string;
}
