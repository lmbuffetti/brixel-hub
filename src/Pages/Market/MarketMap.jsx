/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import MarketMapComponent from '../../components/Map/MarketMapComponent';

const MarketMap = (props) => {
  // PROPS
  const {
    activeProperty,
    onActiveProperty,
    properties,
    windowDimensions,
  } = props;

  return (
    <div className="map-inner">
      {
        properties.length > 0 && (
          <MarketMapComponent
            activeProperty={activeProperty}
            onActiveProperty={(val) => onActiveProperty(val)}
            properties={properties}
            visible
            subMinHeight="min-100v"
          />
        )
      }
    </div>
  );
};

MarketMap.propTypes = {
  activeProperty: PropTypes.string,
  onActiveProperty: PropTypes.func.isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MarketMap.defaultProps = {
  activeProperty: null,
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
