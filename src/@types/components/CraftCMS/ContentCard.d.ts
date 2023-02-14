export interface ContentCardType {
  hrefOnClick: (hrefUrl: string, hrefTarget: string) => void;
  hrefTarget: string;
  hrefTitle: string;
  hrefUrl: string;
  image?: {
    alt: string;
    url: string;
  };
  previewCopy: string;
  title: string;
}
