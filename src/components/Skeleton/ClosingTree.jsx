/* eslint-disable no-nested-ternary */
import React  from 'react';
import get from 'lodash/get';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SkeletonClosingCard from '@brixel/brixel-components/dist/images/Skeleton/Svg/skeleton-closing-tree.svg';

const ClosingTree = (props) => {
  const {
    className,
  } = props;

  return (
    <>
      <img
        alt="Sckeleton Card Loading"
        id="cartello"
        src={SkeletonClosingCard}
        className={`notranslate w-perc-100 bgWhite ${className}`}
      />
    </>
  );
};

ClosingTree.propTypes = {
  className: PropTypes.string,
};

ClosingTree.defaultProps = {
  className: '',
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps),
)(ClosingTree);
