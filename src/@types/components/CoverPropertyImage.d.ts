export interface CoverPropertyImageType {
  className?: string;
  coverPhoto?: string;
  loadedImg?: (val: boolean) => void
  onClick?: () => void
  onMouseEnter?: (e: MouseEvent<HTMLImageElement>) => void
  onMouseLeave?: (e: MouseEvent<HTMLImageElement>) => void
  propertyType?: string;
  size?: string;
}
