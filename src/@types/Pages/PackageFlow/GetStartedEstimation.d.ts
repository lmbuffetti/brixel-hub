import {CompanyType, LoginType, PropertyType, RegistrationType,} from '@brixel/brixel-components/dist/@types/Model';

export interface FormValueType {
  baloiseInfo?: string;
  inputSheet?: {
    totalComplete?: number;
  }
  channel?: string;
  changeCountry?: string;
  company?: string;
  owner?: string | null;
  login?: LoginType;
  pageID?: string | null,
  register?: RegistrationType;
  location?: LocationType;
  pageTitle?: string;
  id?: string;
  price?: PropertyType['price'];
  properties?: {
    propertyType?: PropertyType['properties']['propertyType'];
    typology?: {
      bathrooms?: PropertyType['properties']['typology']['bedrooms'];
      bedrooms?: PropertyType['properties']['typology']['bedrooms'];
      livingArea?: PropertyType['properties']['typology']['livingArea'];
      grossArea?: PropertyType['properties']['typology']['grossArea'];
      floorSpace?: PropertyType['properties']['typology']['floorSpace'];
    }
    parking?: {
      garage?: PropertyType['properties']['parking']['garage'];
      outside?: PropertyType['properties']['parking']['outside'];
      underground?: PropertyType['properties']['parking']['underground'];
    }
  }

}

export interface GetStartedEstimationType {
  activeSingleCompany: CompanyType;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  company: CompanyType;
  destroyForm: () => void;
  errorValue: object;
  formValue: FormValueType;
  handleCreateActiveSingleProperty: (data: object) => void;
  handleCreateEstimation: (data: object) => void;
  handleDoLogin: (data: object) => void;
  handleGetActiveSingleCompany: (data: object) => void;
  handleReset: (data: object) => void;
  handleSpinnerOff: () => void;
  handleSpinnerOn: () => void;
  handleValidateUser: (data: object) => void;
  initForm: (data: object) => void;
  initialValues: object;
  isLoading: boolean;
  isTest: boolean;
  lang?: string;
  loggedInUser: object;
  translations: object;
}

export interface FormToSaveData extends FormValueType {
  redirectToRewards?: boolean;
  packageFlowProcess?: {
    answers?: object,
    rewardScreenData?: object,
    metaUser?: object,
  },
  preMarketVisible?: boolean,
  ownerType?: string,
  language?: string,
  title?: string,
  purpose?: string,
  status?: string,
  listed?: boolean,
  active?: boolean,
  published?: boolean,
  addProperty?: boolean,
  redirectToUserFlow?: boolean,
  createEstimation?: boolean,
  redirectToUrl?: string,
  extraLoading?: boolean,
  data?: FormToSaveData;
  generate?: true,
  redirectTo?: '/buy/estimations',
  answers?: string;
}
