import get from 'lodash/get';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import MarketCardFavorites from '../../../components/Cards/MarketCardFavorites';
const FavoritesPropertyList = (props) => {
    const { lang, skeleton, wishlistProperties, } = props;
    // STATE
    return (React.createElement(React.Fragment, null, skeleton.wishlist ? (React.createElement(React.Fragment, null, [...Array(3)].map((_x, i) => (React.createElement("div", { key: `skeleton${i.toString()}`, className: "w-perc-100 pb-2" },
        React.createElement("div", { className: "dis-f a-t brdRadius ov-h" },
            React.createElement("div", { className: "h-fix-208 w-fix-flex-320 pos-r skeletonBgInner w-perc-100" }),
            React.createElement("div", { className: "w-perc-100 pl-2" },
                React.createElement("div", { className: "h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-100" }),
                React.createElement("div", { className: "h-fix-40 mt-2 skeletonBgInner w-perc-100" }),
                React.createElement("div", { className: "h-fix-16 mt-1 skeletonBgInner w-perc-100" }),
                React.createElement("div", { className: "h-fix-40 mt-2 skeletonBgInner w-perc-100" })))))))) : (React.createElement(React.Fragment, null, get(wishlistProperties, 'data', []).map((item, index) => (React.createElement(MarketCardFavorites, { key: `cardFavorites-${index.toString()}`, activeSingleProperty: item, lang: lang })))))));
};
const mapStateToProps = (state) => ({
    lang: get(state, 'common.language', 'en'),
    skeleton: get(state, 'common.skeleton', {}),
    wishlistProperties: get(state, 'market.wishlistProperties', {}),
});
export default compose(connect(mapStateToProps, null))(FavoritesPropertyList);
