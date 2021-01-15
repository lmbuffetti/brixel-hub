import React from 'react';
import SkeletonCard from '../../images/skeletonCard.svg';

const CardImageText = (props) => {
  const {

  } = props;

  return (
    <img
      id="cartello"
      src={SkeletonCard}
      className="w-perc-90"
    />
  );
};

export default CardImageText;
