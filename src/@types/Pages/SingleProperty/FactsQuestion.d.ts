import {PropertyType, QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FactsQuestionType {
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  formValue: PropertyType;
  initValues: PropertyType;
  lang: string;
  quest: QuestionsListType;
}
