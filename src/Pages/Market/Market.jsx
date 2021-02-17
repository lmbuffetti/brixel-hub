/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
  BrixelButtonIcon,
  destroy,
  FormatValue,
  BrixelButtonSecondary,
} from '@brixel/brixel-components';
import {
  getOwnedProperties, getFavoritesProperties, getNewProperties,
  getPremiumProperties, getPremarketProperties, getLastViewedProperties,
} from '../../actions/MarketActions';
import '../../styles/SCSS/pages/market.scss';
import { setSplashType, spinnerOff } from '../../actions/CommonActions';
import { getUserSearchProfiles } from '../../actions/SearchProfileActions';
import MarketList from './MarketList';
import SplashScreen from '../../components/SplashScreen';
import CoverPropertyImage from '../../components/CoverPropertyImage';
import { setActivePremarketProperty } from '../../actions/PropertyActions';
import { updateFavorite } from '../../actions/UserActions';

const MarketCategoryList = Loadable({
  loader: () => import('./MarketCategoryList' /* webpackChunkName: "MarketCategoryList" */),
  loading: () => null,
});

const Market = (props) => {
  // PROPS
  const {
    activePreMarketProperty,
    destroyForm,
    favoritesProperties,
    handleGetFavoritesProperties,
    handleGetLastViewedProperties,
    handleGetNewProperties,
    handleGetPreMarketProperties,
    handleGetPremiumProperties,
    handleGetSellerProperties,
    handleGetUserSearchProfiles,
    handleSpinnerOff,
    handleUpdateFavorites,
    history,
    isSmallLoading,
    loggedInUser,
    setPreMarketProperty,
    setSplashScreen,
    splashScreenType,
    userSearchProfiles,
  } = props;

  useEffect(() => { destroyForm(); }, [history.location.pathname]);

  const getProfileCountry = () => {
    let country = '';
    get(userSearchProfiles[0], 'location', []).forEach((loc, i) => {
      if (i === userSearchProfiles[0].location.length - 1) country += `${loc.countryCode}`;
      else country += `${loc.countryCode},`;
    });
    return country;
  };

  useEffect(() => {
    if (loggedInUser.id) {
      const data = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
      };
      handleGetSellerProperties(data);
      handleGetFavoritesProperties(data);
      handleGetLastViewedProperties();
      handleGetUserSearchProfiles(loggedInUser.id);
      handleSpinnerOff();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (userSearchProfiles) {
      const data = {
        resultsPerPage: 10,
        offset: 0,
        order: 'updatedAt',
        direction: 'DESC',
        setAsSingle: true,
        multiLoader: true,
        searchProfileId: get(userSearchProfiles[0], 'id', null),
      };

      handleGetNewProperties(data);
      handleGetPreMarketProperties(data);
      handleGetPremiumProperties(data);
      handleSpinnerOff();
    }
  }, [userSearchProfiles]);

  const checkFavorite = () => {
    const findIndex = favoritesProperties.data.findIndex((prop) => prop.id === activePreMarketProperty.id);
    return findIndex > -1;
  };

  const saveFavorite = () => {
    const data = {
      act: checkFavorite() ? 'remove' : 'add',
      id: activePreMarketProperty.id,
      property: activePreMarketProperty,
      data: {
        email: get(loggedInUser, 'email', ''),
        language: loggedInUser.lang,
      },
    };
    handleUpdateFavorites(data);
  };

  return (
    <div className={`market-container container ${!history.location.pathname.includes('home/') ? 'market-listings' : 'dis-f'}`} id="market">
      {/* premarket overlay */}
      {
        splashScreenType === 'preMarket' && (
          <SplashScreen
            className="result-popup"
            closeOutside={false}
          >
            <>
              <div className="dis-f jc-fe">
                <BrixelButtonIcon
                  ghost
                  theme="dark"
                  icon="close-small"
                  onClick={() => {
                    setSplashScreen('');
                    setPreMarketProperty({});
                  }}
                />
              </div>
              <div className="dis-fl-col a-c jc-c">
                <h3 className="ta-c">This is a pre-market property. </h3>

                <div className="prop-box min-w-fix-352 jc-c m-a dis-f py-4">
                  {
                    activePreMarketProperty.id && (
                      <>
                        <div className="pos-r min-w-fix-80">
                          <div className="tag-container">
                            <span className="type-tag pos-a non-favorite fsize-200 fweight-500 txtWhite bgPrimary zIndex1">
                              <span className="type">Pre</span>
                            </span>
                          </div>
                          <CoverPropertyImage
                            className="cover pre-market brdRadius w-fix-80 h-fix-80 pos-r"
                            coverPhoto={get(activePreMarketProperty, 'coverPhoto.galleryThumbnailPath', undefined)}
                            propertyType={get(activePreMarketProperty, 'properties.propertyType', undefined)}
                          />
                        </div>
                        <div className="dis-fl-col pl-2 jc-b">
                          <h6 className="fweight-500 txtDark700 ellipsis one">{get(activePreMarketProperty, 'title', '')}</h6>

                          <span className="fsize-300 txtDark700">{get(activePreMarketProperty, 'location.zip', '')} {get(activePreMarketProperty, 'location.city', '')}</span>

                          <div className="dis-fl-row flex-wrap a-c fsize-300 txtDark200">
                            <span>
                              {get(activePreMarketProperty, 'properties.propertyType', '')}
                            </span>
                            <span className="px-1"> &middot; </span>
                            <span>
                              <span>
                                {FormatValue.formatRooms(get(activePreMarketProperty, 'properties.typology.bedrooms', 0), get(activePreMarketProperty, 'location.countryCode', 'CH'))}
                              </span>
                              <span>
                                {get(activePreMarketProperty, 'location.countryCode', 'CH') === 'PT' ? '' : `${get(activePreMarketProperty, 'properties.typology.bedrooms', 0) ? ' Rooms' : ''}`}
                              </span>
                            </span>
                            {
                              get(activePreMarketProperty, 'properties.typology.bedrooms', 0) && (
                                <span className="px-1"> &middot; </span>
                              )
                            }
                            {
                              get(activePreMarketProperty, 'properties.typology.livingArea.value', 0) && (
                                <span>
                                  <span>
                                    {get(activePreMarketProperty, 'properties.typology.livingArea.value', 0)}
                                  </span>
                                  <span> m2</span>
                                </span>
                              )
                            }
                          </div>
                        </div>
                      </>
                    )
                  }
                </div>

                <span className="max-w-fix-536 fsize-300 ta-c txtDark200 py-2"> This property is not yet on sale and exclusively visible for registered buyers on Brixel. You can favorite this property to get informed about all updates from the owner. </span>

                <div className="dis-f jc-c a-c pos-r w-perc-100 pt-3 pb-2">
                  <BrixelButtonSecondary
                    rounded
                    label={checkFavorite() ? 'Remove from favorite' : 'Save as favorite'}
                    className="m-a"
                    theme="red"
                    onClick={() => saveFavorite()}
                    leftIcon={checkFavorite() ? 'favorite-fill' : 'favorite'}
                    isLoading={isSmallLoading === `favorite-${activePreMarketProperty.id}`}
                  />
                </div>
              </div>
            </>
          </SplashScreen>
        )
      }
      <Switch>
        <Route exact path="/home" component={MarketCategoryList} />
        <Route exact path="/home/:cat/:id?" component={MarketList} />
      </Switch>
    </div>
  );
};

Market.propTypes = {
  activePreMarketProperty: PropTypes.object.isRequired,
  destroyForm: PropTypes.func.isRequired,
  favoritesProperties: PropTypes.object.isRequired,
  handleGetFavoritesProperties: PropTypes.func.isRequired,
  handleGetLastViewedProperties: PropTypes.func.isRequired,
  handleGetNewProperties: PropTypes.func.isRequired,
  handleGetPreMarketProperties: PropTypes.func.isRequired,
  handleGetPremiumProperties: PropTypes.func.isRequired,
  handleGetSellerProperties: PropTypes.func.isRequired,
  handleGetUserSearchProfiles: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  handleUpdateFavorites: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  setPreMarketProperty: PropTypes.func.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  splashScreenType: PropTypes.string.isRequired,
  userSearchProfiles: PropTypes.arrayOf(PropTypes.object),
};

Market.defaultProps = {
  isSmallLoading: null,
  userSearchProfiles: null,
};

const mapStateToProps = (state) => ({
  activePreMarketProperty: get(state, 'property.activePreMarketProperty', {}),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
  splashScreenType: get(state, 'common.splashScreenType', ''),
  userSearchProfiles: get(state, 'user.userSearchProfiles', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('Property'));
  },
  handleGetFavoritesProperties: bindActionCreators(getFavoritesProperties, dispatch),
  handleGetLastViewedProperties: bindActionCreators(getLastViewedProperties, dispatch),
  handleGetNewProperties: bindActionCreators(getNewProperties, dispatch),
  handleGetPreMarketProperties: bindActionCreators(getPremarketProperties, dispatch),
  handleGetPremiumProperties: bindActionCreators(getPremiumProperties, dispatch),
  handleGetSellerProperties: bindActionCreators(getOwnedProperties, dispatch),
  handleGetUserSearchProfiles: bindActionCreators(getUserSearchProfiles, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  setPreMarketProperty: bindActionCreators(setActivePremarketProperty, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Market);
