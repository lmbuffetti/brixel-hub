import React from 'react';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SkeletonCard from '../../images/skeletonCard.svg';
import SkeletonOwnCard from '../../images/Market/skeletonOwnCard.svg';
import SkeletonMapCard from '../../images/skeletonMapCard.svg';
import SkeletonCardOwnMobile from '../../images/Market/skeletonCardMobile.svg';
import SkeletonFav from '../../images/Market/skeleton-property-thumb.svg';
const CardImageText = (props) => {
    const { className = '', type, windowDimensions, } = props;
    const sourceSkeleton = () => {
        if (type === 'own') {
            if (windowDimensions.width < 590)
                return SkeletonCardOwnMobile;
            else
                return SkeletonOwnCard;
        }
        if (type === 'map-view') {
            if (windowDimensions.width < 590)
                return SkeletonCard;
            else
                return SkeletonMapCard;
        }
        return SkeletonCard;
    };
    const classSkeleton = () => {
        if (type === 'own' || type === 'map-view') {
            if (windowDimensions.width < 590)
                return 'w-perc-100 pr-2';
        }
        if (type === 'own') {
            if (windowDimensions.width >= 590)
                return 'h-fix-208';
        }
        return 'w-perc-100 pr-2';
    };
    return (React.createElement(React.Fragment, null, (type === 'fav' || type === 'estimation') ? (React.createElement("img", { loading: "lazy", alt: "card loading", src: SkeletonFav })) : (React.createElement(React.Fragment, null,
        React.createElement("img", { loading: "lazy", alt: "Sckeleton Card Loading", id: "cartello", src: sourceSkeleton(), className: `notranslate ${classSkeleton()} ${className}` }),
        type === 'map-view' && (React.createElement("hr", { className: "lighter my-3" }))))));
};
const mapStateToProps = (state) => ({
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
export default compose(connect(mapStateToProps))(CardImageText);
