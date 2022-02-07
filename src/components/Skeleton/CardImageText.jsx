/* eslint-disable no-nested-ternary */
import React from 'react';
import get from 'lodash/get';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SkeletonCard from '../../images/skeletonCard.svg';
import SkeletonOwnCard from '../../images/Market/skeletonOwnCard.svg';
import SkeletonMapCard from '../../images/skeletonMapCard.svg';
import SkeletonCardOwnMobile from '../../images/Market/skeletonCardMobile.svg';
import SkeletonFav from '../../images/Market/skeleton-property-thumb.svg';

const CardImageText = (props) => {
  const {
    type,
    windowDimensions,
    className,
  } = props;

  return (
    <>
      {
        (type === 'fav' || type === 'estimation') ? (
          <img alt="card loading" src={SkeletonFav} />
        ) : (
          <>
            <img
              alt="Sckeleton Card Loading"
              id="cartello"
              src={type === 'own' ? windowDimensions.width < 590 ? SkeletonCardOwnMobile : SkeletonOwnCard : type === 'map-view' ? windowDimensions.width < 590 ? SkeletonCard : SkeletonMapCard : SkeletonCard}
              className={`notranslate ${type === 'map-view' ? '' : type === 'own' ? '' : 'ml-1'} ${type === 'own' || type === 'map-view' ? windowDimensions.width < 590 ? 'w-perc-100 pr-2' : type === 'own' ? '' : 'h-fix-208' : 'w-perc-100 pr-2'} ${className}`}
            />
            {
              type === 'map-view' && (
                <hr className="lighter my-3" />
              )
            }
          </>
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
