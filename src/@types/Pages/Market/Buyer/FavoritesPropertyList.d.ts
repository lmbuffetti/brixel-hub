import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface FavoritesPropertyListType {
  lang: string;
  skeleton: {
    wishlist: boolean;
  },
  wishlistProperties: {
    total: number;
    data: PropertyType[];
  },
}
