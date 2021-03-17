/* eslint-disable no-nested-ternary */
import React from 'react';
import get from 'lodash/get';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SkeletonClosingCard from '../../images/skeleton-closing-tree.svg';

const ClosingTree = (props) => {
  const {
    type,
    windowDimensions,
    className,
  } = props;

  return (
    <>
      <img
        alt="Sckeleton Card Loading"
        id="cartello"
        src={SkeletonClosingCard}
        className={`notranslate ${type === 'map-view' ? '' : 'ml-1'} ${type === 'own' || type === 'map-view' ? windowDimensions.width < 590 ? 'w-perc-100 pr-2' : 'h-fix-208' : 'w-perc-100 pr-2'} ${className}`}
      />
      {
        type === 'map-view' && (
          <hr className="lighter my-3" />
        )
      }
    </>
  );
};

ClosingTree.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
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
