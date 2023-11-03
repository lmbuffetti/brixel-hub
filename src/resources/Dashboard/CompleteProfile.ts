/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelRadioButton, BrixelSwitchButton,
  Validation,
} from '@brixel-io/brixel-components/dist/form';
import translateTo from '../../utils/translation';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import * as buyerFields from './CompleteProfileFields';
import {configureStore} from '../../store';
import get from 'lodash/get';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';

const {CompleteProfileFields} = buyerFields;

// QUESTION LISTS
export const QuestionsList: (lang: string, formName: string, pageStub: string) => QuestionsListType[] = (lang, formName = '', pageStub) => {
  let formValue = {
    financingProof: '',
    watch3dTour: '',
  };
  if (configureStore) {
    formValue = get(configureStore.getState(), `brixelForm[${formName}].values`, []);
  }

  const firstTimeBuyer = CompleteProfileFields.buyerStatus.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));

  const involvedPurchaseProperty = CompleteProfileFields.involvedPurchaseProperty.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));

  const propertyLocationRelationship = CompleteProfileFields.propertyLocationRelationship.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));

  const propertyAppealed = CompleteProfileFields.propertyAppealed.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));


  const question: QuestionsListType[] = [
    {
      title: translateTo('Give Brixel more details', lang),
      subtitle: translateTo('Complete your buyer profile in seconds and get ahead of other visitors.', lang),
      history: 'profile',
      footerWidth: 'max-w-fix-640',
      className: 'max-w-fix-640 bgWhite p-3 brdRadius m-a',
      inputs: [
        {
          component: BrixelRadioButton,
          className: 'radioBtnImg',
          label: translateTo('What is your buyer status?', lang),
          name: 'buyerStatus',
          validation: [Validation.required],
          options: firstTimeBuyer,
        },
        {
          component: BrixelRadioButton,
          className: 'radioBtnImg',
          label: translateTo('Who will be involved in the purchase of the property?', lang),
          name: 'involvedPurchaseProperty',
          validation: [Validation.required],
          options: involvedPurchaseProperty,
        },
        {
          component: BrixelRadioButton,
          className: 'radioBtnImg ml-0',
          label: translateTo('Do you have proof of financing?', lang),
          name: 'financingProof',
          cardLayout: true,
          isHorizontal: true,
          svgSupport: true,
          icons: true,
          tooltip: {
            description: translateTo('A proof of financing (also called financing certificate) is a non-binding assessment of your financial situation. You can use it to prove to us that you can afford the house or apartment.', lang),
          },
          cardSmall: true,
          pdClass: 'py-1',
          validation: [Validation.required],
          options: [
            {
              label: translateTo('Yes', lang),
              value: 'yes',
              color: 'blue',
            },
            {
              label: translateTo('No', lang),
              value: 'no',
              color: 'blue',
            },
          ],
        },
      ],
      successMessage: translateTo('Ok. Got it.', lang),
    },
  ];
  if (question[0].inputs) {
    if (formValue.financingProof === 'yes') {
      question[0].inputs.push({
        component: BrixelSwitchButton,
        className: 'radioBtnImg',
        label: translateTo('I want to apply for one', lang),
        name: 'applyFinancingProof',
        validation: [Validation.required],
      });
    }
    question[0].inputs.push({
      component: BrixelRadioButton,
      className: 'radioBtnImg',
      label: translateTo('What is your relationship to the property’s location?', lang),
      name: 'relationshipLocationProperty',
      validation: [Validation.required],
      options: propertyLocationRelationship,
    });

    question[0].inputs.push({
      component: BrixelRadioButton,
      className: 'radioBtnImg ml-0',
      label: translateTo('Did you already watch the virtual tour?', lang),
      name: 'watch3dTour',
      cardLayout: true,
      isHorizontal: true,
      svgSupport: true,
      icons: true,
      cardSmall: true,
      pdClass: 'py-1',
      validation: [Validation.required],
      options: [
        {
          label: translateTo('Yes', lang),
          value: 'yes',
          color: 'blue',
        },
        {
          label: translateTo('No', lang),
          value: 'no',
          color: 'blue',
        },
      ],
    });
    if (question[0]?.inputs && question[0].inputs[question[0].inputs.length - 1] && formValue.watch3dTour === 'no') {
      question[0].inputs[question[0].inputs.length - 1].modal = {
        message: `<a class="link" href="${baseByData.pageUrl}${lang}/${pageStub}/explore/tour" target="_blank" class="linkIcn"><span>${translateTo('Go to 3D tour', lang)}</span><i class="icon-link" /></a>`,
      }
    }

    question[0].inputs.push({
      component: BrixelCheckbox,
      className: 'radioBtnImg',
      label: translateTo('What about the property appealed most to you?', lang),
      icons: true,
      name: 'propertyAppealed',
      validation: [Validation.required],
      options: propertyAppealed,
    });

  }
  question.push(
    {
      hideSearchProfile: true,
      history: 'savingData',
      cardType: 'createProfile',
      toSave: true,
    },
  );
  return question;
};
