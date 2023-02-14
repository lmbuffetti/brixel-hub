import {PropertyListType} from '@brixel/brixel-components/dist/@types/Model';

export interface ModalPropertyCardType {
  isFavorite?: boolean;
  lang: string;
  onClose: () => void;
  onRemoveProperty?: () => void;
  property: PropertyListType;
  saveFavorite?: (val: string) => void;
}
