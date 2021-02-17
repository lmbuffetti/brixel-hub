/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SkeletonCard from '../../images/skeletonCard.svg';
import SkeletonHorizontalCard from '../../images/SkeletonHorizontalCard.svg';
import SkeletonMapCard from '../../images/skeletonMapCard.svg';

const CardImageText = (props) => {
  const {
    type,
    history,
    windowDimensions,
  } = props;

  return (
    <>
      <img
        alt="Sckeleton Card Loading"
        id="cartello"
        src={type === 'own' ? windowDimensions.width < 590 ? SkeletonCard : SkeletonHorizontalCard : history.location.pathname.includes('/home/') ? windowDimensions.width < 590 ? SkeletonCard : SkeletonMapCard : SkeletonCard}
        className={`notranslate ${type === 'map-view' ? '' : 'ml-1'} ${type === 'own' || type === 'map-view' ? windowDimensions.width < 590 ? 'w-perc-100 pr-2' : 'h-fix-208' : 'w-perc-100 pr-2'}`}
      />
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
  history: PropTypes.string.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps),
)(CardImageText);
