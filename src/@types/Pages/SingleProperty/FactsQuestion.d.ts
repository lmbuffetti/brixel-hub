import {PropertyType, QuestionInputType, QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

export interface QuestionsListFactsInputs extends QuestionInputType {
  condition: {
    value?: string;
    noValue?: string;
    name: string;
  }
}

export interface QuestionsListFacts extends QuestionsListType {
  inputs: QuestionsListFactsInputs;
  title: string;
  classNameBox: string;
}

export interface FactsQuestionType {
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  formValue: PropertyType;
  initValues: PropertyType;
  lang: string;
  quest: QuestionsListFacts;
}
