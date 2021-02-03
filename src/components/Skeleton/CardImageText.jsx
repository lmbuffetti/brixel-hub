import React from 'react';
import PropTypes from 'prop-types';
import SkeletonCard from '../../images/skeletonCard.svg';
import SkeletonHorizontalCard from '../../images/SkeletonHorizontalCard.svg';

const CardImageText = (props) => {
  const {
    type,
  } = props;

  return (
    <img
      alt="Sckeleton Card Loading"
      id="cartello"
      src={type === 'CardImageTextVertical' ? SkeletonCard : SkeletonHorizontalCard}
      className="w-perc-90 mb-3"
    />
  );
};

CardImageText.propTypes = {
  type: PropTypes.string.isRequired,
};

export default CardImageText;
