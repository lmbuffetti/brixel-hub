import {CompanyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface BannerBoxType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: object;
  className: string;
  lang: string;
  placementSlug: string;
  title?: string;
}

export interface BannerStateType {
  title?: string;
  description?: string;
  bannerButton?: {
    url: string;
    text: string;
  }
  mainImage?: {
    alt: string;
    url: string;
  }[];
  logo?: {
    alt: string;
    url: string;
  }[];
}
