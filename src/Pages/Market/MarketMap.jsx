/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

const MarketMap = (props) => {
  // PROPS
  const {
    windowDimensions,
  } = props;

  return (
    <div>
      <h3>MapLevel</h3>
    </div>
  );
};

MarketMap.propTypes = {
  windowDimensions: PropTypes.object.isRequired,
};

MarketMap.defaultProps = {
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketMap);
