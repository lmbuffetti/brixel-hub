import {
  CompanyType,
  LoginType,
  PropertyType,
  QuestionsListType,
  RegistrationType,
} from '@brixel-io/brixel-components/dist/@types/Model';

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

export interface FlowScreenType {
  closeLabelFlow?: string;
  disableEmailRegister: boolean;
  baseURL: string;
  closeButton?: boolean;
  closeLabel?: string;
  saveLabel?: string;
  closeLink?: string;
  company: CompanyType;
  destroyForm: (formName: string) => void;
  errorValue: object;
  formName: string;
  formValue: FormValueType;
  handleReset: (formName: string, data: object) => void;
  handleSetIsSmallLoading: (data: object) => void;
  handleSpinnerOff: () => void;
  initialValues: object;
  isSaveEnable?: boolean
  isSmallLoading: {
    sendData: boolean;
    savedData?: boolean;
    savingData?: boolean;
  };
  lang: string;
  newCurrentIndex?: number;
  onChangeCurrentIndex: (index: number) => void;
  onSaveData: (val?: string) => void;
  QuestionsList: QuestionsListType[];
  successCustomButtons: React.ReactNode[]
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
