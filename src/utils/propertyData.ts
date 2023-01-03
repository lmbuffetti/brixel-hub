// import React from 'react';
import {FactsOptions} from '@brixel/brixel-components';
import get from 'lodash/get';

const { factsOptions } = FactsOptions;

export const fullExtraFeatures = (property) => {
  const defaultExtraFeatures = get(property, 'properties.extraFeatures', {});
  const garage = get(property, 'properties.parking.garage', 0);
  const outside = get(property, 'properties.parking.outside', 0);
  const underground = get(property, 'properties.parking.underground', 0);
  const extraFeatures = [];
  if (get(property, 'properties.typology.basementArea.value', 0) > 0) {
    extraFeatures.push({
      icon: 'cellar',
      label: 'Basement',
      subtitle: `${get(property, 'properties.typology.basementArea.value', 0)} m2`,
    });
  }
  if (get(property, 'properties.typology.balconyArea.value', 0) > 0) {
    extraFeatures.push({
      icon: 'balcony',
      label: 'Balcony',
      subtitle: `${get(property, 'properties.typology.balconyArea.value', 0)} m2`,
    });
  }
  if (get(property, 'properties.typology.gardenArea.value', 0) > 0) {
    extraFeatures.push({
      icon: 'garden',
      label: 'Garden',
      subtitle: `${get(property, 'properties.typology.gardenArea.value', 0)} m2`,
    });
  }
  if (get(property, 'properties.typology.terraceArea.value', 0) > 0) {
    extraFeatures.push({
      icon: 'terrace',
      label: 'Terrace',
      subtitle: `${get(property, 'properties.typology.terraceArea.value', 0)} m2`,
    });
  }
  if (get(property, 'properties.typology.loggiaArea.value', 0) > 0) {
    extraFeatures.push({
      icon: 'loggia',
      label: 'Loggia',
      subtitle: `${get(property, 'properties.typology.loggiaArea.value', 0)} m2`,
    });
  }
  if (get(property, 'properties.energy.ac', false)) {
    extraFeatures.push({
      icon: 'air-condition',
      label: 'Air condition',
      subtitle: null,
    });
  }
  if (get(property, 'properties.energy.heating', []).includes('solar')) {
    extraFeatures.push({
      icon: 'solar',
      label: 'Solar',
      subtitle: null,
    });
  }
  if (garage > 0 || outside > 0 || underground > 0) {
    extraFeatures.push({
      icon: 'parking',
      label: 'Parking',
      subtitle: null,
    });
  }

  Object.keys(defaultExtraFeatures).forEach((key) => {
    if (key !== 'none' && defaultExtraFeatures[key]) {
      const objExtra = factsOptions.extraFeature.find((val) => val.value === key);
      if (get(objExtra, 'icon', null) && objExtra.value !== 'loggia') {
        extraFeatures.push({
          icon: get(objExtra, 'icon', ''),
          label: get(objExtra, 'label', ''),
          subtitle: null,
        });
      }
    }
  });
  return extraFeatures;
};
