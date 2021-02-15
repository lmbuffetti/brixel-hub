/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setWindowDimensions } from '../../actions/CommonActions';
import MarketMapComponent from '../../components/Map/MarketMapComponent';

const MarketMap = (props) => {
  // PROPS
  const {
    activeProperty,
    onActiveProperty,
    properties,
    type,
    windowDimensions,
  } = props;

  /*  useEffect(() => {
    const mapEl = document.getElementsByClassName('full-h-map-wrapper')[0];
    if (mapEl) mapEl.height = windowDimensions.height;
    console.log(mapEl);
  }); */

  return (
    <div className="map-inner">
      {
        properties.length > 0 && (
          <MarketMapComponent
            activeProperty={activeProperty}
            onActiveProperty={(val) => onActiveProperty(val)}
            properties={properties}
            type={type}
            visible
            subMinHeight="full-h-map-wrapper"
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
  type: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

MarketMap.defaultProps = {
  activeProperty: null,
  type: null,
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketMap);
