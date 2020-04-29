/* eslint-disable max-len */
import isNaN from 'lodash/isNaN';
import get from 'lodash/get';
import {
  BrixelCheckbox,
  BrixelExtraFeature, BrixelInputQuality,
  BrixelInputScale, BrixelInputStepNumber,
  BrixelInputText,
  BrixelRadioButton, BrixelSelect, BrixelTextArea,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import { configureStore } from '../store';
// import { isEmpty } from '@brixel/brixel-components/src/utils/helper';
const { factsOptions } = FactsOptions;

const formatPrice = (value) => {
  if (!value) return '';
  return Number(value).toLocaleString('de-CH');
};

const normalizePrice = (value) => {
  if (value.length === 0) return '';
  return Number(value.replace(/\D/g, ''));
};

const normalizeData = (value, prevValue) => {
  if (!value) return value;

  const valueOnlyNumbers = value.replace(/[^\d]/g, '');
  const prevValueOnlyNumbers = prevValue && prevValue.replace(/[^\d]/g, '');

  // Enable backspacing:
  // if the user is backspacing and they backspace a forward slash, the date's
  // numbers won't be affected so just return the value.
  if (valueOnlyNumbers === prevValueOnlyNumbers) return value;

  const month = valueOnlyNumbers.slice(0, 2);
  const year = valueOnlyNumbers.slice(2, 6);
  if (valueOnlyNumbers.length < 2 && !isNaN(+month) && +month <= 12) return `${month}`;
  if (valueOnlyNumbers.length === 2 && !isNaN(+month) && +month <= 12) return `${month}/`;
  if (valueOnlyNumbers.length > 2 && !isNaN(+year) && +year <= 2090) return `${month}/${year}`;
  return prevValue;
};

export const InputSheets = () => {
  const formValue = get(configureStore.getState(), 'form.Property.values', {});
  return [
    // SECTION: PROPERTY TYPE
    {
      className: 'radioBtnImg',
      group: "Type",
      title: "Property",
      history: "propertyType",
      cardType: "propertyType",
      inputs: [
        {
          component: BrixelRadioButton,
          className: 'radioBtnImg max-w-fix-md-464',
          label: 'What is the property type?',
          name: 'properties.propertyType',
          validation: [Validation.required],
          deactivable: false,
          options: factsOptions.propertyTypeNoIcon,
        },
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
          validation: [Validation.markRequired]
        },
        {
          component: BrixelRadioButton,
          condition: {
            name: 'properties.propertyType',
            value: 'Apartment'
          },
          label: 'What\'s the type of the building?',
          name: 'properties.building.typeFlatBuildingCode',
          options: factsOptions.typeFlatBuildingCode,
          validation: [Validation.markRequired]
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
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the net living space of the property?',
          labelLeft: 'Living Space',
          placeholder: '120',
          unit: 'm2',
          name: 'properties.typology.livingArea.value',
          type: "number",
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputStepNumber,
          className: '',
          label: `How many rooms does the ${get(formValue, 'properties.propertyType', '').toLowerCase()} have?`,
          name: 'properties.typology.bedrooms',
          labelLeft: 'Rooms',
          step: 0.5,
          placeholder: '0',
          validation: [Validation.maxLengthNumRooms, Validation.markRequired]
        },
        {
          component: BrixelInputStepNumber,
          className: '',
          label: 'How many bathrooms does the property have?',
          name: 'properties.typology.bathrooms',
          labelLeft: 'Bathrooms',
          step: 1,
          placeholder: '0',
          validation: [Validation.maxLengthNumRooms, Validation.markRequired]
        },
        {
          component: BrixelInputStepNumber,
          className: '',
          label: 'How many separate toilets does the property have?',
          name: 'properties.typology.separateToilets',
          labelLeft: 'Toilets',
          step: 1,
          placeholder: '0',
          validation: [Validation.maxLengthNumRooms, Validation.markRequired]
        },
        {
          component: BrixelInputText,
          condition: {
            name: 'properties.propertyType',
            value: 'House'
          },
          className: '',
          label: 'What\'s the lot size?',
          name: 'properties.typology.lotArea.value',
          type: "number",
          unit: 'm2',
          labelLeft: 'Lot Size',
          placeholder: 'e.g. 140',
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputText,
          condition: {
            name: 'properties.propertyType',
            value: 'House'
          },
          className: '',
          label: 'What\'s the house\'s volume?',
          unit: 'm3',
          labelLeft: 'Volume',
          name: 'properties.typology.constructedVolume.value',
          type: "number",
          validation: [Validation.markRequired]
        },
        {
          component: BrixelRadioButton,
          condition: {
            name: 'properties.propertyType',
            value: 'House'
          },
          options: factsOptions.constructedVolumeCode,
          className: '',
          label: 'What\'s the volume standard?',
          labelLeft: 'Volume',
          name: 'properties.typology.constructedVolumeCode',
          validation: [Validation.markRequired]
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
          type: "number",
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputStepNumber,
          condition: {
            name: 'properties.propertyType',
            value: 'Apartment'
          },
          placeholder: '0',
          className: '',
          label: 'How many floors are there in the whole building?',
          labelLeft: 'Floors',
          name: 'properties.typology.numberOfFloors',
          step: 1,
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputStepNumber,
          condition: {
            name: 'properties.propertyType',
            value: 'Apartment'
          },
          className: '',
          placeholder: '0',
          label: 'On which floor is the apartment\'s entrance?',
          labelLeft: 'Which floor',
          name: 'properties.typology.floorNumber',
          step: 1,
          validation: [Validation.markRequired],
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
          validation: [Validation.markRequired]
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Is the property a holiday home?',
          name: 'properties.building.secondaryResidence',
          options: factsOptions.secondaryResidenceOptions,
          validation: [Validation.markRequired]
        },
        // BUILDING
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the construction year?',
          type: "number",
          labelLeft: 'Year',
          name: 'properties.building.built',
          validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear, Validation.required],
          minLenghtNum: 999,
          maxLenghtNum: 9999,
          placeholder: "YYYY (ex.: 2020)",
        },
        {
          component: BrixelInputScale,
          className: 'helpLink',
          label: 'What\'s the building quality of the whole building?',
          name: 'properties.building.quality',
          options: factsOptions.quality,
          modal: {
            className: '',
            func: {
              layout: 'xlarge',
              hint: 'Know more about building quality',
              state: true,
              group: 'Building quality',
              body: '<p class="body2">With this variable, the basic structure independent of its current condition is assessed. Pay attention to following points: <br>the modes of construction; <br>the quality of the materials used in construction, insulation, glazing; <br>the kitchen and bath furnishing; <br>the quality of outdoor and environment design; <br>the quality of the plan (floor plan, lighting conditions, access to rooms etc.); <br>quality of heatgeneration and distribution.</p>' +
                '<p class="body2"><b>Exceptional quality:</b> Very good noise insulation (within the building and from outside); heat insulation surpasses common standard; no problems with humidity or airtightness; very good indoor climate; ideal room layout with developable reserves; superior kitchen and sanitation; particular construction parts can easily be replaced; very good room proportions; versatile view from within and from outside; many green areas with exquisite planting and generous seating areas.</p>' +
                '<p class="body2"><b>Good quality:</b> Good noise insulation (within the building and from outside); heat insulation fulfill current standard; no problems with humidity or airtightness; good indoor climate; good room layout; contemporary kitchen and sanitation; particular construction parts can be replaced with little effort; good room proportions; good view from within and from outside; many green areas with harmonic planting and generous seating areas.</p>' +
                '<p class="body2"><b>Fair quality:</b> Noise insulation (within the building and from outside) with small defects; sufficient heat insulation; small problems with humidity or airtightness; sufficient indoor climate; fair room layout; obsolete but fully working kitchen and sanitation; particular construction parts can only be replaced with some effort; no architectural attractiveness; marginal view from within and from outside; appropriate green areas with ordinary planting and seating areas.</p>' +
                '<p class="body2"><b>Poor quality:</b> Noise insulation with defects; heat insulation is below average and not fulfilling current standard; obvious problems with humidity or airtightness; insufficient indoor climate; insufficient room layout; obsolete kitchen and sanitation with small defects; particular construction parts can only be replaced with much effort; missing architectural attractiveness; no view from within and from outside; litle green areas and seating areas.</p>',
            },
          }
        },
        {
          component: BrixelInputScale,
          className: 'helpLink',
          label: 'In which condition is the property?',
          name: 'properties.building.conditionCode',
          options: factsOptions.quality,
          modal: {
            func: {
              layout: 'xlarge',
              hint: 'Building quality',
              state: true,
              group: 'Renovations',
              body: 'To assess the condition of a building, consider the building shell (facade, windows, roof), the supporting structure, the general technical systems (heating, sanitation, principal electrical distribution, ventilation system, elevator) and the expansion of general surfaces (cellar rooms, washrooms and drying rooms, staircases etc.). <br><br>' +
                '<b>Exceptional quality:</b> Everything is as good as new and fully working. The building is maximal 5 years old or is completely renovated within the last 3 years.<br>' +
                '<b>Good quality:</b> Everything is fully working but show traces of use. The building is 5-15 years old or is completely renovated within the last 3-10 years.<br>' +
                '<b>Fair quality:</b> Everything is already used and show clear traces of use and wear with small functional defects. The building is 15-30 years old or is completely renovated within the last 10-25 years. Partial replacement is needed.<br>' +
                '<b>Poor quality:</b> Everything is already used and show clear traces of use with some parts having defects or not working anymore. The building is more than 30 years old or is completely renovated more than 25 years ago. Complete replacement is needed.<br>',
            },
          },
          validation: [Validation.markRequired]
        },
        {
          condition: {
            name: 'properties.propertyType',
            value: 'Apartment',
          },
          component: BrixelInputScale,
          className: '',
          label: 'How is the condition of the apartment?',
          name: 'properties.building.apartmentQuality',
          options: factsOptions.quality,
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputStepNumber,
          condition: {
            name: 'properties.propertyType',
            value: 'House'
          },
          className: '',
          placeholder: '0',
          label: 'How many floors does the house have?',
          name: 'properties.typology.numberOfHouseFloors',
          labelLeft: 'Floors',
          step: 1,
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputText,
          condition: {
            name: 'properties.propertyType',
            value: 'Apartment'
          },
          className: '',
          label: 'Number of apartments in building.',
          name: 'properties.typology.numberOfFlats',
          labelLeft: 'Apartments',
          type: 'number',
          validation: [Validation.markRequired]
        },
      ]
    },
    // SECTION: LOCATION
    {
      group: "Location",
      title: "Location",
      history: "locationInput",
      cardType: "location",
      inputs: [
        {
          label: 'Property address',
          name: 'location.address',
          type: 'Map',
          validation: [Validation.required]
        },
        /*{
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
        },*/
        {
          component: BrixelInputText,
          className: '',
          label: 'How many people live in your community?',
          placeholder: '34’565 (2018)',
          name: 'location.community.basisTaxation',
          labelLeft: 'Population',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What is the basis of taxation in your community?',
          placeholder: '105 %',
          name: 'location.community.population',
          labelLeft: 'Basis of taxation',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the altitude of your community?',
          placeholder: '630 MAMSL',
          name: 'location.community.altitude',
          labelLeft: 'Altitude',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'How large is the area of your community?',
          placeholder: '15 sq. km',
          name: 'location.community.area',
          labelLeft: 'Area',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the distance to the next public transport stop?',
          placeholder: '200 m (Hardplatz)',
          name: 'location.distances.publicTransport',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the distance to the next grocery?',
          placeholder: '350 m (Migros)',
          name: 'location.distances.shopping',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the distance to the next highway?',
          placeholder: '1500 m (A1)',
          name: 'location.distances.highway',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the distance to the next kindergarten?',
          placeholder: '150 m',
          name: 'location.distances.kindergarten',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the distance to the next primary school?',
          placeholder: '300 m',
          name: 'location.distances.primarySchool',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the distance to the next high school?',
          placeholder: '300 m',
          name: 'location.distances.highSchool',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the distance to the next recreation area?',
          placeholder: '600 m (Park)',
          name: 'location.distances.nature',
          validation: [Validation.markRequired],
        },
      ],
    },
    // SECTION: CONDITION
    {
      className: '',
      group: "Condition",
      title: "Condition",
      history: "condition",
      cardType: "condition ",
      inputs: [
        {
          component: BrixelRadioButton,
          className: 'helpLink',
          label: 'Is the property renovated?',
          name: 'properties.building.isPropertyRenovated',
          options: factsOptions.isPropertyRenovatedOptions,
          modal: {
            func: {
              layout: 'xlarge',
              hint: 'Know more about renovations',
              state: true,
              group: 'Renovations',
              body: 'If a major renovation of the object has taken place, please enter the corresponding year.' +
                'A major renovation is defined as work on the whole building. This includes the facade (heat insulation, windows), new heating, kitchen or bathroom. All investments within 3-5 years can be combined.' +
                'In order to be considered as a major renovation at least 15-20% of the building insurance value has to be reinvested.',
            },
          },
          validation: [Validation.markRequired]
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
          labelLeft: 'Year',
          placeholder: 'YYYY (ex.: 2020)',
          validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear, Validation.markRequired],
          minLenght: 999,
          maxLength: 2030,
        },
        {
          condition: {
            name: 'properties.building.isPropertyRenovated',
            value: 1
          },
          component: BrixelTextArea,
          className: '',
          label: 'What has been renovated?',
          placeholder: '2015: Replacement of boiler',
          name: 'description.investment',
          validation: [Validation.markRequired]
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Are there some major renovation works needed within the next years?',
          name: 'properties.building.isNeedRenovation',
          options: factsOptions.yesNoOpt,
          validation: [Validation.markRequired]
        },
        {
          condition: {
            name: 'properties.building.isNeedRenovation',
            value: true,
          },
          component: BrixelTextArea,
          className: '',
          label: 'What renovation works are needed within the next years?',
          placeholder: 'Oil heating needs to be replaced.',
          name: 'description.needRenovation',
          options: factsOptions.yesNoOpt,
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputScale,
          className: '',
          label: 'How good are the property\'s amenities?',
          name: 'properties.typology.qualityAmenities',
          options: factsOptions.amentitiesQuality,
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'Date of last electrical inspection',
          labelLeft: 'Date',
          name: 'properties.building.electricalInspection',
          validation: [Validation.markRequired],
          placeholder: "mm/yyyy (ex.: 01/2020)",
          normalize: normalizeData,
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
          component: BrixelInputText,
          className: '',
          label: 'What\'s the surface of the balcony?',
          unit: 'm2',
          placeholder: '140',
          labelLeft: 'Balcony',
          name: 'properties.typology.balconyArea.value',
          type: 'number',
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the size of the garden?',
          labelLeft: 'Garden',
          unit: 'm2',
          name: 'properties.typology.gardenArea.value',
          type: 'number',
          placeholder: '140',
          validation: [Validation.markRequired],
        },
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
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the size of the attic?',
          labelLeft: 'Attic',
          unit: 'm2',
          placeholder: '25',
          name: 'properties.building.expandableAtticArea.value',
          validation: [Validation.markRequired]
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Is there a basement?',
          name: 'properties.typology.basement',
          options: factsOptions.basementOptions,
          validation: [Validation.markRequired]
        },
        {
          condition: {
            name: 'properties.typology.basement',
            value: true,
          },
          component: BrixelInputText,
          className: '',
          label: 'What\'s the size of the basement?',
          labelLeft: 'Basement',
          unit: 'm2',
          placeholder: '30',
          name: 'properties.typology.basementArea.value',
          type: 'number',
          validation: [Validation.markRequired]
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Is there a storeroom?',
          name: 'properties.building.properties.typology.storeroom',
          options: factsOptions.yesNoOpt,
          validation: [Validation.markRequired]
        },
        {
          condition: {
            name: 'properties.building.properties.typology.storeroom',
            value: true,
          },
          component: BrixelInputText,
          className: '',
          label: 'What\'s the size of the storeroom?',
          labelLeft: 'Storeroom',
          unit: 'm2',
          placeholder: '8',
          name: 'properties.building.properties.typology.storeroomArea.value',
          type: 'number',
          validation: [Validation.markRequired]
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Is there some other collective used spaces?',
          name: 'properties.typology.collectiveSpaces',
          options: factsOptions.yesNoOpt,
          validation: [Validation.markRequired]
        },
        {
          condition: {
            name: 'properties.typology.collectiveSpaces',
            value: true,
          },
          component: BrixelInputText,
          className: '',
          label: 'What\'s the size of collective used spaces?',
          labelLeft: 'Collective used space',
          unit: 'm2',
          placeholder: '35',
          name: 'properties.typology.collectiveSpacesArea.value',
          type: 'number',
          validation: [Validation.markRequired]
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
          labelLeft: 'Garage parking',
          step: 1,
          placeholder: '0',
          validation: [Validation.markRequired]
        },
        {
          condition: {
            name: 'properties.parking.garage',
            value: 'isPositive',
          },
          component: BrixelInputText,
          className: '',
          label: 'Price per garage parking lot',
          labelLeft: 'Price per lot',
          name: 'properties.parking.garagePrice',
          format: formatPrice,
          normalize: normalizePrice,
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
        {
          component: BrixelInputStepNumber,
          className: '',
          placeholder: '0',
          label: 'How many external parking lots belong to the property?',
          name: 'properties.parking.outside',
          labelLeft: 'External parking',
          step: 1,
          validation: [Validation.markRequired]
        },
        {
          condition: {
            name: 'properties.parking.outside',
            value: 'isPositive',
          },
          component: BrixelInputText,
          className: '',
          label: 'Price per external parking lot',
          labelLeft: 'Price per lot',
          name: 'properties.parking.outsidePrice',
          format: formatPrice,
          normalize: normalizePrice,
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
        {
          component: BrixelInputStepNumber,
          className: '',
          label: 'How many underground parking lots belong to the property?',
          labelLeft: 'Underground parking',
          name: 'properties.parking.underground',
          step: 1,
          placeholder: '0',
          validation: [Validation.markRequired]
        },
        {
          condition: {
            name: 'properties.parking.underground',
            value: 'isPositive',
          },
          component: BrixelInputText,
          className: '',
          label: 'Price per underground parking lot',
          labelLeft: 'Price per lot',
          name: 'properties.parking.undergroundPrice',
          format: formatPrice,
          normalize: normalizePrice,
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
      ],
    },
    // SECTION: EXTRA FEATURE
    {
      group: "Extra features",
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
          validation: [Validation.markRequired],
        },
      ],
    },
    // SECTION: FACILITES & MATERIALS
    {
      group: "Facilities & materials",
      title: "Facilities & materials",
      history: "facilitiesMaterials",
      cardType: "facilitiesMaterials",
      inputs: [
        {
          component: BrixelCheckbox,
          className: 'mb-2',
          label: 'What\'s the heating system?',
          name: 'properties.energy.heating',
          options: factsOptions.heating,
          validation: [Validation.markRequired],
        },
        {
          component: BrixelRadioButton,
          classNameBox: 'dis-fl-row',
          label: 'Is there a solar plant?',
          name: 'properties.energy.solar',
          options: factsOptions.solarOptions,
          validation: [Validation.markRequired],
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
          validation: [Validation.markRequired],
        },
        {
          condition: {
            name: 'properties.propertyType',
            value: 'House'
          },
          component: BrixelInputText,
          className: '',
          label: 'What\'s the boiler capacity?',
          labelLeft: 'Liter',
          name: 'properties.energy.boiler.capacity',
          type: 'number',
          unit: 'l',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Is there an air conditioner?',
          name: 'properties.energy.ac',
          options: factsOptions.acOptions,
          validation: [Validation.markRequired],
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Is there a window insulation?',
          name: 'properties.building.windows.insulation',
          options: factsOptions.windowsInsulationOptions,
          validation: [Validation.markRequired],
        },
        {
          component: BrixelCheckbox,
          className: '',
          label: 'What is the material of the windows?',
          placeholder: 'Aluminium frames',
          name: 'properties.building.windows.materials',
          options: factsOptions.windows,
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'What kind of blinds are there?',
          placeholder: 'Venetian blinds',
          name: 'properties.building.blinds.materials',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'What\'s the material of the floors?',
          placeholder: 'Timber flooring',
          name: 'properties.building.floors.materials',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'What\'s the equipment and materials in the kitchen?',
          placeholder: 'V-Zug dishwasher',
          name: 'properties.building.kitchen.materials',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'What\'s the equipments and materials in the bathrooms?',
          placeholder: 'Mosaic tiles',
          name: 'properties.building.bathrooms.materials',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputQuality,
          className: '',
          label: 'What\'s the energy efficiency of the property?',
          name: 'properties.energy.efficiency',
          options: factsOptions.energyEfficiencyOptions,
          validation: [Validation.markRequired],
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Is the property Minergie certified?',
          name: 'properties.energy.minergieCertified',
          options: factsOptions.minergieCertifiedOptions,
          validation: [Validation.markRequired],
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
          label: 'Who is the owner of the property?',
          placeholder: 'Bruce Brixel',
          name: 'properties.building.landRegister.owner',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What are the seller\'s contact data?',
          placeholder: 'Bianca Brixel',
          name: 'properties.building.landRegister.contact',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the cadaster nr. of the property?',
          placeholder: '914',
          name: 'properties.building.landRegister.cadaster',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the property index nr. of the property?',
          placeholder: 'WD4311GB',
          name: 'properties.building.landRegister.propertyIndex',
          validation: [Validation.markRequired],
        },
        {
          condition: {
            name: 'properties.propertyType',
            value: 'Apartment'
          },
          component: BrixelInputText,
          className: '',
          label: 'What\'s the official apartment nr.?',
          placeholder: '998',
          name: 'properties.typology.officialApartmentNumber',
          type: 'number',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Is there a value-relevant building right or servitude on the property?',
          name: 'properties.building.valueRelevantServitude',
          options: factsOptions.valueRelevantServitudeOptions,
          validation: [Validation.markRequired],
        },
        {
          condition: {
            name: 'properties.building.valueRelevantServitude',
            value: 1
          },
          component: BrixelInputText,
          className: '',
          label: 'Describe the servitudes',
          placeholder: 'Right of way for neighboring plot',
          name: 'properties.building.rightsAndServitudes',
          validation: [Validation.markRequired],
        },
      ],
    },
    // SECTION: PRICE & FINANCIAL
    {
      title: "Price & financials",
      history: "priceAndFinacials",
      cardType: "priceAndFinacials",
      inputs: [
        {
          component: BrixelSelect,
          className: 'zIndex3',
          label: 'Currency',
          name: 'price.currency',
          compact: true,
          options: factsOptions.currency,
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What is the selling price of the house?',
          labelLeft: 'Price',
          placeholder: '1’500’000',
          name: 'price.total',
          format: formatPrice,
          normalize: normalizePrice,
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What are the additional costs per year?',
          placeholder: '7400',
          name: 'properties.building.maintenanceCost',
          labelLeft: 'Additional costs',
          format: formatPrice,
          normalize: normalizePrice,
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'For what are these additional costs used?',
          placeholder: 'Costs for heating, electricity and gardening.',
          name: 'price.financial.additionalCosts',
          validation: [Validation.markRequired],
        },
        {
          condition: {
            name: 'properties.propertyType',
            value: 'Apartment'
          },
          component: BrixelInputText,
          className: '',
          label: 'What\'s the total amount of the renewal funds?',
          placeholder: '120’000',
          name: 'properties.building.renewalTotalAmount.value',
          labelLeft: 'Renewal Funds',
          format: formatPrice,
          normalize: normalizePrice,
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
        {
          condition: {
            name: 'properties.propertyType',
            value: 'Apartment'
          },
          component: BrixelInputText,
          className: '',
          label: 'What\'s the owner\'s amount of the renewal funds?',
          placeholder: '15’000',
          name: 'properties.building.renewalOwnerAmount.value',
          labelLeft: 'Renewal Funds',
          format: formatPrice,
          normalize: normalizePrice,
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
        {
          condition: {
            name: 'properties.propertyType',
            value: 'Apartment'
          },
          component: BrixelInputText,
          className: '',
          label: 'What\'s the owner\'s share of the co-ownership?',
          placeholder: '25',
          name: 'properties.building.ownershipPermil',
          labelLeft: 'Co-ownership',
          type: 'number',
          unit: '‰',
          validation: [Validation.markRequired],
        },
        {
          condition: {
            name: 'properties.propertyType',
            value: 'Apartment'
          },
          component: BrixelInputText,
          className: '',
          label: 'How many condominium owners are there?',
          placeholder: '37',
          name: 'properties.building.condominiumOwners',
          labelLeft: 'Nr. of owners',
          type: 'number',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the current notional rental value?',
          placeholder: '16’000',
          name: 'price.national',
          labelLeft: 'Notional Value',
          format: formatPrice,
          normalize: normalizePrice,
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'When did you buy the property?',
          name: 'properties.building.purchaseDate',
          labelLeft: 'Date',
          validation: [Validation.markRequired],
          placeholder: "mm/yyyy (ex.: 01/2020)",
          normalize: normalizeData,
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'For what price did you buy the property?',
          placeholder: '480’000',
          name: 'properties.building.purchasePrice',
          labelLeft: 'Price',
          format: formatPrice,
          normalize: normalizePrice,
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Mortgage type',
          name: 'properties.building.mortgage',
          options: factsOptions.mortgage,
          validation: [Validation.markRequired],
        },
        {
          conditions: [
            {
              name: 'properties.building.mortgage',
              value: 'fixed'
            },
          ],
          component: BrixelInputText,
          className: '',
          label: 'Mortgage End',
          name: 'properties.building.mortgageEnd',
          validation: [Validation.markRequired],
          placeholder: "mm/yyyy (ex.: 01/2020)",
          normalize: normalizeData,
        },
      ],
    },
    // SECTION: DESCRIPTION
    {
      group: "Description",
      title: "Description",
      history: "description",
      cardType: "description",
      inputs: [
        {
          component: BrixelInputText,
          className: '',
          label: 'Title',
          name: 'title',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'What are the highlights of the property?',
          placeholder: 'Add some description about the highlights of your property. Try to think about your potential buyers.',
          name: 'description.highlight',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'What is special about the location of the house?',
          placeholder: 'Here you can add a description about the location around the property.',
          name: 'description.location',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'Room layout',
          name: 'description.roomLayout',
          formatText: true,
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'How\'s the relationship with the neighbors?',
          placeholder: 'There are many young families around the property.',
          name: 'description.neighborsRelationship',
          validation: [Validation.markRequired],
        },
      ],
    },
    // SECTION: SALES STRATEGY
    {
      title: "Sales strategy",
      history: "salesStrategy",
      cardType: "salesStrategy",
      inputs: [
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Status',
          name: 'status',
          options: factsOptions.propertyStatusNoRent,
          validation: [Validation.markRequired],
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Availability of sale',
          name: 'properties.typology.availability',
          options: factsOptions.availability,
          validation: [Validation.markRequired],
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
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'What\'s the reason to sell?',
          Placeholder: 'Inherited property.',
          name: 'properties.salesStrategy.reasonToSell',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'Are there some special selection criteria for the potential buyers?',
          Placeholder: 'Families will be preferred.',
          name: 'properties.salesStrategy.criteriaBuyers',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'How do you want to split the fees?',
          Placeholder: 'Fees will be evenly split.',
          name: 'properties.salesStrategy.feesSplit',
          validation: [Validation.markRequired],
        },
      ],
    },
  ];
}
