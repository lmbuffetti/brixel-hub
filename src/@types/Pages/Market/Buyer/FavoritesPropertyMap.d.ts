import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';
import {TagType} from '@brixel/brixel-components/dist/@types/components/GoogleMap/GoogleMap';

export interface FavoritesPropertyMapType {
  lang: string;
  wishlistProperties: PropertyType[];
}

export interface TagListMapType {

  [index: string]: TagType[]
}
