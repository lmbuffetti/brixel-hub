import {CompanyType, PhoneNumberType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface FormValueType {
  actionStub: string;
  email: string;
  name: string;
  phone: PhoneNumberType;
  stage: string;
}

export interface CreateDealType {
  destroyForm: () => void;
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  handleCreateDeal: (data: object) => void;
  formValue: FormValueType;
  lang: string;
}
