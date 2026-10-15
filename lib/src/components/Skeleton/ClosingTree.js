import React from 'react';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SkeletonClosingCard from '@brixel-io/brixel-components/dist/images/Skeleton/Svg/skeleton-closing-tree.svg';
const ClosingTree = (props) => {
    const { className, } = props;
    return (React.createElement(React.Fragment, null,
        React.createElement("img", { loading: "lazy", alt: "Sckeleton Card Loading", id: "cartello", src: SkeletonClosingCard, width: "100%", className: `notranslate w-perc-100 ${className}` })));
};
const mapStateToProps = (state) => ({
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
export default compose(connect(mapStateToProps))(ClosingTree);
