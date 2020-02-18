import { BrixelRadioButton, FactsOptions, Validation } from '@brixel/brixel-components';
import { translateTo } from '../utils/translation';
import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
const { factsOptions } = FactsOptions;

export const InputSheets = (lang) => [
  {
    title: "Address",
    component: "Map",
    history: "locationInput",
    cardType: "location",
    inputs: [
      {
        label: 'What\'s the exact address of the property?',
        name: 'location.address',
        type: 'Map',
        validation: [Validation.required],
      },
    ],
  },
  {
    className: 'radioBtnImg',
    title: "Property",
    component: BrixelRadioButton,
    history: "propertyType",
    cardType: "propertyType",
    icons: true,
    inputs: [
      {
        className: 'radioBtnImg max-w-fix-md-464',
        label: '',
        name: 'properties.propertyType',
        validation: [Validation.required],
        options: [
          {
            label: translateTo(lang, "Apartment"),
            value: "Apartment",
            img: apartment,
          },
          {
            label: translateTo(lang, "House"),
            value: "House",
            img: house,

          }
        ],
      },
      {
        className: 'radioBtnImg max-w-fix-md-464',
        label: '',
        name: 'properties.building.typeHouseCode',
        validation: [Validation.required],
        options: factsOptions.typeHouseCode,
      },
    ],
    successMessage: translateTo(lang, 'Ok. Got it.')
  },
];
