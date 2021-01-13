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
    loggedInUser,
    handleGetSellerProperties,
    sellerMarketProperties,
  } = props;
  // STATE
  const [activeProperty, setActiveProperty] = useState(null);
  const [propertyListings, setPropertyListings] = useState([]);

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

  useEffect(() => {
    setPropertyListings(sellerMarketProperties);
  }, [sellerMarketProperties]);

  return (
    <>
      <div className="firstLevel mx-md-2 w-perc-100 dis-f">
        <div>
          <h1>PROP LIST</h1>
          {
            propertyListings.map((page, i) => (
              <div
                className={`${activeProperty === page.id ? 'bgGreen400' : 'bgRed100'} mb-3`}
                key={i.toString()}
                onClick={() => setActiveProperty(page.id)}
              >
                <p>{i + 1} - {page.id}</p>
                <p>{get(page, 'location.longitude', 0)} - {get(page, 'location.latitude', 0)}</p>
              </div>
            ))
          }
        </div>
        <Sticker>
          <div className="secondLevel w-perc-100 dis-fl-col ml-md">
            <MarketMap
              activeProperty={activeProperty}
              onActiveProperty={(val) => setActiveProperty(val)}
              properties={propertyListings}
            />
          </div>
        </Sticker>
      </div>
    </>
  );
};

MarketList.propTypes = {
  handleGetSellerProperties: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  sellerMarketProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MarketList.defaultProps = {

};

const mapStateToProps = (state) => ({
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  sellerMarketProperties: get(state, 'market.sellerProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetSellerProperties: bindActionCreators(getSellerProperties, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
