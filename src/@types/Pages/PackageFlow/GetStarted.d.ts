export interface FormValueType {
  channel: string;
  changeCountry: string;
  company: string;
  owner: string | null;
}

export interface GetStartedType {
  changeFieldValue: (field: string, value: string | null) => void;
  destroyForm: () => void;
  formValue: FormValueType;
  handleGetActiveSingleCompany: (data: object) => void;
  handleSpinnerOff: () => void;
  lang?: string;
  loggedInUser: object;
  translations: object;
}
