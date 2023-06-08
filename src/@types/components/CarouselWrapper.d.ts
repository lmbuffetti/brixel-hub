import {CompanyType, PropertyListType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface CarouselWrapperType {
  className?: string;
  companyListings: CompanyType[];
  items?: PropertyListType[];
  lang: string;
  layout?: string;
  loggedInUser: object;
  onSetActiveProperty?: (val: string) => void
  setActiveSingleCompany?: (val: string | object) => void
  ownerProperties: {
    total: number;
    data: PropertyListType;
  };
  setPropertyId?: (val: string) => void
  slideToGo?: number;
  subtitle?: string;
  theme?: string;
  title?: string;
  total?: number;
  type?: string;
  windowDimensions: {
    width: number;
    height: number;
  };
}
