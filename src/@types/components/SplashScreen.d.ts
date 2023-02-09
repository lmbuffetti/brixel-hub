export interface SplashScreenType {
  children?: React.ReactNode;
  className?: string;
  closeLink?: string;
  closeOutside?: boolean;
  type?: string;
  wizard: {
    type: string;
  };
}
