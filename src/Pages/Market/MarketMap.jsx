/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { diff } from 'deep-object-diff';
import { bindActionCreators, compose } from 'redux';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { ComponentMap } from '../../components/Map/Map';

const MarketMapComponent = Loadable({
  loader: () => import('../../components/Map/MarketMapComponent' /* webpackChunkName: "MarketMapComponent" */),
  loading: () => null,
});

const MarketMap = (props) => {
  // PROPS
  const {
    onActiveProperty,
    sellerMarketProperties,
    windowDimensions,
  } = props;
  // STATE
  const [activeProperties, setActiveProperties] = useState(sellerMarketProperties);

  useEffect(() => {
    setActiveProperties(sellerMarketProperties);
  }, [sellerMarketProperties]);

  return (
    <div>
      <h3>MapLevel</h3>
      {
        activeProperties.length > 0 && (
          <MarketMapComponent
            onActiveProperty={(val) => onActiveProperty(val)}
            properties={activeProperties}
            visible
          />
        )
      }
    </div>
  );
};

MarketMap.propTypes = {
  onActiveProperty: PropTypes.func.isRequired,
  sellerMarketProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MarketMap.defaultProps = {
};

const mapStateToProps = (state) => ({
  sellerMarketProperties: get(state, 'market.sellerProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketMap);
