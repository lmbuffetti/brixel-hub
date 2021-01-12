/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';

const MarketMapComponent = Loadable({
  loader: () => import('../../components/Map/MarketMapComponent' /* webpackChunkName: "MarketMapComponent" */),
  loading: () => null,
});

const MarketMap = (props) => {
  // PROPS
  const {
    windowDimensions,
  } = props;

  return (
    <div>
      <h3>MapLevel</h3>
      <MarketMapComponent
        latitude={0}
        longitude={0}
        visible
      />
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
