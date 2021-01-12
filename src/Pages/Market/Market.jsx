/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Sticker from 'react-stickyfill';
import Loadable from 'react-loadable';
import { getSellerProperties } from '../../actions/MarketActions';
import '../../styles/SCSS/pages/market.scss';

const MarketList = Loadable({
  loader: () => import('./MarketList' /* webpackChunkName: "MarketList" */),
  loading: () => null,
});

const MarketMap = Loadable({
  loader: () => import('./MarketMap' /* webpackChunkName: "MarketMap" */),
  loading: () => null,
});

const Market = (props) => {
  // PROPS
  const {
    handleGetSellerProperties,
    loggedInUser,
    windowDimensions,
  } = props;
  // STATE
  const [isMapActive, setIsMapActive] = useState(false);

  useEffect(() => {
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
    <div className="market-container" id="market">
      <div className="dis-f a-t jc-c pos-r-md">
        <div className="firstLevel mx-md-2 w-perc-100">
          <MarketList
            onActiveMap={(val) => setIsMapActive(val)}
            isMapActive={isMapActive}
          />
        </div>
        <Sticker>
          {
            isMapActive && (
              <div className="secondLevel w-perc-100 dis-fl-col ml-md">
                <MarketMap />
              </div>
            )
          }
        </Sticker>
      </div>
    </div>
  );
};

Market.propTypes = {
  handleGetSellerProperties: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

Market.defaultProps = {
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
)(Market);
