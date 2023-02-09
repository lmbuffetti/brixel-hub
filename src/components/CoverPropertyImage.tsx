import React, {useState} from 'react';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import resumeApartment from '../images/BrxielComingTown/resumeApartement.svg';
import resumeHouse from '../images/BrxielComingTown/resumeHouse.svg';
import type {CoverPropertyImageType} from '../@types/components/CoverPropertyImage';

// COMPONENT TO LOAD THE COVER IMAGE IF EXISTS OR LOAD THE DEFAULT IN BASE OF THE PROPERTY TYPE
const CoverPropertyImage = (props: CoverPropertyImageType) => {
  const {
    className = '',
    coverPhoto,
    loadedImg = () => '',
    onClick = () => '',
    onMouseLeave = () => '',
    onMouseEnter = () => '',
    propertyType,
    size = '',
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

export default CoverPropertyImage;
