import {CompanyType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {initVal} from '../../../../Pages/Dashboard/Buyer/ScheduleVisit/CompleteProfile';

export interface CompleteProfileType {
  activeSingleProperty: PropertyType
  activeSingleCompany: CompanyType;
  changeFieldValue: (data: string, value: any) => void;
  destroyForm: () => void;
  formValue: keyof typeof initVal,
  handleGetActiveSingleCompany: (data: object) => void,
  handleGetActiveSingleProperty: (data: object) => void,
  handleSaveBuyerQualification: (data: object) => void,
  initForm: (data: object) => void
  lang: string;
  translations: object,
}
