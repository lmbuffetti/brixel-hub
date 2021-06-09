/* eslint-disable max-len */
import {
  BrixelRadioButton,
  Validation,
} from '@brixel/brixel-components';
import { translateTo } from '../utils/translation';

import homesSvg from '../images/getstarted/svgs/homes.svg';
// QUESTION LISTS
export const QuestionsList = (lang) => [
  {
    title: translateTo(lang, 'Hello, what can we do for you?'),
    history: '',
    vCentered: true,
    bgImg: homesSvg,
    inputs: [{
      component: BrixelRadioButton,
      className: 'radioBtnImg',
      ReduxFieldClass: '',
      label: '',
      name: 'userType',
      validation: [Validation.required],
      icons: true,
      cardLayout: true,
      svgSupport: true,
      pdClass: '',
      isHorizontal: true,
      options: [
        {
          label: 'I want to start <b>selling</b>',
          value: 'seller',
          img: "<svg width='100%' height='100%' preserveAspectRatio='xMidYMid meet' class='svg-content' viewBox='0 0 162 165' fill='none' xmlns='http://www.w3.org/2000/svg'><circle class='willtrans blueHover' fill='#D7F0F1' cx='81' cy='81' r='81' /><g clip-path='url(#clip0)'><path d='M127.1 164.2H34.9c-8.3 0-14.9-7.1-14.9-16 0-8.8 6.7-16 14.9-16H127c8.3 0 14.9 7.1 14.9 16 .1 8.8-6.6 16-14.8 16z' fill='#004A98'/><path d='M81.1 57H43.5v39.5h37.6V57z' fill='#84DADE'/><path d='M118.8 96.5H81.1V57L100 37.2 118.8 57v39.5z' fill='#D8EDF0'/><path d='M62.3 37.2L43.5 57h37.6L100 37.2H62.3z' fill='#004A98'/><path d='M57.7 66.3h-6.5v6.5h6.5v-6.5z' fill='#D8EDF0'/><path d='M72.4 66.3h-6.5v6.5h6.5v-6.5z' fill='#004A98'/><path d='M57.7 82.6h-6.5v6.5h6.5v-6.5zM72.4 82.6h-6.5v6.5h6.5v-6.5z' fill='#D8EDF0'/><path d='M97.9 66.3h-6.5v6.5h6.5v-6.5z' fill='#84DADE'/><path d='M131.4 21.4a4 4 0 100-8 4 4 0 000 8zM86.7 150.7h-53c-1.2 0-2.2-1-2.2-2.2 0-1.2 1-2.2 2.2-2.2h53.1c1.2 0 2.2 1 2.2 2.2-.1 1.2-1.1 2.2-2.3 2.2zM95.3 150.8a2.3 2.3 0 100-4.6 2.3 2.3 0 000 4.6zM102.8 150.8a2.3 2.3 0 100-4.6 2.3 2.3 0 000 4.6z' fill='#fff'/><path d='M115.5 148.1l4.6 4.5 8.3-8.2' stroke='#fff' stroke-width='3' stroke-miterlimit='10' stroke-linejoin='round'/><path d='M131.1 127.1h-100c-5.5 0-10-4.5-10-10V14c0-5.5 4.5-10 10-10h100c5.5 0 10 4.5 10 10v103.1c0 5.5-4.4 10-10 10z' fill='#1ECAD3'/><path d='M131.1 127.1h-100c-5.5 0-10-4.5-10-10V96.5h120v20.6c0 5.5-4.4 10-10 10z' fill='#9FE1E5'/><path d='M131.1 127.1h-100c-5.5 0-10-4.5-10-10V14c0-5.5 4.5-10 10-10h100c5.5 0 10 4.5 10 10v103.1c0 5.5-4.4 10-10 10z' fill='#1ECAD3'/><path d='M131.1 127.1h-100c-5.5 0-10-4.5-10-10V96.5h120v20.6c0 5.5-4.4 10-10 10z' fill='#9FE1E5'/><path d='M81.1 57H43.5v39.5h37.6V57z' fill='#84DADE'/><path d='M118.8 96.5H81.1V57L100 37.2 118.8 57v39.5z' fill='#D8EDF0'/><path d='M62.3 37.2L43.5 57h37.6L100 37.2H62.3z' fill='#004A98'/><path d='M57.7 66.3h-6.5v6.5h6.5v-6.5z' fill='#D8EDF0'/><path d='M72.4 66.3h-6.5v6.5h6.5v-6.5z' fill='#004A98'/><path d='M57.7 82.6h-6.5v6.5h6.5v-6.5zM72.4 82.6h-6.5v6.5h6.5v-6.5z' fill='#D8EDF0'/><path d='M97.9 66.3h-6.5v6.5h6.5v-6.5z' fill='#84DADE'/><path d='M128.4 21.4a4 4 0 100-8 4 4 0 000 8z' fill='#fff'/></g><defs><clipPath id='clip0'><path fill='#fff' transform='translate(20 4)' d='M0 0h122v160.2H0z'/></clipPath></defs></svg>",
          color: 'blue',
        },
        {
          label: 'I want to <b>estimate</b> a property',
          value: 'estimation',
          img: "<svg preserveAspectRatio='xMidYMid meet' class='svg-content' width='100%' height='100%' viewBox='0 0 162 169' fill='none' xmlns='http://www.w3.org/2000/svg'><circle class='willTrans greenHover' opacity='.6' cx='81' cy='81' r='81' fill='#A1DED2'/><path d='M122 134.1H22c-5.5 0-10-4.5-10-10V21c0-5.5 4.5-10 10-10h100c5.5 0 10 4.5 10 10v103.1c0 5.5-4.5 10-10 10z' fill='#009579'/><path d='M122 134.1H22c-5.5 0-10-4.5-10-10v-20.6h120v20.6c0 5.5-4.5 10-10 10z' fill='#A1DED2'/><path d='M122 134.1H22c-5.5 0-10-4.5-10-10V21c0-5.5 4.5-10 10-10h100c5.5 0 10 4.5 10 10v103.1c0 5.5-4.5 10-10 10z' fill='#009579'/><path d='M122 134.1H22c-5.5 0-10-4.5-10-10v-20.6h120v20.6c0 5.5-4.5 10-10 10z' fill='#A1DED2'/><path d='M119.2 28.4a4 4 0 100-8 4 4 0 000 8z' fill='#fff'/><path d='M67.6 64.1H30v39.5h37.6V64.1z' fill='#A1DED2'/><path d='M105.3 103.6H67.6V64.1l18.8-19.8 18.9 19.8v39.5z' fill='#D0EEE8'/><path d='M48.8 44.3L30 64.1h37.6l18.8-19.8H48.8z' fill='#00615C'/><path d='M44.2 73.3h-6.5v6.5h6.5v-6.5z' fill='#D0EEE8'/><path d='M58.8 73.3h-6.5v6.5h6.5v-6.5z' fill='#00615C'/><path d='M44.2 89.7h-6.5v6.5h6.5v-6.5zM58.8 89.7h-6.5v6.5h6.5v-6.5z' fill='#D0EEE8'/><path d='M84.4 73.3h-6.5v6.5h6.5v-6.5z' fill='#A1DED2'/><path d='M143.2 168.3H97.4c-5.5 0-10-4.5-10-10v-54.7h65.8v54.7c0 5.5-4.4 10-10 10z' fill='#00615C'/><path d='M153.2 103.6H87.4V88.2c0-5.5 4.5-10 10-10h45.8c5.5 0 10 4.5 10 10v15.4z' fill='#A1DED2'/><path d='M106.7 123.3h-9.4c-1.1 0-2-.9-2-2v-9.4c0-1.1.9-2 2-2h9.4c1.1 0 2 .9 2 2v9.4c0 1.1-.9 2-2 2zM125 123.3h-9.4c-1.1 0-2-.9-2-2v-9.4c0-1.1.9-2 2-2h9.4c1.1 0 2 .9 2 2v9.4c0 1.1-.9 2-2 2zM143.4 123.3H134c-1.1 0-2-.9-2-2v-9.4c0-1.1.9-2 2-2h9.4c1.1 0 2 .9 2 2v9.4c0 1.1-.9 2-2 2zM106.7 141.9h-9.4c-1.1 0-2-.9-2-2v-9.4c0-1.1.9-2 2-2h9.4c1.1 0 2 .9 2 2v9.4c0 1.1-.9 2-2 2zM125 141.9h-9.4c-1.1 0-2-.9-2-2v-9.4c0-1.1.9-2 2-2h9.4c1.1 0 2 .9 2 2v9.4c0 1.1-.9 2-2 2zM106.7 160.4h-9.4c-1.1 0-2-.9-2-2V149c0-1.1.9-2 2-2h9.4c1.1 0 2 .9 2 2v9.4c0 1.1-.9 2-2 2zM125 160.4h-9.4c-1.1 0-2-.9-2-2V149c0-1.1.9-2 2-2h9.4c1.1 0 2 .9 2 2v9.4c0 1.1-.9 2-2 2z' fill='#D0EEE8'/><path d='M143.4 160.4H134c-1.1 0-2-.9-2-2v-27.9c0-1.1.9-2 2-2h9.4c1.1 0 2 .9 2 2v27.9c0 1.1-.9 2-2 2z' fill='#009579'/><path d='M125.3 94.2H97.2c-1.2 0-2.2-1-2.2-2.2 0-1.2 1-2.2 2.2-2.2h28.1c1.2 0 2.2 1 2.2 2.2 0 1.2-1 2.2-2.2 2.2zM133.8 94.3a2.3 2.3 0 100-4.6 2.3 2.3 0 000 4.6zM141.3 94.3a2.3 2.3 0 100-4.6 2.3 2.3 0 000 4.6z' fill='#fff'/></svg>",
          color: 'green',
        },
        {
          label: 'I want to <b>buy</b> a property',
          value: 'buyer',
          img: "<svg width='100%' height='100%' preserveAspectRatio='xMidYMid meet' class='svg-content' viewBox='0 0 171 170' fill='none' xmlns='http://www.w3.org/2000/svg'><circle class='willTrans redHover' opacity='.6' cx='81' cy='81' r='81' fill='#FFB1B9'/><g clip-path='url(#clip0)'><path d='M30 10.1h100c5.5 0 10 4.5 10 10v124c0 5.5-4.5 10-10 10H30c-5.5 0-10-4.5-10-10v-124c0-5.5 4.5-10 10-10z' fill='#FF595A'/><path d='M140 81.4H20V20c0-5.5 4.5-10 10-10h100c5.5 0 10 4.5 10 10v61.4z' fill='#FFD8DC'/><path d='M128 98.9H34.7v4.4H128v-4.4zM128 115.5H34.7v4.4H128v-4.4zM70.1 132.1H34.7v4.4h35.4v-4.4z' fill='#fff'/><path d='M154.2 169.8H92.8c-8.8 0-16-7.1-16-16 0-8.8 7.1-16 16-16h61.4c8.8 0 16 7.1 16 16s-7.2 16-16 16z' fill='#72253D'/><path d='M119.4 156H91.3c-1.2 0-2.2-1-2.2-2.2 0-1.2 1-2.2 2.2-2.2h28.1c1.2 0 2.2 1 2.2 2.2-.1 1.3-1 2.2-2.2 2.2zM127.9 156.1a2.3 2.3 0 100-4.6 2.3 2.3 0 000 4.6zM135.4 156.1a2.3 2.3 0 100-4.6 2.3 2.3 0 000 4.6zM154.362 154.637l-2.121 2.121 4.595 4.597 2.122-2.121-4.596-4.597z' fill='#fff'/><path d='M150 158.7c-1.6 0-3.3-.6-4.5-1.9-1.2-1.2-1.9-2.8-1.9-4.5 0-1.7.7-3.3 1.9-4.5 1.2-1.2 2.8-1.9 4.5-1.9 1.7 0 3.3.7 4.5 1.9 2.5 2.5 2.5 6.5 0 9-1.2 1.3-2.9 1.9-4.5 1.9zm0-9.8c-.9 0-1.8.4-2.4 1-.6.6-1 1.5-1 2.4 0 .9.4 1.8 1 2.4 1.3 1.3 3.5 1.3 4.8 0 1.3-1.3 1.3-3.5 0-4.8-.7-.6-1.5-1-2.4-1z' fill='#fff'/><path fill-rule='evenodd' clip-rule='evenodd' d='M87.9 40.5c1.5-2.6 4.1-4.4 7-4.4.6 0 1.2.1 1.8.2 2.2.6 4.4.2 6.3-1.1 2.4-1.6 5.1-2.5 8.1-2.5 5.4 0 10.1 3 13.2 7.7H87.9v.1z' fill='#fff'/><path d='M67.5 47H34.7v34.4h32.8V47z' fill='#FFB1B9'/><path d='M100.4 81.4H67.6V47L84 29.7 100.4 47v34.4z' fill='#FFEFF1'/><path d='M51.1 29.7L34.7 47h32.9L84 29.7H51.1z' fill='#72253D'/><path d='M47.1 55h-5.7v5.7h5.7V55z' fill='#FFEFF1'/><path d='M59.9 55h-5.7v5.7h5.7V55z' fill='#72253D'/><path d='M47.1 69.3h-5.7V75h5.7v-5.7zM59.9 69.3h-5.7V75h5.7v-5.7z' fill='#FFEFF1'/><path d='M82.2 55h-5.7v5.7h5.7V55z' fill='#FFB1B9'/></g><defs><clipPath id='clip0'><path fill='#fff' transform='translate(20 10)' d='M0 0h150.2v159.8H0z'/></clipPath></defs></svg>",
          color: 'red',
        },
      ],
    }],
    successMessage: translateTo(lang, 'Ok. Got it.'),
  },
  {
    history: 'savingData',
    cardType: 'updateProfile',
    toSave: true,
    action: 'updateUser',
  },
];
