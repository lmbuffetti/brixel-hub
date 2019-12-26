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
      { attribute: 'price', value: (property.property.price.total || 0) / maxPriceRatio },
      { attribute: 'price_m2', value: (property.property.price.pricePerM2 || 0) / maxPriceM2Ratio },
      { attribute: 'living_space', value: (property.property.properties.typology.livingArea.value || 0) / maxLivingSpaceRatio },
    ],
  ]
);

export const rangeGraphCircle = (property, currency, lang) => {
  const filtLang = Object.keys(configLang).find((key) => configLang[key].code === lang);
  const defaultUnit = configLang[filtLang] ? configLang[filtLang].sqm : 'm2';
  const unit = (val) => (configureStore.getState().common.language.convertUnit ? configureStore.getState().common.language.convertUnit[val] : defaultUnit);
  const curLang = configLang[filtLang] || {};
  const localTotal = property.property.price.total ? +property.property.price.total : 0;
  const localSpace = property.property.properties.typology.livingArea ? +property.property.properties.typology.livingArea.value : 0;
  const localPriceSpace = property.property.price.pricePerM2 ? +property.property.price.pricePerM2 : 0;
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
            tooltip: `${localSpace.toLocaleString(curLang.localString)} ${unit(property.property.properties.typology.livingArea.unit || 'sqm')}`,
            color: 'blue',
          },
          {
            axis: 'price_m2',
            value: (property.property.price.pricePerM2 || 0) / maxPriceM2Ratio,
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
            tooltip: `${marketSpace} ${unit(property.property.properties.typology.livingArea.unit || 'sqm')}`,
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
  const buildingType = factsOptions.typeFlatBuildingCode.find((val) => val.value === property.property.properties.building.typeFlatBuildingCode);
  const aptType = factsOptions.typeFlatCode.find((val) => val.value === property.property.properties.building.typeFlatCode);
  const houseType = factsOptions.typeHouseCode.find((val) => val.value === property.property.properties.building.typeHouseCode);
  const defaultUnit = configLang[filtLang] ? configLang[filtLang].sqm : 'm2';
  const unit = (val) => (configureStore.getState().common.language.convertUnit ? configureStore.getState().common.language.convertUnit[val] : defaultUnit);
  const propTypeName = property.property.properties.propertyType === 'Apartment' ? 'Apartment' : 'House';
  const facts = {};
  facts['Property type'] = property.property.properties.propertyType;
  if (getDevMode()) {
    console.log('KEY FACTS', filtLang, configLang, curLang, lang, unit(property.property.properties.typology.livingArea.unit), property.property.properties.typology.livingArea.unit);
  }
  if (property.property.properties.propertyType === 'Apartment') {
    facts['Building type'] = buildingType ? buildingType.label : '';
  }
  if (aptType) {
    facts[`${propTypeName} type`] = aptType ? aptType.label : '';
  }
  if (houseType) {
    facts[`${propTypeName} type`] = houseType ? houseType.label : '';
  }
  facts['Living space'] = `${property.property.properties.typology.livingArea.value} ${unit(property.property.properties.typology.livingArea.unit || 'sqm')}`;
  facts[domain === 'pt' ? 'Tipology' : 'Nr. of rooms'] = `${domain === 'pt' ? 'T' : ''}${property.property.properties.typology.bedrooms}`;
  facts['Nr. of bathrooms'] = property.property.properties.typology.bathrooms;
  facts['Nr. of separate toilets'] = property.property.properties.typology.separateToilets;
  facts['Holiday Home'] = property.property.properties.building.secondaryResidence === 1 ? 'Yes' : 'No';

  if (+property.property.properties.parking.garage > 0) {
    facts['Garage Parking'] = property.property.properties.parking.garage;

    if (+property.property.properties.parking.garagePrice > 0) {
      facts['Garage Parking'] += `, ${currency} ${(property.property.properties.parking.garagePrice).toLocaleString(curLang.localString)}`;
    }
  }

  if (+property.property.properties.parking.outside > 0) {
    facts['External Parking'] = property.property.properties.parking.outside;

    if (+property.property.properties.parking.outsidePrice > 0) {
      facts['External Parking'] += `, ${currency} ${(property.property.properties.parking.outsidePrice).toLocaleString(curLang.localString)}`;
    }
  }

  if (+property.property.properties.parking.underground > 0) {
    facts['Underground Parking'] = property.property.properties.parking.underground;

    if (+property.property.properties.parking.undergroundPrice > 0) {
      facts['Underground Parking'] += `, ${currency} ${(property.property.properties.parking.undergroundPrice).toLocaleString(curLang.localString)}`;
    }
  }
  if (property.property.properties.typology.availability) {
    facts.Availability = property.property.properties.typology.availability === 'other' ? property.property.properties.typology.availabilityText : property.property.properties.typology.availability;
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
    'Property price': `${currency} ${property.property.price.total.toLocaleString(curLang.localString)}`,
    'Sqm price': property.property.price.pricePerM2 ? `${currency} ${roundHundred(property.property.price.pricePerM2).toLocaleString(curLang.localString)}` : 0,
  };
  if (property.property.properties.building.maintenanceCost > 0) {
    cost['Additional cost/year'] = `${currency} ${property.property.properties.building.maintenanceCost.toLocaleString(curLang.localString)}`;
  }
  if (property.property.price.notional > 0) {
    cost['Notional rental value'] = `${currency} ${property.property.price.notional.toLocaleString(curLang.localString)}`;
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
  if (property.property.properties.building.ownershipPermil) {
    detail['Co-ownership'] = `${property.property.properties.building.ownershipPermil}%`;
  }
  if (property.property.properties.building.renewalTotalAmount && property.property.properties.building.renewalTotalAmount.value > 0) {
    detail['Renewal funds (total)'] = `${currency} ${property.property.properties.building.renewalTotalAmount.value.toLocaleString(curLang.localString)}`;
  }
  if (property.property.properties.building.renewalOwnerAmount && property.property.properties.building.renewalOwnerAmount.value > 0) {
    detail['Renewal funds (owner share)'] = `${currency} ${property.property.properties.building.renewalOwnerAmount.value.toLocaleString(curLang.localString)}`;
  }
  if (property.property.properties.typology.numberOfFlats) {
    detail['Apartments in building'] = property.property.properties.typology.numberOfFlats;
  }
  if (property.property.properties.typology.numberOfFloors) {
    detail['Number of floors'] = property.property.properties.typology.numberOfFloors;
  }
  if (property.property.properties.typology.ownershipPermil) {
    detail['Floor number'] = property.property.properties.typology.ownershipPermil;
  }
  if (property.property.properties.typology.basement) {
    detail['With basement'] = property.property.properties.typology.basement ? 'Yes' : 'No';
  }
  if (property.property.properties.typology.basementArea && property.property.properties.typology.basementArea.value > 0) {
    detail['Basement size'] = `${property.property.properties.typology.basementArea.value} ${unit(property.property.properties.typology.basementArea.unit)}`;
  }
  if (property.property.properties.typology.balconyArea && property.property.properties.typology.balconyArea.value > 0) {
    detail['Balcony surface'] = `${property.property.properties.typology.balconyArea.value} ${unit(property.property.properties.typology.balconyArea.unit)}`;
  }
  if (property.property.properties.typology.gardenArea && property.property.properties.typology.gardenArea.value > 0) {
    detail['Garden surface'] = `${property.property.properties.typology.gardenArea.value} ${unit(property.property.properties.typology.gardenArea.unit)}`;
  }
  return detail;
};

export const communities = (property) => {
  const community = {};
  if (property.property.location.community) {
    if (property.property.location.community.basisTaxation) {
      community['Basis of taxation'] = property.property.location.community.basisTaxation;
    }
    if (property.property.location.community.population) {
      community.Population = property.property.location.community.population;
    }
    if (property.property.location.community.altitude) {
      community.Altitude = property.property.location.community.altitude;
    }
    if (property.property.location.community.area) {
      community.Area = property.property.location.community.area;
    }
  }
  return community;
};

export const distances = (property) => {
  const distance = {};
  if (property.property.location.distances) {
    if (property.property.location.distances.publicTransport && property.property.location.distances.publicTransport !== 0) {
      distance['Public transport'] = property.property.location.distances.publicTransport;
    }
    if (property.property.location.distances.shopping && property.property.location.distances.shopping !== 0) {
      distance.Shopping = property.property.location.distances.shopping;
    }
    if (property.property.location.distances.highway && property.property.location.distances.highway !== 0) {
      distance.Highway = property.property.location.distances.highway;
    }
    if (property.property.location.distances.kindergarten && property.property.location.distances.kindergarten !== 0) {
      distance.Kindergarten = property.property.location.distances.kindergarten;
    }
    if (property.property.location.distances.primarySchool && property.property.location.distances.primarySchool !== 0) {
      distance['Primary school'] = property.property.location.distances.primarySchool;
    }
    if (property.property.location.distances.highSchool && property.property.location.distances.highSchool !== 0) {
      distance['High school'] = property.property.location.distances.highSchool;
    }
    if (property.property.location.distances.nature && property.property.location.distances.nature !== 0) {
      distance.Nature = property.property.location.distances.nature;
    }
  }
  return distance;
};

export const constructions = (property) => {
  const propTypeName = property.property.properties.propertyType === 'Apartment' ? 'Apartment' : 'House';
  const construction = {};
  if (property.property.properties.building.built) construction['Costruction Year'] = property.property.properties.building.built;
  if (property.property.properties.building.renovated) construction['Renovation Year'] = property.property.properties.building.renovated;
  if (property.property.properties.building.landRegister && property.property.properties.building.landRegister.cadaster) construction.Cadaster = property.property.properties.building.landRegister.cadaster;
  if (propTypeName === 'Apartment' && property.property.properties.building && property.property.properties.building.landRegister && property.property.properties.building.landRegister.propertyIndex) {
    construction['Official apartment nr.'] = property.property.properties.building.landRegister.propertyIndex;
  }
  construction.Servitudes = property.property.properties.building.valueRelevantServitude !== 0 ? 'Yes' : 'No';
  return construction;
};

export const conditions = (property) => {
  const propTypeName = property.property.properties.propertyType === 'Apartment' ? 'Apartment' : 'House';
  const buildQuality = factsOptions.quality.find((val) => val.value === property.property.properties.building.quality);
  const buildCondition = factsOptions.quality.find((val) => val.value === property.property.properties.building.conditionCode);
  const aptCondition = factsOptions.quality.find((val) => val.value === property.property.properties.building.apartmentQuality);
  let windowMaterials = '';
  if (property.property.properties.building.windows) {
    property.property.properties.building.windows.materials.map((mat, i) => {
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
  condition['Window insulation'] = property.property.properties.building.windows.insulation ? 'Yes' : 'No';
  condition['Window materials'] = windowMaterials;
  return condition;
};

export const infoDetails = (property) => {
  let heatingSystem = '';
  if (property.property.properties.energy.heating) {
    property.property.properties.energy.heating.map((mat, i) => {
      const heating = factsOptions.heating.find((val) => val.value === mat);
      if (heating) {
        heatingSystem += `${i !== 0 ? '<span>,&nbsp;</span>' : ''}<span>${heating.label}</span>`;
      }
      return null;
    });
  }
  const detail = {};
  if (property.property.properties.energy.ac) detail['A/C'] = property.property.properties.energy.ac ? 'Yes' : 'No';
  if (heatingSystem) detail['Heating system'] = heatingSystem;
  if (property.property.properties.energy.solar) detail.Solar = property.property.properties.energy.solar ? 'Yes' : 'No';
  if (property.property.properties.energy.minergieCertified) detail['Minergie certified'] = property.property.properties.energy.minergieCertified ? 'Yes' : 'No';
  if (property.property.properties.building.expandableAttic) {
    const expandAttic = factsOptions.expandableAttic.find((val) => val.value === property.property.properties.building.expandableAttic);
    detail['Expandable attic'] = expandAttic.label;
  }
  return detail;
};
