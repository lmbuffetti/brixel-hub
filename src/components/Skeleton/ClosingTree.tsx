import React from 'react';
import get from 'lodash/get';
import {compose} from 'redux';
import {connect} from 'react-redux';
import SkeletonClosingCard from '@brixel/brixel-components/dist/images/Skeleton/Svg/skeleton-closing-tree.svg';
import type {ClosingTreeType} from '../../@types/components/Skeleton/ClosingTree';

const ClosingTree = (props: ClosingTreeType) => {
  const {
    className,
  } = props;

  return (
    <>
      <img
        loading="lazy"
        alt="Sckeleton Card Loading"
        id="cartello"
        src={SkeletonClosingCard}
        width="100%"
        className={`notranslate w-perc-100 ${className}`}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps),
)(ClosingTree);
