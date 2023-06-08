import {CompanyType, LocationType, SearchProfileType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FromValueType extends SearchProfileType {
  changeCountry?: string;
  location?: LocationType | LocationType[];
}

export interface SearchProfileFormType {
  activeSingleCompany: CompanyType,
  changeFieldValue: (field: string, value: string) => void,
  formValue: FromValueType,
  initForm: (data: object) => void,
  lang: string,
  userSearchProfiles?: SearchProfileType[],
}
