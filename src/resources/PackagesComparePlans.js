import checkGreen from '../images/Upgrade/check-green.svg';
import checkBlue from '../images/Upgrade/check-blue.svg';
import checkRed from '../images/Upgrade/check-red.svg';
import checkBlack from '../images/Upgrade/check-black.svg';

export const PackagesComparePlansTable = [
  {
    title: 'Brixel Hub',
    td: {
      basic: { img: checkGreen },
      private: { img: checkBlue },
      premium: { img: checkRed },
      one: { img: checkBlack },
    },
  },
  {
    title: 'Pre-market',
    td: {
      basic: { img: checkGreen },
      private: { img: checkBlue },
      premium: { img: checkRed },
      one: { img: checkBlack },
    },
  },
  {
    title: 'Brixel Page',
    td: {
      basic: { img: checkGreen },
      private: { img: checkBlue },
      premium: { img: checkRed },
      one: { img: checkBlack },
    },
  },
  {
    title: 'Listings',
    td: {
      basic: { img: checkGreen },
      private: { img: checkBlue, desc: '3 months listings' },
      premium: { img: checkRed, desc: '6 months listings' },
      one: { img: checkBlack, desc: '12 months listings' },
    },
  },
  {
    title: 'Support',
    td: {
      basic: { img: checkGreen, desc: 'Online' },
      private: { img: checkBlue, desc: 'Online' },
      premium: { img: checkRed, desc: 'Backoffice' },
      one: { img: checkBlack, desc: 'Expert' },
    },
  },
  {
    title: 'Full estimation',
    td: {
      private: null,
      premium: { img: checkRed },
      one: { img: checkBlack },
    },
  },
  {
    title: 'Photos',
    td: {
      private: null,
      premium: { img: checkRed },
      one: { img: checkBlack },
    },
  },
  {
    title: 'Floorplans',
    td: {
      private: null,
      premium: { img: checkRed },
      one: { img: checkBlack },
    },
  },
  {
    title: '3D tour',
    td: {
      private: null,
      premium: { img: checkRed },
      one: { img: checkBlack },
    },
  },
  {
    title: 'PDF factsheet',
    td: {
      private: null,
      premium: { img: checkRed },
      one: { img: checkBlack },
    },
  },
  {
    title: 'Prospects management',
    td: {
      private: null,
      premium: { img: checkRed },
      one: { img: checkBlack },
    },
  },
  {
    title: 'Negotiating support',
    td: {
      private: null,
      premium: null,
      one: { img: checkBlack },
    },
  },
  {
    title: 'Contract handling',
    td: {
      private: null,
      premium: null,
      one: { img: checkBlack },
    },
  },
  {
    title: 'Support up to the notary',
    td: {
      private: null,
      premium: null,
      one: { img: checkBlack },
    },
  },
  {
    title: 'Showings',
    td: {
      private: null,
      premium: null,
      one: { img: checkBlack, desc: 'Paid add-on' },
    },
  },
];
