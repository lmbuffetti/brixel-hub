import React from 'react';
import get from 'lodash/get';
import {compose} from 'redux';
import {connect} from 'react-redux';
import SkeletonCard from '../../images/skeletonCard.svg';
import SkeletonOwnCard from '../../images/Market/skeletonOwnCard.svg';
import SkeletonMapCard from '../../images/skeletonMapCard.svg';
import SkeletonCardOwnMobile from '../../images/Market/skeletonCardMobile.svg';
import SkeletonFav from '../../images/Market/skeleton-property-thumb.svg';
import type {CardImageTextType} from '../../@types/components/Skeleton/CardImageText';

const CardImageText = (props: CardImageTextType) => {
  const {
    className = '',
    type,
    windowDimensions,
  } = props;

  const sourceSkeleton = () => {
    if (type === 'own') {
      if (windowDimensions.width < 590 ) return SkeletonCardOwnMobile;
      else return SkeletonOwnCard;
    }
    if (type === 'map-view') {
      if (windowDimensions.width < 590 ) return SkeletonCard;
      else return SkeletonMapCard;
    }
    return SkeletonCard;
  }

  const classSkeleton = () => {
    if (type === 'own' || type === 'map-view') {
      if (windowDimensions.width < 590 ) return 'w-perc-100 pr-2';
    }
    if (type === 'own') {
      if (windowDimensions.width >= 590 ) return 'h-fix-208';
    }
    return 'w-perc-100 pr-2';
  }

  return (
    <>
      {
        (type === 'fav' || type === 'estimation') ? (
          <img loading="lazy" alt="card loading" src={SkeletonFav} />
        ) : (
          <>
            <img
              loading="lazy"
              alt="Sckeleton Card Loading"
              id="cartello"
              src={sourceSkeleton()}
              className={`notranslate ${classSkeleton()} ${className}`}
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

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps),
)(CardImageText);
