/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import MarketMapComponent from '../../components/Map/MarketMapComponent';

const MarketMap = (props) => {
  // PROPS
  const {
    activeProperty,
    onActiveProperty,
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
            properties={properties}
            type={type}
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
  type: PropTypes.string,
};

MarketMap.defaultProps = {
  activeProperty: null,
  type: null,
};

const mapStateToProps = (state) => ({
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = () => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketMap);
