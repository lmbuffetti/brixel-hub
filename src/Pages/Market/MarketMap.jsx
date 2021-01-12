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
    sellerMarketProperties,
    windowDimensions,
  } = props;
  // STATE
  const [activeProperties, setActiveProperties] = useState(sellerMarketProperties);

  return (
    <div>
      <h3>MapLevel</h3>
      {
        activeProperties.length > 0 && (
          <MarketMapComponent
            properties={activeProperties}
            visible
          />
        )
      }
    </div>
  );
};

MarketMap.propTypes = {
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
