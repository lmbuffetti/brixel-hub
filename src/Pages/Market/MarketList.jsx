/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import Loadable from 'react-loadable';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Sticker from 'react-stickyfill';
import { getFavoritesProperties, getSellerProperties } from '../../actions/MarketActions';

const MarketMap = Loadable({
  loader: () => import('./MarketMap' /* webpackChunkName: "MarketMap" */),
  loading: () => null,
});

const MarketList = (props) => {
  // PROPS
  const {
    history,
    loggedInUser,
    favoritesMarketProperties,
    handleGetFavoritesProperties,
    handleGetSellerProperties,
    match,
    sellerMarketProperties,
  } = props;
  // STATE
  const [activeProperty, setActiveProperty] = useState(null);
  const [propertyListings, setPropertyListings] = useState([]);
  // URL PARAMS
  const catName = get(match, 'params.cat', null);

  useEffect(() => {
    if (loggedInUser.id) {
      switch (catName) {
        case 'own': {
          const data = {
            limit: 50,
            offset: `0/?owner=${loggedInUser.id}`,
            userId: loggedInUser.id,
            setAsSingle: true,
            multiLoader: true,
          };
          handleGetSellerProperties(data);
          break;
        }
        case 'favorites': {
          handleGetFavoritesProperties();
          break;
        }
        default:
          history.push('/home');
      }
    }
  }, [loggedInUser]);

  useEffect(() => {
    switch (catName) {
      case 'own': {
        setPropertyListings(sellerMarketProperties);
        break;
      }
      case 'favorites': {
        setPropertyListings(favoritesMarketProperties);
        break;
      }
      default:
        setPropertyListings([]);
    }
  }, [sellerMarketProperties, favoritesMarketProperties]);

  return (
    <>
      <div className="firstLevel mx-md-2 w-perc-100 dis-f">
        <div>
          <div className="dis-f jc-fs a-c mb-3">
            <BrixelButtonIcon
              onClick={() => history.push('/home')}
              icon="arrow-simple-left"
            />
            <h3 className="ml-2">{catName}</h3>
          </div>
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
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetSellerProperties: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  sellerMarketProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  favoritesMarketProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

MarketList.defaultProps = {

};

const mapStateToProps = (state) => ({
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  favoritesMarketProperties: get(state, 'market.favoritesProperties', []),
  sellerMarketProperties: get(state, 'market.sellerProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getSellerProperties, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketList);
