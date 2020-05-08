import { FactsOptions } from '@brixel/brixel-components';
import { configLang } from '../constants/global';
import {
  maxLivingSpaceRatio, maxPriceM2Ratio, maxPriceRatio, roundHundred, getDevMode,
} from './helpers';
import { configureStore } from '../store';

const { factsOptions } = FactsOptions;

export const rangeGraph = (property) => (
  [
    [
      { attribute: 'price', value: property.priceDistribution.median / maxPriceRatio },
      { attribute: 'price_m2', value: property.spacePriceDistribution.median / maxPriceM2Ratio },
      { attribute: 'living_space', value: property.spaceDistribution.median / maxLivingSpaceRatio },
    ], [
      { attribute: 'price', value: (property.activeSingleProperty.price.total || 0) / maxPriceRatio },
      { attribute: 'price_m2', value: (property.activeSingleProperty.price.pricePerM2 || 0) / maxPriceM2Ratio },
      { attribute: 'living_space', value: (property.activeSingleProperty.properties.typology.livingArea.value || 0) / maxLivingSpaceRatio },
    ],
  ]
);

export const rangeGraphCircle = (property, currency, lang) => {
  const filtLang = Object.keys(configLang).find((key) => configLang[key].code === lang);
  const defaultUnit = configLang[filtLang] ? configLang[filtLang].sqm : 'm2';
  const unit = (val) => (configureStore.getState().common.language.convertUnit ? configureStore.getState().common.language.convertUnit[val] : defaultUnit);
  const curLang = configLang[filtLang] || {};
  const localTotal = property.activeSingleProperty.price.total ? +property.activeSingleProperty.price.total : 0;
  const localSpace = property.activeSingleProperty.properties.typology.livingArea ? +property.activeSingleProperty.properties.typology.livingArea.value : 0;
  const localPriceSpace = property.activeSingleProperty.price.pricePerM2 ? +property.activeSingleProperty.price.pricePerM2 : 0;
  const marketTotal = property.priceDistribution.median ? +property.priceDistribution.median : 0;
  const marketSpace = property.spaceDistribution.median ? +property.spaceDistribution.median : 0;
  const marketPriceSpace = property.spacePriceDistribution.median ? +property.spacePriceDistribution.median : 0;
  return (
    [
      {
        name: 'Local Market',
        axes: [
          {
            axis: 'price',
            value: localTotal / maxPriceRatio,
            data: 'price',
            tooltip: `${currency} ${localTotal.toLocaleString(curLang.localString)}`,
            color: 'blue',
          },
          {
            axis: 'living_space',
            value: localSpace / maxLivingSpaceRatio,
            data: 'living_space',
            tooltip: `${localSpace.toLocaleString(curLang.localString)} ${unit(property.activeSingleProperty.properties.typology.livingArea.unit || 'sqm')}`,
            color: 'blue',
          },
          {
            axis: 'price_m2',
            value: (property.activeSingleProperty.price.pricePerM2 || 0) / maxPriceM2Ratio,
            data: 'price_m2',
            tooltip: `${currency} ${localPriceSpace.toLocaleString(curLang.localString)}`,
            color: 'blue',
          },
        ],
        color: '#82D1FA',
        triangle: 'blue',
      },
      {
        name: 'This Property',
        axes: [
          {
            axis: 'price',
            value: property.priceDistribution.median / maxPriceRatio,
            data: 'price',
            tooltip: `${currency} ${marketTotal.toLocaleString(curLang.localString)}`,
            color: 'red',
          },
          {
            axis: 'living_space',
            value: property.spaceDistribution.median / maxLivingSpaceRatio,
            data: 'living_space',
            tooltip: `${marketSpace} ${unit(property.activeSingleProperty.properties.typology.livingArea.unit || 'sqm')}`,
            color: 'red',
          },
          {
            axis: 'price_m2',
            value: property.spacePriceDistribution.median / maxPriceM2Ratio,
            data: 'price_m2',
            tooltip: `${currency} ${marketPriceSpace.toLocaleString(curLang.localString)}`,
            color: 'red',
          },
        ],
        color: '#F19BA5',
        triangle: 'red',
      },
    ]
  );
};

export const keyFacts = (property, currency, lang) => {
  const { domain } = 'ch' || configureStore.getState().common.configUrl;
  const filtLang = Object.keys(configLang).find((key) => configLang[key].code === lang);
  const curLang = configLang[filtLang] || {};
  const buildingType = factsOptions.typeFlatBuildingCode.find((val) => val.value === property.activeSingleProperty.properties.building.typeFlatBuildingCode);
  const aptType = factsOptions.typeFlatCode.find((val) => val.value === property.activeSingleProperty.properties.building.typeFlatCode);
  const houseType = factsOptions.typeHouseCode.find((val) => val.value === property.activeSingleProperty.properties.building.typeHouseCode);
  const defaultUnit = configLang[filtLang] ? configLang[filtLang].sqm : 'm2';
  const unit = (val) => (configureStore.getState().common.language.convertUnit ? configureStore.getState().common.language.convertUnit[val] : defaultUnit);
  const propTypeName = property.activeSingleProperty.properties.propertyType === 'Apartment' ? 'Apartment' : 'House';
  const facts = {};
  facts['Property type'] = property.activeSingleProperty.properties.propertyType;
  if (getDevMode()) {
    console.log('KEY FACTS', filtLang, configLang, curLang, lang, unit(property.activeSingleProperty.properties.typology.livingArea.unit), property.activeSingleProperty.properties.typology.livingArea.unit);
  }
  if (property.activeSingleProperty.properties.propertyType === 'Apartment') {
    facts['Building type'] = buildingType ? buildingType.label : '';
  }
  if (aptType) {
    facts[`${propTypeName} type`] = aptType ? aptType.label : '';
  }
  if (houseType) {
    facts[`${propTypeName} type`] = houseType ? houseType.label : '';
  }
  facts['Living space'] = `${property.activeSingleProperty.properties.typology.livingArea.value} ${unit(property.activeSingleProperty.properties.typology.livingArea.unit || 'sqm')}`;
  facts[domain === 'pt' ? 'Tipology' : 'Nr. of rooms'] = `${domain === 'pt' ? 'T' : ''}${property.activeSingleProperty.properties.typology.bedrooms}`;
  facts['Nr. of bathrooms'] = property.activeSingleProperty.properties.typology.bathrooms;
  facts['Nr. of separate toilets'] = property.activeSingleProperty.properties.typology.separateToilets;
  facts['Holiday Home'] = property.activeSingleProperty.properties.building.secondaryResidence === 1 ? 'Yes' : 'No';

  if (+property.activeSingleProperty.properties.parking.garage > 0) {
    facts['Garage Parking'] = property.activeSingleProperty.properties.parking.garage;

    if (+property.activeSingleProperty.properties.parking.garagePrice > 0) {
      facts['Garage Parking'] += `, ${currency} ${(property.activeSingleProperty.properties.parking.garagePrice).toLocaleString(curLang.localString)}`;
    }
  }

  if (+property.activeSingleProperty.properties.parking.outside > 0) {
    facts['External Parking'] = property.activeSingleProperty.properties.parking.outside;

    if (+property.activeSingleProperty.properties.parking.outsidePrice > 0) {
      facts['External Parking'] += `, ${currency} ${(property.activeSingleProperty.properties.parking.outsidePrice).toLocaleString(curLang.localString)}`;
    }
  }

  if (+property.activeSingleProperty.properties.parking.underground > 0) {
    facts['Underground Parking'] = property.activeSingleProperty.properties.parking.underground;

    if (+property.activeSingleProperty.properties.parking.undergroundPrice > 0) {
      facts['Underground Parking'] += `, ${currency} ${(property.activeSingleProperty.properties.parking.undergroundPrice).toLocaleString(curLang.localString)}`;
    }
  }
  if (property.activeSingleProperty.properties.typology.availability) {
    facts.Availability = property.activeSingleProperty.properties.typology.availability === 'other' ? property.activeSingleProperty.properties.typology.availabilityText : property.activeSingleProperty.properties.typology.availability;
  }
  return facts;
};

export const costs = (property, currency, lang) => {
  const filtLang = Object.keys(configLang).find((key) => configLang[key].code === lang);
  const curLang = configLang[filtLang] || {};
  if (getDevMode()) {
    console.log('COST', filtLang, configLang, curLang, lang);
  }
  const cost = {
    'Property price': `${currency} ${property.activeSingleProperty.price.total.toLocaleString(curLang.localString)}`,
    'Sqm price': property.activeSingleProperty.price.pricePerM2 ? `${currency} ${roundHundred(property.activeSingleProperty.price.pricePerM2).toLocaleString(curLang.localString)}` : 0,
  };
  if (property.activeSingleProperty.properties.building.maintenanceCost > 0) {
    cost['Additional cost/year'] = `${currency} ${property.activeSingleProperty.properties.building.maintenanceCost.toLocaleString(curLang.localString)}`;
  }
  if (property.activeSingleProperty.price.notional > 0) {
    cost['Notional rental value'] = `${currency} ${property.activeSingleProperty.price.notional.toLocaleString(curLang.localString)}`;
  }
  return cost;
};

export const details = (property, currency, lang) => {
  const detail = {};
  let filtLang = Object.keys(configLang).find((key) => configLang[key].code === lang);
  if (lang.value) {
    filtLang = Object.keys(configLang).find((key) => configLang[key].code === lang.value);
  }
  const curLang = configLang[filtLang] || {};
  if (getDevMode()) {
    console.log('COST', configureStore.getState(), filtLang, configLang, curLang, lang);
  }
  const unit = (val) => (configureStore.getState().common.language.convertUnit ? configureStore.getState().common.language.convertUnit[val] : configLang[filtLang].sqm);
  if (property.activeSingleProperty.properties.building.ownershipPermil) {
    detail['Co-ownership'] = `${property.activeSingleProperty.properties.building.ownershipPermil}%`;
  }
  if (property.activeSingleProperty.properties.building.renewalTotalAmount && property.activeSingleProperty.properties.building.renewalTotalAmount.value > 0) {
    detail['Renewal funds (total)'] = `${currency} ${property.activeSingleProperty.properties.building.renewalTotalAmount.value.toLocaleString(curLang.localString)}`;
  }
  if (property.activeSingleProperty.properties.building.renewalOwnerAmount && property.activeSingleProperty.properties.building.renewalOwnerAmount.value > 0) {
    detail['Renewal funds (owner share)'] = `${currency} ${property.activeSingleProperty.properties.building.renewalOwnerAmount.value.toLocaleString(curLang.localString)}`;
  }
  if (property.activeSingleProperty.properties.typology.numberOfFlats) {
    detail['Apartments in building'] = property.activeSingleProperty.properties.typology.numberOfFlats;
  }
  if (property.activeSingleProperty.properties.typology.numberOfFloors) {
    detail['Number of floors'] = property.activeSingleProperty.properties.typology.numberOfFloors;
  }
  if (property.activeSingleProperty.properties.typology.ownershipPermil) {
    detail['Floor number'] = property.activeSingleProperty.properties.typology.ownershipPermil;
  }
  if (property.activeSingleProperty.properties.typology.basement) {
    detail['With basement'] = property.activeSingleProperty.properties.typology.basement ? 'Yes' : 'No';
  }
  if (property.activeSingleProperty.properties.typology.basementArea && property.activeSingleProperty.properties.typology.basementArea.value > 0) {
    detail['Basement size'] = `${property.activeSingleProperty.properties.typology.basementArea.value} ${unit(property.activeSingleProperty.properties.typology.basementArea.unit)}`;
  }
  if (property.activeSingleProperty.properties.typology.balconyArea && property.activeSingleProperty.properties.typology.balconyArea.value > 0) {
    detail['Balcony surface'] = `${property.activeSingleProperty.properties.typology.balconyArea.value} ${unit(property.activeSingleProperty.properties.typology.balconyArea.unit)}`;
  }
  if (property.activeSingleProperty.properties.typology.gardenArea && property.activeSingleProperty.properties.typology.gardenArea.value > 0) {
    detail['Garden surface'] = `${property.activeSingleProperty.properties.typology.gardenArea.value} ${unit(property.activeSingleProperty.properties.typology.gardenArea.unit)}`;
  }
  return detail;
};

export const communities = (property) => {
  const community = {};
  if (property.activeSingleProperty.location.community) {
    if (property.activeSingleProperty.location.community.basisTaxation) {
      community['Basis of taxation'] = property.activeSingleProperty.location.community.basisTaxation;
    }
    if (property.activeSingleProperty.location.community.population) {
      community.Population = property.activeSingleProperty.location.community.population;
    }
    if (property.activeSingleProperty.location.community.altitude) {
      community.Altitude = property.activeSingleProperty.location.community.altitude;
    }
    if (property.activeSingleProperty.location.community.area) {
      community.Area = property.activeSingleProperty.location.community.area;
    }
  }
  return community;
};

export const distances = (property) => {
  const distance = {};
  if (property.activeSingleProperty.location.distances) {
    if (property.activeSingleProperty.location.distances.publicTransport && property.activeSingleProperty.location.distances.publicTransport !== 0) {
      distance['Public transport'] = property.activeSingleProperty.location.distances.publicTransport;
    }
    if (property.activeSingleProperty.location.distances.shopping && property.activeSingleProperty.location.distances.shopping !== 0) {
      distance.Shopping = property.activeSingleProperty.location.distances.shopping;
    }
    if (property.activeSingleProperty.location.distances.highway && property.activeSingleProperty.location.distances.highway !== 0) {
      distance.Highway = property.activeSingleProperty.location.distances.highway;
    }
    if (property.activeSingleProperty.location.distances.kindergarten && property.activeSingleProperty.location.distances.kindergarten !== 0) {
      distance.Kindergarten = property.activeSingleProperty.location.distances.kindergarten;
    }
    if (property.activeSingleProperty.location.distances.primarySchool && property.activeSingleProperty.location.distances.primarySchool !== 0) {
      distance['Primary school'] = property.activeSingleProperty.location.distances.primarySchool;
    }
    if (property.activeSingleProperty.location.distances.highSchool && property.activeSingleProperty.location.distances.highSchool !== 0) {
      distance['High school'] = property.activeSingleProperty.location.distances.highSchool;
    }
    if (property.activeSingleProperty.location.distances.nature && property.activeSingleProperty.location.distances.nature !== 0) {
      distance.Nature = property.activeSingleProperty.location.distances.nature;
    }
  }
  return distance;
};

export const constructions = (property) => {
  const propTypeName = property.activeSingleProperty.properties.propertyType === 'Apartment' ? 'Apartment' : 'House';
  const construction = {};
  if (property.activeSingleProperty.activeSingleProperty.building.built) construction['Costruction Year'] = property.activeSingleProperty.properties.building.built;
  if (property.activeSingleProperty.activeSingleProperty.building.renovated) construction['Renovation Year'] = property.activeSingleProperty.properties.building.renovated;
  if (property.activeSingleProperty.activeSingleProperty.building.landRegister && property.activeSingleProperty.properties.building.landRegister.cadaster) construction.Cadaster = property.activeSingleProperty.properties.building.landRegister.cadaster;
  if (propTypeName === 'Apartment' && property.activeSingleProperty.properties.building && property.activeSingleProperty.properties.building.landRegister && property.activeSingleProperty.properties.building.landRegister.propertyIndex) {
    construction['Official apartment nr.'] = property.activeSingleProperty.properties.building.landRegister.propertyIndex;
  }
  construction.Servitudes = property.activeSingleProperty.properties.building.valueRelevantServitude !== 0 ? 'Yes' : 'No';
  return construction;
};

export const conditions = (property) => {
  const propTypeName = property.activeSingleProperty.properties.propertyType === 'Apartment' ? 'Apartment' : 'House';
  const buildQuality = factsOptions.quality.find((val) => val.value === property.activeSingleProperty.properties.building.quality);
  const buildCondition = factsOptions.quality.find((val) => val.value === property.activeSingleProperty.properties.building.conditionCode);
  const aptCondition = factsOptions.quality.find((val) => val.value === property.activeSingleProperty.properties.building.apartmentQuality);
  let windowMaterials = '';
  if (property.activeSingleProperty.properties.building.windows) {
    property.activeSingleProperty.properties.building.windows.materials.map((mat, i) => {
      const windMat = factsOptions.windows.find((val) => val.value === mat);
      if (windMat) {
        windowMaterials += `${i !== 0 ? '<span>,&nbsp;</span>' : ''}<span>${windMat.label}</span>`;
      }
      return null;
    });
  }
  const condition = {
    'Building quality': buildQuality ? buildQuality.label : 0,
    'Building condition': buildCondition ? buildCondition.label : 0,
  };
  if (propTypeName === 'Apartment') {
    condition['Apartment condition'] = aptCondition ? aptCondition.label : 0;
  }
  condition['Window insulation'] = property.activeSingleProperty.properties.building.windows.insulation ? 'Yes' : 'No';
  condition['Window materials'] = windowMaterials;
  return condition;
};

export const infoDetails = (property) => {
  let heatingSystem = '';
  if (property.activeSingleProperty.properties.energy.heating) {
    property.activeSingleProperty.properties.energy.heating.map((mat, i) => {
      const heating = factsOptions.heating.find((val) => val.value === mat);
      if (heating) {
        heatingSystem += `${i !== 0 ? '<span>,&nbsp;</span>' : ''}<span>${heating.label}</span>`;
      }
      return null;
    });
  }
  const detail = {};
  if (property.activeSingleProperty.properties.energy.ac) detail['A/C'] = property.activeSingleProperty.properties.energy.ac ? 'Yes' : 'No';
  if (heatingSystem) detail['Heating system'] = heatingSystem;
  if (property.activeSingleProperty.properties.energy.solar) detail.Solar = property.activeSingleProperty.properties.energy.solar ? 'Yes' : 'No';
  if (property.activeSingleProperty.properties.energy.minergieCertified) detail['Minergie certified'] = property.activeSingleProperty.properties.energy.minergieCertified ? 'Yes' : 'No';
  if (property.activeSingleProperty.properties.building.expandableAttic) {
    const expandAttic = factsOptions.expandableAttic.find((val) => val.value === property.activeSingleProperty.properties.building.expandableAttic);
    detail['Expandable attic'] = expandAttic.label;
  }
  return detail;
};
