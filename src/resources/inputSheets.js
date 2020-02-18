/* eslint-disable max-len */
import {
  BrixelInputScale, BrixelInputStepNumber,
  BrixelInputText,
  BrixelRadioButton, BrixelTextArea,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import { translateTo } from '../utils/translation';
import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
const { factsOptions } = FactsOptions;

export const InputSheets = (lang) => [
  // SECTION: PROPERTY TYPE
  {
    className: 'radioBtnImg',
    title: "Property Type",
    history: "propertyType",
    cardType: "propertyType",
    icons: true,
    inputs: [
      {
        component: BrixelRadioButton,
        className: 'radioBtnImg max-w-fix-md-464',
        label: '',
        name: 'properties.propertyType',
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
    ]
  },
  // SECTION: LOCATION
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
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Property door number',
        name: 'location.streetNumber',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'ZIP code',
        name: 'location.zip',
      },
    ],
  },
  // SECTION: PROPERTY
  {
    className: '',
    title: "Property",
    history: "property",
    cardType: "property ",
    icons: true,
    inputs: [
      {
        component: BrixelRadioButton,
        condition: {
          name: 'properties.propertyType',
          value: 'House'
        },
        className: '',
        label: 'What\'s the type of the house?',
        name: 'properties.building.typeHouseCode',
        options: factsOptions.typeHouseCode,
      },
      {
        component: BrixelRadioButton,
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        className: '',
        label: 'What\'s the type of the building?',
        name: 'properties.building.typeFlatBuildingCode',
        options: factsOptions.typeFlatBuildingCode,
      },
      {
        component: BrixelRadioButton,
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        className: '',
        label: 'What\'s the type of the apartment?',
        name: 'properties.building.typeFlatCode',
        options: factsOptions.typeFlatCode,
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the construction year?',
        name: 'properties.building.built',
        placeholder: "YYYY (ex.: 2020)",
      },
      {
        component: BrixelInputScale,
        className: '',
        label: 'What\'s the building quality of the whole building?',
        name: 'properties.building.quality',
        options: factsOptions.quality,
        modal: {
          hint: 'Know more about building quality',
          func: {
            state: true,
            title: 'Building quality',
            body: 'With this variable, the basic structure independent of its current condition is assessed. Pay attention to following points: the modes of construction; the quality of the materials used in construction, insulation, glazing; the kitchen and bath furnishing; the quality of outdoor and environment design; the quality of the plan (floor plan, lighting conditions, access to rooms etc.); quality of heatgeneration and distribution.' +
              'Exceptional quality: Very good noise insulation (within the building and from outside); heat insulation surpasses common standard; no problems with humidity or airtightness; very good indoor climate; ideal room layout with developable reserves; superior kitchen and sanitation; particular construction parts can easily be replaced; very good room proportions; versatile view from within and from outside; many green areas with exquisite planting and generous seating areas.' +
              'Good quality: Good noise insulation (within the building and from outside); heat insulation fulfill current standard; no problems with humidity or airtightness; good indoor climate; good room layout; contemporary kitchen and sanitation; particular construction parts can be replaced with little effort; good room proportions; good view from within and from outside; many green areas with harmonic planting and generous seating areas.' +
              'Fair quality: Noise insulation (within the building and from outside) with small defects; sufficient heat insulation; small problems with humidity or airtightness; sufficient indoor climate; fair room layout; obsolete but fully working kitchen and sanitation; particular construction parts can only be replaced with some effort; no architectural attractiveness; marginal view from within and from outside; appropriate green areas with ordinary planting and seating areas.' +
              'Poor quality: Noise insulation with defects; heat insulation is below average and not fulfilling current standard; obvious problems with humidity or airtightness; insufficient indoor climate; insufficient room layout; obsolete kitchen and sanitation with small defects; particular construction parts can only be replaced with much effort; missing architectural attractiveness; no view from within and from outside; litle green areas and seating areas.',
          },
        }
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is the property renovated?',
        name: 'properties.building.isPropertyRenovated',
        options: factsOptions.isPropertyRenovatedOptions,
        modal: {
          hint: 'Know more about renovations',
          func: {
            state: true,
            title: 'Renovations',
            body: 'If a major renovation of the object has taken place, please enter the corresponding year.' +
              'A major renovation is defined as work on the whole building. This includes the facade (heat insulation, windows), new heating, kitchen or bathroom. All investments within 3-5 years can be combined.' +
              'In order to be considered as a major renovation at least 15-20% of the building insurance value has to be reinvested.',
          },
        }
      },
      {
        condition: {
          name: 'properties.building.isPropertyRenovated',
          value: 1
        },
        component: BrixelInputText,
        className: '',
        label: 'If yes, when was the property last time renovated?',
        name: 'properties.building.renovated',
        placeholder: 'YYYY (ex.: 2020)',
      },
      {
        condition: {
          name: 'properties.building.isPropertyRenovated',
          value: 1
        },
        component: BrixelTextArea,
        className: '',
        label: 'What has been renovated?',
        name: 'properties.building.renovated',
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Are there some major renovation works needed within the next years?',
        name: 'properties.building.isNeedRenovation',
        options: factsOptions.yesNoOpt,
      },
      {
        condition: {
          name: 'properties.building.isNeedRenovation',
          value: true,
        },
        component: BrixelTextArea,
        className: '',
        label: 'What renovation works are needed within the next years?',
        name: 'description.needRenovation',
        options: factsOptions.yesNoOpt,
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What renovation works are needed within the next years?',
        name: 'description.needRenovation',
        options: factsOptions.yesNoOpt,
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment',
        },
        component: BrixelInputScale,
        className: '',
        label: 'What renovation works are needed within the next years?',
        name: 'properties.building.apartmentQuality',
        options: factsOptions.quality,
      },
      {
        component: BrixelInputScale,
        className: '',
        label: 'In which condition is the property?',
        name: 'properties.building.conditionCode',
        options: factsOptions.quality,
        modal: {
          hint: 'Building quality',
          func: {
            state: true,
            title: 'Renovations',
            body: 'To assess the condition of a building, consider the building shell (facade, windows, roof), the supporting structure, the general technical systems (heating, sanitation, principal electrical distribution, ventilation system, elevator) and the expansion of general surfaces (cellar rooms, washrooms and drying rooms, staircases etc.).' +
              'Exceptional quality: Everything is as good as new and fully working. The building is maximal 5 years old or is completely renovated within the last 3 years.' +
              'Good quality: Everything is fully working but show traces of use. The building is 5-15 years old or is completely renovated within the last 3-10 years.' +
              'Fair quality: Everything is already used and show clear traces of use and wear with small functional defects. The building is 15-30 years old or is completely renovated within the last 10-25 years. Partial replacement is needed.' +
              'Poor quality: Everything is already used and show clear traces of use with some parts having defects or not working anymore. The building is more than 30 years old or is completely renovated more than 25 years ago. Complete replacement is needed.',
          },
        }
      },
      {
        component: BrixelInputStepNumber,
        condition: {
          name: 'properties.propertyType',
          value: 'House'
        },
        className: '',
        label: 'How many floors does the house have?',
        name: 'properties.typology.numberOfHouseFloors',
      },
      {
        component: BrixelInputStepNumber,
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        className: '',
        label: 'Number of apartments in building',
        name: 'properties.typology.numberOfFlats',
      },
      {
        component: BrixelInputStepNumber,
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        className: '',
        label: 'How many floors are there in the whole building?',
        name: 'properties.typology.numberOfFloors',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the net living space of the property?',
        name: 'properties.typology.livingArea.value',
        type: "number"
      },
      {
        component: BrixelInputText,
        condition: {
          name: 'properties.propertyType',
          value: 'House'
        },
        className: '',
        label: 'What\'s the lot size? (m2)',
        name: 'properties.typology.lotArea.value',
        type: "number"
      },
      {
        component: BrixelInputText,
        condition: {
          name: 'properties.propertyType',
          value: 'House'
        },
        className: '',
        label: 'What\'s the house\'s volume? (m3)',
        name: 'properties.typology.constructedVolume.value',
        type: "number"
      },
      {
        component: BrixelRadioButton,
        condition: {
          name: 'properties.propertyType',
          value: 'House'
        },
        options: factsOptions.constructedVolumeCode,
        className: '',
        label: 'What\'s the house\'s volume? (m3)',
        name: 'properties.typology.constructedVolumeCode',
        type: "number"
      },
      {
        component: BrixelInputStepNumber,
        options: factsOptions.constructedVolumeCode,
        className: '',
        label: 'How many rooms does the house have?',
        name: 'properties.typology.bedrooms',
      },
      {
        component: BrixelInputStepNumber,
        options: factsOptions.constructedVolumeCode,
        className: '',
        label: 'How many bathrooms does the property have?',
        name: 'properties.typology.bathrooms',
      },
      {
        component: BrixelInputStepNumber,
        options: factsOptions.constructedVolumeCode,
        className: '',
        label: 'How many separate toilets does the property have?',
        name: 'properties.typology.separateToilets',
      },
      {
        component: BrixelRadioButton,
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        options: factsOptions.multiStoreyApartmentOptions,
        className: '',
        label: 'Does the apartment have multiple floors?',
        name: 'properties.building.multiStoreyApartment',
        type: "number"
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the surface of the balcony? (m2)',
        name: 'properties.typology.balconyArea.value',
        type: 'number',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the size of the garden? (m2)',
        name: 'properties.typology.gardenArea.value',
        type: 'number',
      },
      {
        component: BrixelInputStepNumber,
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        className: '',
        label: 'On which floor is the apartment\'s entrance?',
        name: 'properties.typology.floorNumber',
      },
      {
        component: BrixelInputScale,
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        className: '',
        label: 'What\'s the location quality of your apartment compared to the other ones in the building?',
        name: 'properties.building.qualityWithinBuilding',
        options: factsOptions.qualityWithinBuilding,
      },
      {
        component: BrixelInputScale,
        className: '',
        label: 'How good are the property\'s amenities?',
        name: 'properties.typology.qualityAmenities',
        options: factsOptions.amentitiesQuality,
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is the property a holiday home?',
        name: 'properties.building.secondaryResidence',
        options: factsOptions.secondaryResidenceOptions,
      },
    ],
  },
  // SECTION: SECONDARY ROOMS
];
