/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
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
    onMarker,
    parentMarker,
    properties,
    type,
  } = props;

  return (
    <div className="map-inner">
      {
        properties.length > 0 && (
          <MarketMapComponent
            activeProperty={activeProperty}
            onActiveProperty={(val) => onActiveProperty(val)}
            onMarker={(val) => onMarker(val)}
            parentMarker={parentMarker || []}
            properties={properties}
            subMinHeight="full-h-map-wrapper"
            type={type}
            visible
          />
        )
      }
    </div>
  );
};

MarketMap.propTypes = {
  activeProperty: PropTypes.string,
  onActiveProperty: PropTypes.func.isRequired,
  onMarker: PropTypes.func.isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  parentMarker: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string,
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
  connect(mapStateToProps, mapDispatchToProps),
)(MarketMap);
