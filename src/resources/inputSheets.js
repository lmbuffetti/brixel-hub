/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelExtraFeature, BrixelInputQuality,
  BrixelInputScale, BrixelInputStepNumber,
  BrixelInputText,
  BrixelRadioButton, BrixelSelect, BrixelTextArea,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import { translateTo } from '../utils/translation';
import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
import { Field } from 'redux-form';
import React from 'react';
const { factsOptions } = FactsOptions;

const formatPrice = (value) => {
  if (!value) return '';
  return Number(value).toLocaleString('de-CH');
};

const normalizePrice = (value) => {
  if (value.length === 0) return '';
  return Number(value.replace(/\D/g, ''));
};

export const InputSheets = (lang) => [
  // SECTION: PROPERTY TYPE
  {
    className: 'radioBtnImg',
    title: "Property Type",
    history: "propertyType",
    cardType: "propertyType",
    inputs: [
      {
        icons: true,
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
  {
    title: "Secondary rooms",
    history: "secondaryRooms",
    cardType: "secondaryRooms",
    inputs: [
      {
        component: BrixelRadioButton,
        condition: {
          name: 'properties.propertyType',
          value: 'House'
        },
        className: '',
        label: 'Is the attic expandable?',
        name: 'properties.building.expandableAttic',
        options: factsOptions.expandableAttic,
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the size of the attic?',
        name: 'properties.building.expandableAtticArea.value',
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a basement?',
        name: 'properties.typology.basement',
        options: factsOptions.basementOptions,
      },
      {
        condition: {
          name: 'properties.typology.basement',
          value: true,
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the size of the basement? (m2)',
        name: 'properties.typology.basementArea.value',
        type: 'number',
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a storeroom?',
        name: 'properties.building.properties.typology.storeroom',
        options: factsOptions.yesNoOpt,
      },
      {
        condition: {
          name: 'properties.building.properties.typology.storeroom',
          value: true,
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the size of the storeroom?',
        name: 'properties.building.properties.typology.storeroomArea.value',
        type: 'number',
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there some other collective used spaces?',
        name: 'properties.typology.collectiveSpaces',
        options: factsOptions.yesNoOpt,
      },
      {
        condition: {
          name: 'properties.typology.collectiveSpaces',
          value: true,
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the size of collective used spaces?',
        name: 'properties.typology.collectiveSpacesArea.value',
        type: 'number',
      },
    ],
  },
  // SECTION: PARKING
  {
    title: "Parking",
    history: "parking",
    cardType: "parking",
    inputs: [
      {
        component: BrixelInputStepNumber,
        className: '',
        label: 'How many garage parking lots belong to the property?',
        name: 'properties.parking.garage',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Price per garage parking lot',
        name: 'properties.parking.garagePrice',
      },
      {
        component: BrixelInputStepNumber,
        className: '',
        label: 'How many external parking lots belong to the property?',
        name: 'properties.parking.outside',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Price per external parking lot',
        name: 'properties.parking.outsidePrice',
      },
      {
        component: BrixelInputStepNumber,
        className: '',
        label: 'How many underground parking lots belong to the property?',
        name: 'properties.parking.underground',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Price per underground parking lot',
        name: 'properties.parking.undergroundPrice',
      },
    ],
  },
  // SECTION: EXTRA FEATURE
  {
    title: "Extra features",
    history: "extraFeature",
    cardType: "extraFeature",
    inputs: [
      {
        component: BrixelExtraFeature,
        className: '',
        label: 'Extra features',
        name: 'properties.extraFeatures',
        options: factsOptions.BrixelExtraFeature,
      },
    ],
  },
  // SECTION: FACILITES & MATERIALS
  {
    title: "Facilities & materials",
    history: "facilitiesMaterials",
    cardType: "facilitiesMaterials",
    inputs: [
      {
        component: BrixelCheckbox,
        className: '',
        label: 'What\'s the heating system?',
        name: 'properties.energy.heating',
        options: factsOptions.heating
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'House'
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the boiler capacity?',
        name: 'properties.energy.boiler.capacity',
        type: 'number',
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'House'
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the boiler type?',
        name: 'properties.energy.boiler.type',
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a solar plant?',
        name: 'properties.energy.solar',
        options: factsOptions.solarOptions,
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there an air conditioner?',
        name: 'properties.energy.ac',
        options: factsOptions.acOptions,
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a solar plant?',
        name: 'properties.energy.solar',
        options: factsOptions.solarOptions,
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a window insulation?',
        name: 'properties.building.windows.insulation',
        options: factsOptions.windowsInsulationOptions,
      },
      {
        component: BrixelCheckbox,
        className: '',
        label: 'What is the material of the windows?',
        name: 'properties.building.windows.materials',
        options: factsOptions.windows,
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the material of the blinds?',
        name: 'properties.building.blinds.materials',
      },
      {
        component: BrixelInputQuality,
        className: '',
        label: 'What\'s the energy efficiency of the property?',
        name: 'properties.energy.efficiency',
        options: factsOptions.energyEfficiencyOptions,
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is the property Minergie certified?',
        name: 'properties.energy.minergieCertified',
        options: factsOptions.minergieCertifiedOptions,
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the material of the floors?',
        name: 'properties.building.floors.materials',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the equipment and materials in the kitchen?',
        name: 'properties.building.kitchen.materials',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the equipments and materials in the bathrooms?',
        name: 'properties.building.bathrooms.materials',
      },
    ],
  },
  // SECTION: LAND REGISTER
  {
    title: "Land register",
    history: "landRegister",
    cardType: "landRegister",
    inputs: [
      {
        component: BrixelInputText,
        className: '',
        label: 'What are the seller\'s contact data?',
        name: 'properties.building.landRegister.owner',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What are the seller\'s contact data?',
        name: 'properties.building.landRegister.contact',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the cadaster nr. of the property?',
        name: 'properties.building.landRegister.cadaster',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the property index nr. of the property?',
        name: 'properties.building.landRegister.propertyIndex',
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the official apartment nr.?',
        name: 'properties.typology.officialApartmentNumber',
        type: 'number',
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a value-relevant building right or servitude on the property?',
        name: 'properties.building.valueRelevantServitude',
        options: factsOptions.valueRelevantServitudeOptions
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Describe the servitudes',
        name: 'properties.building.rightsAndServitudes',
      },
    ],
  },
  // SECTION: FINANCIAL INFORMATION
  {
    title: "Financial information",
    history: "financialInformation",
    cardType: "financialInformation",
    inputs: [
      {
        component: BrixelInputText,
        className: '',
        label: 'What are the additional costs per year?',
        name: 'properties.building.maintenanceCost',
        format: formatPrice,
        normalize: normalizePrice,
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'How are these additional costs calculated?',
        name: 'price.financial.additionalCosts',
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the total amount of the renewal funds?',
        name: 'properties.building.renewalTotalAmount.value',
        type: 'number',
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the owner\'s amount of the renewal funds?',
        name: 'properties.building.renewalOwnerAmount.value',
        type: 'number',
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the owner\'s share of the co-ownership? (‰)',
        name: 'properties.building.ownershipPermil',
        type: 'number',
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        component: BrixelInputText,
        className: '',
        label: 'How many condominium owners are there?',
        name: 'properties.building.condominiumOwners',
        type: 'number',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the current notional rental value?',
        name: 'price.notional',
        format: formatPrice,
        normalize: normalizePrice,
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'When did you buy the property?',
        name: 'properties.building.purchaseDate',
        type: 'number',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'For what price did you buy the property?',
        name: 'properties.building.purchasePrice',
        type: 'number',
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Mortgage type',
        name: 'properties.building.mortgage',
        options: factsOptions.mortgage,
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Mortgage End',
        name: 'properties.building.mortgageEnd',
      },
    ],
  },
  // SECTION: DESCRIPTION
  {
    title: "Description",
    history: "description",
    cardType: "description",
    inputs: [
      {
        component: BrixelTextArea,
        className: '',
        label: 'What are the highlights of the property?',
        name: 'description.highlight',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What is special about the location of the house?',
        placeholder: 'Here you can add a description about the location around the property.',
        name: 'description.location',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'Room layout',
        name: 'description.roomLayout',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'How\'s the relationship with the neighbors?',
        name: 'description.neighborsRelationship',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'How many people live in your community?',
        name: 'location.community.basisTaxation',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What is the basis of taxation in your community?',
        name: 'location.community.population',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the altitude of your community?',
        name: 'location.community.altitude',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'How large is the are of your community?',
        name: 'location.community.area',
      },







      {
        component: BrixelInputText,
        className: '',
        label: 'How are these additional costs calculated?',
        name: 'price.financial.additionalCosts',
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the total amount of the renewal funds?',
        name: 'properties.building.renewalTotalAmount.value',
        type: 'number',
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the owner\'s amount of the renewal funds?',
        name: 'properties.building.renewalOwnerAmount.value',
        type: 'number',
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the owner\'s share of the co-ownership? (‰)',
        name: 'properties.building.ownershipPermil',
        type: 'number',
      },
      {
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        component: BrixelInputText,
        className: '',
        label: 'How many condominium owners are there?',
        name: 'properties.building.condominiumOwners',
        type: 'number',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the current notional rental value?',
        name: 'price.notional',
        format: formatPrice,
        normalize: normalizePrice,
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'When did you buy the property?',
        name: 'properties.building.purchaseDate',
        type: 'number',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'For what price did you buy the property?',
        name: 'properties.building.purchasePrice',
        type: 'number',
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Mortgage type',
        name: 'properties.building.mortgage',
        options: factsOptions.mortgage,
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Mortgage End',
        name: 'properties.building.mortgageEnd',
      },
    ],
  },
  // SECTION: SURROUNDINGS & DISTANCES
  {
    title: "Surroundings & distances",
    history: "surroundingsDistnces",
    cardType: "surroundingsDistnces",
    inputs: [
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next public transport stop?',
        name: 'location.distances.publicTransport',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next grocery?',
        name: 'location.distances.shopping',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next highway?',
        name: 'location.distances.highway',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next kindergarten?',
        name: 'location.distances.kindergarten',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next primary school?',
        name: 'location.distances.primarySchool',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next high school?',
        name: 'location.distances.highSchool',
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next recreation area?',
        name: 'location.distances.nature',
      },
    ],
  },
  // SECTION: SALES STRATEGY & PRICE
  {
    title: "Sales strategy & price",
    history: "salesStrategyPrice",
    cardType: "salesStrategyPrice",
    inputs: [
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Status',
        name: 'status',
        options: factsOptions.propertyStatus,
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Availability of sale',
        name: 'properties.typology.availability',
        options: factsOptions.availability,
      },
      {
        condition: {
          name: 'properties.typology.availability',
          value: 'other',
        },
        component: BrixelInputText,
        className: '',
        label: 'What\'s the preferred time of sale?',
        name: 'properties.typology.availabilityText',
      },

      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the reason to sell?',
        name: 'properties.salesStrategy.reasonToSell',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Are there some special selection criteria for the potential buyers?',
        name: 'properties.salesStrategy.criteriaBuyers',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'How do you want to process the showings?',
        name: 'properties.salesStrategy.processShowing',
      },
      {
        component: BrixelSelect,
        className: '',
        label: 'Currency',
        name: 'price.currency',
        options: factsOptions.currency,
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What is the selling price of the house?',
        name: 'price.total',
        format: formatPrice,
        normalize: normalizePrice,
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'How do you want to split the fees?',
        name: 'properties.salesStrategy.feesSplit',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Conditions for the offers and negotiation?',
        name: 'properties.salesStrategy.offersConditions',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Support for the contract and notary?',
        name: 'properties.salesStrategy.supportContract',
      },
    ],
  },
];
