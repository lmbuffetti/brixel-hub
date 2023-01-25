import {LoggedUserType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface PhotosPageType {
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, value: object) => void,
  formValue: PropertyType;
  handleDeleteImg: (data: object) => void,
  handleMultiUploadImg: (data: object) => void,
  imageType: {
    id: string;
    name: string;
  }[];
  isSmallLoading: {
    uploadMedia: boolean;
    deleteMedia: boolean;
  };
  lang: string;
  loggedInUser: LoggedUserType;
  windowDimensions: {
    width: number;
    height: number;
  };
}
