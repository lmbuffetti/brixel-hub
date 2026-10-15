import React, { useState } from 'react';
import { BrixelImage } from '@brixel-io/brixel-components';
import resumeApartment from '../images/BrxielComingTown/resumeApartement.svg';
import resumeHouse from '../images/BrxielComingTown/resumeHouse.svg';
// COMPONENT TO LOAD THE COVER IMAGE IF EXISTS OR LOAD THE DEFAULT IN BASE OF THE PROPERTY TYPE
const CoverPropertyImage = (props) => {
    const { className = '', coverPhoto, loadedImg = () => '', onClick = () => '', onMouseLeave = () => '', onMouseEnter = () => '', propertyType, size = '', } = props;
    const [loadDefImg, setLoadDefImg] = useState(false);
    const onErrorLoadImg = () => {
        setTimeout(() => loadedImg(true), 100);
        setLoadDefImg(true);
    };
    return (React.createElement(React.Fragment, null, coverPhoto && !loadDefImg ? (React.createElement(BrixelImage, { onClick: () => onClick(), onMouseEnter: () => onMouseEnter(), onMouseLeave: () => onMouseLeave(), onLoad: () => setTimeout(() => loadedImg(true), 100), onError: () => onErrorLoadImg(), className: className, url: coverPhoto, alt: `Cover ${propertyType}`, size: size })) : (React.createElement("img", { onClick: () => onClick(), onMouseEnter: () => onMouseEnter(), onMouseLeave: () => onMouseLeave(), onLoad: () => setTimeout(() => loadedImg(true), 100), onError: () => onErrorLoadImg(), className: className, src: propertyType === 'Apartment' ? resumeApartment : resumeHouse, alt: propertyType || 'Apartment', width: `${size}px` }))));
};
export default CoverPropertyImage;
