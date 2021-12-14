/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes, useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  destroy,
} from '@brixel/brixel-components';
import {
  getFavoritesProperties,
  getOwnedProperties,
  getPremiumProperties,
} from '../../actions/MarketActions';
import '../../styles/SCSS/pages/market.scss';
import { setSplashType, spinnerOff } from '../../actions/CommonActions';
import { updateFavorite } from '../../actions/UserActions';

const MarketCategoryListSeller = lazy(() => import('./MarketCategoryListSeller'));

const MarketList = lazy(() => import('./MarketList'));

const MarketSeller = (props) => {
  const history = useNavigate();
  // PROPS
  const {
    destroyForm,
    handleGetFavoritesProperties,
    handleGetPremiumProperties,
    handleGetSellerProperties,
    handleSpinnerOff,
    loggedInUser,
  } = props;

  useEffect(() => { destroyForm(); }, [history.location.pathname]);

  useEffect(() => {
    if (loggedInUser.id) {
      const data = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        resultType: 'seller',
      };
      handleGetFavoritesProperties(data);
      handleGetSellerProperties(data);
      data.allCountry = true;
      handleGetPremiumProperties(data);
      handleSpinnerOff();
    }
  }, [loggedInUser]);
  console.log('eh')
  return (
    <Suspense fallback="">
      <div className="market-container sellerPage" id="market">
        {/* premarket overlay */}
        <Routes>
          <Route exact path="/sell" element={MarketCategoryListSeller} />
          <Route exact path="/sell/:cat/:id?" element={() => <MarketList isSeller />} />
        </Routes>
      </div>
    </Suspense>
  );
};

MarketSeller.propTypes = {
  destroyForm: PropTypes.func.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetSellerProperties: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MarketSeller);
