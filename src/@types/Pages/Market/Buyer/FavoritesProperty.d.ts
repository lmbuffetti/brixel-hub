import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FavoritesPropertyType {
  lang: string;
  wishlistProperties: {
    total: number;
    data: PropertyType[];
  },
}
