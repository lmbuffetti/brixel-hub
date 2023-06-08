import {ImageType} from '@brixel-io/brixel-components/dist/@types/Models/Media';

export interface CoverPropertyImageType {
  className?: string;
  coverPhoto?: string;
  loadedImg?: (val: boolean) => void
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  propertyType?: string;
  size?: ImageType['size'];
}
