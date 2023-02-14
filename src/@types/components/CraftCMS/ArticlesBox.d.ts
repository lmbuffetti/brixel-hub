import {CompanyType} from '@brixel/brixel-components/dist/@types/Model';

export interface ArticlesBoxPropsType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: object;
  className?: string;
  lang: string;
  placementSlug: string;
}

export interface ArticlePlacementType {
  mainTitle?: string;
  subtitle?: string;
  logo?: {
    alt: string;
    url: string;
  }[];
}
