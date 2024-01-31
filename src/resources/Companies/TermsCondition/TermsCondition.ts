/* eslint-disable max-len */
import {BrixelRadioButton, Validation} from '@brixel-io/brixel-components/dist/form';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import translateTo from '../../../utils/translation';
import TermsConditionUBS from '../../../Pages/PackageFlow/TermsConditionUBS';
import TermsConditionBaloise from '../../../Pages/PackageFlow/TermsConditionBaloise';


// QUESTION LISTS
export const QuestionsList = (lang, company, isBuyer) => {
  let question: QuestionsListType[] = [];
  if (company.stub === 'ubs') {
    question = [
      {
        btnLabel: 'Accept',
        title: translateTo('Activate your UBS advantages now.', lang),
        history: 'ubsPolicy',
        cardType: 'ubsPolicy',
        footerWidth: 'max-w-fix-752',
        bulletPoints: {
          title: translateTo('What are my advantages?', lang),
          description: [
            translateTo('You get CHF 2\'000 discount', lang),
            translateTo('You pay only if the sale is successful', lang),
            translateTo('Your selling price is checked', lang),
          ],
        },
        text: [{
          title: translateTo('Transmission of data to UBS', lang),
          subtitle: translateTo('UBS\'s financing offers are only available to Swiss residents.', lang),
          description: `<span>${translateTo('I agree that my data (surname, first name, address, postal code, telephone number, e-mail address) is transmitted to UBS for reporting purposes. UBS will have access to the status assigned by Brixel for the properties that I want to sell (e.g. "registered", "reserved", "sold").', lang)}</span><span class="mt-1 dis-b">${translateTo('This consent can be revoked at any time, it being understood that such revocation may only be effective for the future. The revocation does not affect any data processing carried out prior to such revocation.', lang)}</span>`,
        }],
      },
    ]
    if (isBuyer) {
      question = [
        {
          cardType: 'loadComponent',
          history: 'ubsPolicy',
          className: 'max-w-fix-768 ml-a mr-a brdRadius bgWhite brdSmall brdText50',
          footerWidth: 'max-w-fix-768',
          component: TermsConditionUBS,
          hideContinueBtn: true,
          hideFooter: true,
        },
      ]
    }
  }
  if (company.stub === 'baloise') {
    if (isBuyer) {
      question = [
        {
          cardType: 'loadComponent',
          history: 'baloisePolicy',
          className: 'max-w-fix-768 ml-a mr-a brdRadius bgWhite brdSmall brdText50',
          footerWidth: 'max-w-fix-768',
          component: TermsConditionBaloise,
          hideContinueBtn: true,
          hideFooter: true,
        },
      ]
      /* question = [
        {
          btnLabel: 'Accept',
          title: translateTo('Benefit from the consulting services of our partner Baloise.', lang),
          history: 'baloisePolicy',
          cardType: 'baloisePolicy',
          footerWidth: 'max-w-fix-752',
          text: [{
            title: translateTo('Transmission of data to Baloise Insurance.', lang),
            description: translateTo('I hereby agree that my data (Surname, first name, phone number, e-mail) is transmitted to Baloise Insurance Ltd. and Baloise Bank Ltd. so that I can receive newsletters or telephone contact regarding home financing, pension provision and assets. Furthermore, in order to check whether I am already a customer of Baloise Insurance Ltd. and/or Baloise Bank Ltd., I authorize Baloise Insurance Ltd. and Baloise Bank Ltd. to compare with my relevant data held by Baloise Insurance Ltd. and Baloise Bank Ltd. You can revoke this consent at any time in the future. If you no longer wish to receive the newsletter from Baloise Insurance Ltd and Baloise Bank Ltd, you can cancel this by clicking on the link provided in the respective newsletter. The revocation of consent does not affect the legality of the data processing carried out on the basis of the consent until revocation.', lang),
          }],
        },
      ] */
    } else {
      question = [
        {
          title: translateTo('Activate your Baloise advantages now.', lang),
          history: 'baloiseInfo',
          cardType: 'baloiseInfo',
          footerWidth: 'max-w-fix-752',
          inputs: [
            {
              component: BrixelRadioButton,
              validation: [Validation.required],
              ReduxFieldClass: 'py-4 py-lg-0 w-perc-100',
              classNameBox: 'brdRadius max-w-fix-912 w-perc-100 px-2 px-sm-6 brdRadius fieldHolder bgWhite m-a',
              className: '',
              large: true,
              name: 'baloiseInfo',
              label: translateTo('What is your customer relationship with Baloise?', lang),
              bulletPoints: {
                title: translateTo('What are my advantages?', lang),
                description: [
                  translateTo('You get CHF 2\'000 discount', lang),
                  translateTo('You pay only if the sale is successful', lang),
                  translateTo('You will be advised on your existing mortgage', lang),
                ],
              },
              options: [
                {
                  label: translateTo('I am a customer of Baloise Insurance', lang),
                  value: 'baloiseInsurance',
                },
                {
                  label: translateTo('I am a customer at Baloise Bank', lang),
                  value: 'baloiseBank',
                },
                {
                  label: translateTo('I am already a client of both', lang),
                  value: 'both',
                },
                {
                  label: translateTo('I am not yet a Baloise customer', lang),
                  value: 'notClient',
                },
              ],
            },
          ],
        },
      ];
      question.push(
        {
          condition: [{
            name: 'baloiseInfo',
            value: 'both',
          },
          ],
          title: translateTo('Almost there. Please accept the privacy policy.', lang),
          history: 'baloisePolicy',
          cardType: 'baloisePolicy',
          footerWidth: 'max-w-fix-752',
          text: [{
            title: translateTo('Transmission of data to Baloise Insurance.', lang),
            description: translateTo('I hereby agree that my data (last name, first name, street, house number, zip code, phone number, e-mail) is transmitted to Basler Versicherung AG to check if I am eligible for the discount by comparing the data with my relevant data held by Basler Versicherung AG and to add the information that I use the Brixel service to my customer profile at Basler Versicherung AG to better meet my needs. You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing based on the consent until revocation.', lang),
          },
          {
            title: translateTo('Transmission of data to Baloise Bank.', lang),
            description: translateTo('I hereby agree that my data (last name, first name, street, house number, zip code, telephone number, e-mail) is transmitted to Baloise Bank AG to check if I am eligible for the discount by comparing the data with my relevant data held by Baloise Bank AG, and to add the information that I use the Brixel service to my customer profile at Baloise Bank AG to better meet my needs. For the aforementioned purposes, I release Baloise Bank AG as well as third parties commissioned by it from banking secrecy. You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing carried out based on the consent until revocation.', lang),
          }],
        },
        {
          condition: [{
            name: 'baloiseInfo',
            value: 'notClient',
          },
          ],
          title: translateTo('Almost there. Please accept the privacy policy.', lang),
          history: 'baloisePolicy',
          cardType: 'baloisePolicy',
          footerWidth: 'max-w-fix-752',
          text: [{
            title: translateTo('Transmission of data to Baloise Insurance.', lang),
            description: translateTo('I hereby agree that my data (last name, first name, street, house number, zip code, phone number, e-mail) is transmitted to Basler Versicherung AG to check if I am eligible for the discount by comparing the data with my relevant data held by Basler Versicherung AG and to add the information that I use the Brixel service to my customer profile at Basler Versicherung AG to better meet my needs. You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing based on the consent until revocation.', lang),
          },
          {
            title: translateTo('Transmission of data to Baloise Bank.', lang),
            description: translateTo('I hereby agree that my data (last name, first name, street, house number, zip code, telephone number, e-mail) is transmitted to Baloise Bank AG to check if I am eligible for the discount by comparing the data with my relevant data held by Baloise Bank AG, and to add the information that I use the Brixel service to my customer profile at Baloise Bank AG to better meet my needs. For the aforementioned purposes, I release Baloise Bank AG as well as third parties commissioned by it from banking secrecy. You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing carried out based on the consent until revocation.', lang),
          }],
        },
        {
          condition: [{
            name: 'baloiseInfo',
            value: 'baloiseInsurance',
          },
          ],
          title: translateTo('Almost there. Please accept the privacy policy.', lang),
          history: 'baloisePolicy',
          cardType: 'baloisePolicy',
          footerWidth: 'max-w-fix-752',
          text: [{
            title: translateTo('Transmission of data to Baloise Insurance.', lang),
            description: translateTo('I hereby agree that my data (last name, first name, street, house number, zip code, phone number, e-mail) is transmitted to Basler Versicherung AG to check if I am eligible for the discount by comparing the data with my relevant data held by Basler Versicherung AG and to add the information that I use the Brixel service to my customer profile at Basler Versicherung AG to better meet my needs. You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing based on the consent until revocation.', lang),
          }],
        },
        {
          condition: [{
            name: 'baloiseInfo',
            value: 'baloiseBank',
          },
          ],
          title: translateTo('Almost there. Please accept the privacy policy.', lang),
          history: 'baloisePolicy',
          cardType: 'baloisePolicy',
          footerWidth: 'max-w-fix-752',
          text: [{
            title: translateTo('Transmission of data to Baloise Bank.', lang),
            description: translateTo('I hereby agree that my data (last name, first name, street, house number, zip code, telephone number, e-mail) is transmitted to Baloise Bank AG to check if I am eligible for the discount by comparing the data with my relevant data held by Baloise Bank AG, and to add the information that I use the Brixel service to my customer profile at Baloise Bank AG to better meet my needs. For the aforementioned purposes, I release Baloise Bank AG as well as third parties commissioned by it from banking secrecy. You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing carried out based on the consent until revocation.', lang),
          }],
        },
      );

    }
  }
  question.push({
    skipResume: true,
    history: 'savingData',
    cardType: 'createProfile',
    toSave: true,
  });
  return question;
};
