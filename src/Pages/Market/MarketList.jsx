/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import Loadable from 'react-loadable';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Sticker from 'react-stickyfill';
import { getSellerProperties } from '../../actions/MarketActions';

const MarketMap = Loadable({
  loader: () => import('./MarketMap' /* webpackChunkName: "MarketMap" */),
  loading: () => null,
});

const MarketList = (props) => {
  // PROPS
  const {
    activeProperty,
    loggedInUser,
    handleGetSellerProperties,
    isMapActive,
    onActiveMap,
    onActiveProperty,
    windowDimensions,
  } = props;

  useEffect(() => {
    console.log('TEST');
    if (loggedInUser.id) {
      const data = {
        limit: 50,
        offset: `0/?owner=${loggedInUser.id}`,
        userId: loggedInUser.id,
        setAsSingle: true,
        multiLoader: true,
      };
      handleGetSellerProperties(data);
    }
  }, [loggedInUser]);

  return (
    <>
      <div className="firstLevel mx-md-2 w-perc-100">
        <h1>PROP LIST</h1>
      </div>
      <Sticker>
        <div className="secondLevel w-perc-100 dis-fl-col ml-md">
          <MarketMap
            activeProperty={activeProperty}
            // onActiveProperty={(val) => setActiveProperty(val)}
          />
        </div>
      </Sticker>
    </>
  );
};

MarketList.propTypes = {
  handleGetSellerProperties: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  activeProperty: PropTypes.string,
  isMapActive: PropTypes.bool.isRequired,
  onActiveProperty: PropTypes.func.isRequired,
  onActiveMap: PropTypes.func.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MarketList.defaultProps = {
  activeProperty: null,
};

const mapStateToProps = (state) => ({
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetSellerProperties: bindActionCreators(getSellerProperties, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
