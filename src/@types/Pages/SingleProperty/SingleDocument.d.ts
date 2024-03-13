import { PropertyType, DocumentType } from '@brixel-io/brixel-components/dist/@types/Model';

export interface SingleDocumentType {
  activeSingleProperty: PropertyType
  changeFieldValue: (field: string, value: string | object | Array) => void
  formValue: DocumentType
  lang: string
  handleUpdateDocument:(data: object) => void
  initForm:(data: object) => void
  setRequestDone:(data: boolean) => void
  initialValues: DocumentType
  isSmallLoading: {
    updateDoc: boolean
    saveData: boolean
  }
}
