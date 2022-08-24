import React, { useState } from 'react';
import PropTypes from 'prop-types';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import resumeApartment from '../images/BrxielComingTown/resumeApartement.svg';
import resumeHouse from '../images/BrxielComingTown/resumeHouse.svg';

// COMPONENT TO LOAD THE COVER IMAGE IF EXISTS OR LOAD THE DEFAULT IN BASE OF THE PROPERTY TYPE
const CoverPropertyImage = (props) => {
  const {
    className,
    coverPhoto,
    loadedImg,
    onClick,
    onMouseLeave,
    onMouseEnter,
    propertyType,
    size,
  } = props;

  const [loadDefImg, setLoadDefImg] = useState(false);

  const onErrorLoadImg = () => {
    setTimeout(() => loadedImg(true), 100);
    setLoadDefImg(true);
  };

  return (
    <>
      {
        coverPhoto && !loadDefImg ? (
          <img
            loading="lazy"
            onClick={() => onClick()}
            onMouseEnter={(e) => onMouseEnter(e)}
            onMouseLeave={(e) => onMouseLeave(e)}
            onLoad={() => setTimeout(() => loadedImg(true), 100)}
            onError={() => onErrorLoadImg()}
            className={className}
            src={`${baseByData.shortPath}${coverPhoto}`}
            alt={`Cover ${propertyType}`}
            width={`${size}px`}
          />
        ) : (
          <img
            loading="lazy"
            onClick={() => onClick()}
            onMouseEnter={(e) => onMouseEnter(e)}
            onMouseLeave={(e) => onMouseLeave(e)}
            onLoad={() => setTimeout(() => loadedImg(true), 100)}
            onError={() => onErrorLoadImg()}
            className={className}
            src={propertyType === 'Apartment' ? resumeApartment : resumeHouse}
            alt={propertyType || 'Apartment'}
            width={`${size}px`}
          />
        )
      }
    </>
  );
};

CoverPropertyImage.propTypes = {
  className: PropTypes.string,
  coverPhoto: PropTypes.string,
  loadedImg: PropTypes.func,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  propertyType: PropTypes.string,
  size: PropTypes.string,
};

CoverPropertyImage.defaultProps = {
  className: '',
  coverPhoto: null,
  loadedImg: () => '',
  onClick: () => '',
  onMouseEnter: () => '',
  onMouseLeave: () => '',
  propertyType: null,
  size: '',
};

export default CoverPropertyImage;
