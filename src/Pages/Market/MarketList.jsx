/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

const MarketList = (props) => {
  // PROPS
  const {
    isMapActive,
    onActiveMap,
    windowDimensions,
  } = props;

  return (
    <div>
      <h1>Property List</h1>
      <button
        onClick={() => onActiveMap(!isMapActive)}
      >
        OPEN MAP
      </button>
      <div className="bgPrimary400 h-fix-400" />
    </div>
  );
};

MarketList.propTypes = {
  isMapActive: PropTypes.bool.isRequired,
  onActiveMap: PropTypes.func.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MarketList.defaultProps = {
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
