/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelInputText,
  BrixelRadioButton,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeAssessor from '../Pages/GameHistory/Assessor/ResumeAssessor';
import { translateTo } from '../utils/translation';
import mediaImg1 from '../images/Media/media_1.png';

const { factsOptions } = FactsOptions;

export const MediaQuestions = (lang = 'en') => [
  {
    title: "Add photos once for all",
    img: mediaImg1,
    description: 'A picture is worth a thousands words. Upload some nice pictures to put your property in the spot light.',
    vCentered: true,
    history: "constructionMaterials",
    cardType: "constructionMaterials",
  },
  {
    title: "Add Floor Plans once for all",
    img: mediaImg1,
    description: 'A picture is worth a thousands words. Upload some nice pictures to put your property in the spot light.',
    vCentered: true,
    history: "constructionMaterials",
    cardType: "constructionMaterials",
  },
  {
    title: "Add Documents once for all",
    img: mediaImg1,
    description: 'A picture is worth a thousands words. Upload some nice pictures to put your property in the spot light.',
    vCentered: true,
    history: "constructionMaterials",
    cardType: "constructionMaterials",
  },
];
