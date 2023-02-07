import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface FavoritesPropertyType {
  lang: string;
  wishlistProperties: {
    total: number;
    data: PropertyType[];
  },
}
