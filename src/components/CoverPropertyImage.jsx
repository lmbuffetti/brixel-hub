import React from 'react';
import PropTypes from 'prop-types';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import resumeApartment from '../images/BrxielComingTown/resumeApartement.svg';
import resumeHouse from '../images/BrxielComingTown/resumeHouse.svg';

const CoverPropertyImage = (props) => {
  const {
    className,
    coverPhoto,
    propertyType,
    size,
  } = props;

  return (
    <>
      {
        coverPhoto ? (
          <img
            className={className}
            src={`${baseByData.shortPath}${coverPhoto}`}
            alt={`Cover ${propertyType}`}
            width={`${size}px`}
          />
        ) : (
          <img
            className={className}
            src={propertyType === 'Apartment' ? resumeApartment : resumeHouse}
            alt={propertyType || 'Apartment'}
            width={`${size}px`}
          />
        )
      }
    </>
  )
};

CoverPropertyImage.propTypes = {
  className: PropTypes.string,
  coverPhoto: PropTypes.string,
  propertyType: PropTypes.string,
  size: PropTypes.number,
};

CoverPropertyImage.defaultProps = {
  className: '',
  coverPhoto: null,
  propertyType: null,
  size: 56,
};

export default CoverPropertyImage;
