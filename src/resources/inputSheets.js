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
// import { isEmpty } from '@brixel/brixel-components/src/utils/helper';
import { translateTo } from '../utils/translation';
import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
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
    group: "Type",
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
        validation: [Validation.required],
        deactivable: false,
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
    group: "Address",
    title: "Address",
    history: "locationInput",
    cardType: "location",
    inputs: [
      {
        label: 'What\'s the exact address of the property?',
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
    ],
  },
  // SECTION: PROPERTY
  {
    className: '',
    group: "Property",
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
        validation: [Validation.markRequired]
      },
      {
        component: BrixelRadioButton,
        condition: {
          name: 'properties.propertyType',
          value: 'Apartment'
        },
        label: 'What\'s the type of the building?',
        isHorizontal: true,
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
        label: 'What\'s the construction year?',
        type: "number",
        name: 'properties.building.built',
        validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear, Validation.required],
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
          validation: [Validation.markRequired]
        }
      },
      {
        component: BrixelRadioButton,
        className: 'helpLink',
        label: 'Is the property renovated?',
        name: 'properties.building.isPropertyRenovated',
        options: factsOptions.isPropertyRenovatedOptions,
        isHorizontal: true,
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
        placeholder: 'YYYY (ex.: 2020)',
        validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear, Validation.markRequired],
      },
      {
        condition: {
          name: 'properties.building.isPropertyRenovated',
          value: 1
        },
        component: BrixelTextArea,
        className: '',
        label: 'What has been renovated?',
        name: 'description.investment',
        validation: [Validation.markRequired]
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Are there some major renovation works needed within the next years?',
        name: 'properties.building.isNeedRenovation',
        isHorizontal: true,
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
        name: 'description.needRenovation',
        options: factsOptions.yesNoOpt,
        validation: [Validation.markRequired]
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
        validation: [Validation.markRequired]
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
        component: BrixelInputStepNumber,
        condition: {
          name: 'properties.propertyType',
          value: 'House'
        },
        className: '',
        label: 'How many floors does the house have?',
        name: 'properties.typology.numberOfHouseFloors',
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
        label: 'Number of apartments in building',
        name: 'properties.typology.numberOfFlats',
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
        label: 'How many floors are there in the whole building?',
        name: 'properties.typology.numberOfFloors',
        step: 1,
        validation: [Validation.markRequired]
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the net living space of the property?',
        name: 'properties.typology.livingArea.value',
        type: "number",
        validation: [Validation.markRequired]
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
        label: 'What\'s the house\'s volume? (m3)',
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
        label: 'What\'s the house\'s volume? (m3)',
        name: 'properties.typology.constructedVolumeCode',
        type: "number",
        validation: [Validation.markRequired]
      },
      {
        component: BrixelInputStepNumber,
        options: factsOptions.constructedVolumeCode,
        className: '',
        label: 'How many rooms does the house have?',
        name: 'properties.typology.bedrooms',
        step: 0.5,
        validation: [Validation.maxLengthNumRooms, Validation.markRequired]
      },
      {
        component: BrixelInputStepNumber,
        options: factsOptions.constructedVolumeCode,
        className: '',
        label: 'How many bathrooms does the property have?',
        name: 'properties.typology.bathrooms',
        step: 1,
        validation: [Validation.maxLengthNumRooms, Validation.markRequired]
      },
      {
        component: BrixelInputStepNumber,
        options: factsOptions.constructedVolumeCode,
        className: '',
        label: 'How many separate toilets does the property have?',
        name: 'properties.typology.separateToilets',
        step: 1,
        validation: [Validation.maxLengthNumRooms, Validation.markRequired]
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
        isHorizontal: true,
        validation: [Validation.markRequired]
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the surface of the balcony?',
        unit: 'm2',
        placeholder: 'e.g. 140',
        name: 'properties.typology.balconyArea.value',
        type: 'number',
        validation: [Validation.markRequired]
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the size of the garden?',
        unit: 'm2',
        name: 'properties.typology.gardenArea.value',
        type: 'number',
        placeholder: 'e.g. 140',
        validation: [Validation.markRequired],
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
        component: BrixelInputScale,
        className: '',
        label: 'How good are the property\'s amenities?',
        name: 'properties.typology.qualityAmenities',
        options: factsOptions.amentitiesQuality,
        validation: [Validation.markRequired]
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is the property a holiday home?',
        name: 'properties.building.secondaryResidence',
        isHorizontal: true,
        options: factsOptions.secondaryResidenceOptions,
        validation: [Validation.markRequired]
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
        validation: [Validation.markRequired]
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the size of the attic?',
        name: 'properties.building.expandableAtticArea.value',
        validation: [Validation.markRequired]
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a basement?',
        name: 'properties.typology.basement',
        options: factsOptions.basementOptions,
        isHorizontal: true,
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
        unit: 'm2',
        placeholder: 'e.g. 140',
        name: 'properties.typology.basementArea.value',
        type: 'number',
        validation: [Validation.markRequired]
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a storeroom?',
        name: 'properties.building.properties.typology.storeroom',
        isHorizontal: true,
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
        name: 'properties.building.properties.typology.storeroomArea.value',
        type: 'number',
        validation: [Validation.markRequired]
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there some other collective used spaces?',
        isHorizontal: true,
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
        step: 1,
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
        name: 'properties.parking.garagePrice',
        validation: [Validation.markRequired]
      },
      {
        component: BrixelInputStepNumber,
        className: '',
        label: 'How many external parking lots belong to the property?',
        name: 'properties.parking.outside',
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
        name: 'properties.parking.outsidePrice',
        validation: [Validation.markRequired]
      },
      {
        component: BrixelInputStepNumber,
        className: '',
        label: 'How many underground parking lots belong to the property?',
        name: 'properties.parking.underground',
        step: 1,
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
        name: 'properties.parking.undergroundPrice',
        validation: [Validation.markRequired]
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
        className: '',
        label: 'What\'s the heating system?',
        name: 'properties.energy.heating',
        options: factsOptions.heating,
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
        name: 'properties.energy.boiler.capacity',
        type: 'number',
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
        component: BrixelRadioButton,
        classNameBox: 'dis-fl-row',
        label: 'Is there a solar plant?',
        isHorizontal: true,
        name: 'properties.energy.solar',
        options: factsOptions.solarOptions,
        validation: [Validation.markRequired],
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there an air conditioner?',
        isHorizontal: true,
        name: 'properties.energy.ac',
        options: factsOptions.acOptions,
        validation: [Validation.markRequired],
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a solar plant?',
        isHorizontal: true,
        name: 'properties.energy.solar',
        options: factsOptions.solarOptions,
        validation: [Validation.markRequired],
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a window insulation?',
        isHorizontal: true,
        name: 'properties.building.windows.insulation',
        options: factsOptions.windowsInsulationOptions,
        validation: [Validation.markRequired],
      },
      {
        component: BrixelCheckbox,
        className: '',
        label: 'What is the material of the windows?',
        name: 'properties.building.windows.materials',
        options: factsOptions.windows,
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the material of the blinds?',
        name: 'properties.building.blinds.materials',
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
        isHorizontal: true,
        name: 'properties.energy.minergieCertified',
        options: factsOptions.minergieCertifiedOptions,
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the material of the floors?',
        name: 'properties.building.floors.materials',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the equipment and materials in the kitchen?',
        name: 'properties.building.kitchen.materials',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the equipments and materials in the bathrooms?',
        name: 'properties.building.bathrooms.materials',
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
        label: 'What are the seller\'s contact data?',
        name: 'properties.building.landRegister.owner',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What are the seller\'s contact data?',
        name: 'properties.building.landRegister.contact',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the cadaster nr. of the property?',
        name: 'properties.building.landRegister.cadaster',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the property index nr. of the property?',
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
        name: 'properties.typology.officialApartmentNumber',
        type: 'number',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelRadioButton,
        className: '',
        label: 'Is there a value-relevant building right or servitude on the property?',
        isHorizontal: true,
        name: 'properties.building.valueRelevantServitude',
        options: factsOptions.valueRelevantServitudeOptions,
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Describe the servitudes',
        name: 'properties.building.rightsAndServitudes',
        validation: [Validation.markRequired],
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
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'How are these additional costs calculated?',
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
        name: 'properties.building.renewalTotalAmount.value',
        type: 'number',
        validation: [Validation.markRequired],
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
        validation: [Validation.markRequired],
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
        name: 'properties.building.condominiumOwners',
        type: 'number',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the current national rental value?',
        name: 'price.national',
        type: 'number',
        format: formatPrice,
        normalize: normalizePrice,
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'When did you buy the property?',
        name: 'properties.building.purchaseDate',
        type: 'number',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'For what price did you buy the property?',
        name: 'properties.building.purchasePrice',
        type: 'number',
        validation: [Validation.markRequired],
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
        component: BrixelInputText,
        className: '',
        label: 'Mortgage End',
        name: 'properties.building.mortgageEnd',
        validation: [Validation.markRequired],
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
        component: BrixelTextArea,
        className: '',
        label: 'What are the highlights of the property?',
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
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'How\'s the relationship with the neighbors?',
        name: 'description.neighborsRelationship',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'How many people live in your community?',
        name: 'location.community.basisTaxation',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What is the basis of taxation in your community?',
        name: 'location.community.population',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What\'s the altitude of your community?',
        name: 'location.community.altitude',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'How large is the are of your community?',
        name: 'location.community.area',
        validation: [Validation.markRequired],
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
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next grocery?',
        name: 'location.distances.shopping',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next highway?',
        name: 'location.distances.highway',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next kindergarten?',
        name: 'location.distances.kindergarten',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next primary school?',
        name: 'location.distances.primarySchool',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next high school?',
        name: 'location.distances.highSchool',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelTextArea,
        className: '',
        label: 'What\'s the distance to the next recreation area?',
        name: 'location.distances.nature',
        validation: [Validation.markRequired],
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
        component: BrixelInputText,
        className: '',
        label: 'What\'s the reason to sell?',
        name: 'properties.salesStrategy.reasonToSell',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Are there some special selection criteria for the potential buyers?',
        name: 'properties.salesStrategy.criteriaBuyers',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'How do you want to process the showings?',
        name: 'properties.salesStrategy.processShowing',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelSelect,
        className: 'zIndex3',
        label: 'Currency',
        name: 'price.currency',
        options: factsOptions.currency,
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'What is the selling price of the house?',
        name: 'price.total',
        format: formatPrice,
        normalize: normalizePrice,
        validation: [Validation.markRequired],
        type: 'number',
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'How do you want to split the fees?',
        name: 'properties.salesStrategy.feesSplit',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Conditions for the offers and negotiation?',
        name: 'properties.salesStrategy.offersConditions',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputText,
        className: '',
        label: 'Support for the contract and notary?',
        name: 'properties.salesStrategy.supportContract',
        validation: [Validation.markRequired],
      },
    ],
  },
];
