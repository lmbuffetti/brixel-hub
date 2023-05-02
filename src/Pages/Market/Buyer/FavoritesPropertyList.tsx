import get from 'lodash/get';
import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import MarketCardFavorites from '../../../components/Cards/MarketCardFavorites';
import type {FavoritesPropertyListType} from '../../../@types/Pages/Market/Buyer/FavoritesPropertyList';

const FavoritesPropertyList = (props: FavoritesPropertyListType) => {
  const {
    lang,
    skeleton,
    wishlistProperties,
  } = props;
  // STATE
  return (
    <>
      {
        skeleton.wishlist ? (
          <>
            {
              [...Array(3)].map((_x, i) => (
                <div
                  key={`skeleton${i.toString()}`}
                  className="w-perc-100 pb-2"
                >
                  <div className="dis-f a-t brdRadius ov-h">
                    <div className="h-fix-208 w-fix-flex-320 pos-r skeletonBgInner w-perc-100" />
                    <div className="w-perc-100 pl-2">
                      <div className="h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-100" />
                      <div className="h-fix-40 mt-2 skeletonBgInner w-perc-100" />
                      <div className="h-fix-16 mt-1 skeletonBgInner w-perc-100" />
                      <div className="h-fix-40 mt-2 skeletonBgInner w-perc-100" />
                    </div>
                  </div>
                </div>
              ))
            }
          </>
        ): (
          <>
            {
              get(wishlistProperties, 'data', []).map((item, index) => (
                <MarketCardFavorites
                  key={`cardFavorites-${index.toString()}`}
                  activeSingleProperty={item}
                  lang={lang}
                />
              ))
            }
          </>
        )
      }
    </>
  )
}

const mapStateToProps = (state) => ({
  lang: get(state, 'common.language', 'en'),
  skeleton: get(state, 'common.skeleton', {}),
  wishlistProperties: get(state, 'market.wishlistProperties', {}),
})

export default compose(
  connect(mapStateToProps, null),
)(FavoritesPropertyList);
