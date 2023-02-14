import {CompanyType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface FavoritesPropertyListType {
  activeSingleCompany: CompanyType;
  ownerEstimations: {
    total: number;
    data: PropertyType[];
  },
  skeleton: {
    estimation: boolean;
  },
  lang: string;
}
