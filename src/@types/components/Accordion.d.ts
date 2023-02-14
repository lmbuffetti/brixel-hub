export interface AccordionType {
  children?: any;
  className?: string;
  color?: string;
  contentClass?: string;
  isExpanded?: boolean;
  onExpand?: (val: boolean) => void;
  paddingContent?: string;
  saturationTxt?: number;
  smallRightIcon?: boolean;
  singleItem?: boolean;
  title?: string;
  titleClass?: string;
}
