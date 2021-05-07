/* eslint-disable no-nested-ternary */
import React from 'react';
import get from 'lodash/get';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SkeletonCard from '../../images/skeletonCard.svg';
import SkeletonOwnCard from '../../images/skeletonOwnCard.svg';
import SkeletonMapCard from '../../images/skeletonMapCard.svg';

const CardImageText = (props) => {
  const {
    type,
    windowDimensions,
    className,
  } = props;

  return (
    <>
      {
        type !== 'own' && (
          <img
            alt="Sckeleton Card Loading"
            id="cartello"
            src={type === 'own' ? windowDimensions.width < 590 ? SkeletonCard : SkeletonOwnCard : type === 'map-view' ? windowDimensions.width < 590 ? SkeletonCard : SkeletonMapCard : SkeletonCard}
            className={`notranslate ${type === 'map-view' ? '' : 'ml-1'} ${type === 'own' || type === 'map-view' ? windowDimensions.width < 590 ? 'w-perc-100 pr-2' : 'h-fix-208' : 'w-perc-100 pr-2'} ${className}`}
          />
        )
      }
      {
        type === 'map-view' && (
          <hr className="lighter my-3" />
        )
      }
    </>
  );
};

CardImageText.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

CardImageText.defaultProps = {
  className: '',
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps),
)(CardImageText);
