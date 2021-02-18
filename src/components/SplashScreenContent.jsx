import React, {
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import {
  bindActionCreators,
  compose,
} from 'redux';
import {
  connect,
} from 'react-redux';
import {
  BrixelButtonIcon, BrixelButtonSecondary, FormatValue,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { setSplashType } from '../actions/CommonActions';
import CoverPropertyImage from './CoverPropertyImage';
import { setActivePremarketProperty } from '../actions/PropertyActions';
import { updateFavorite } from '../actions/UserActions';

const SplashScreen = (props) => {
  const {
    activePreMarketProperty,
    closeLink,
    favoritesProperties,
    history,
    closeOutside,
    loggedInUser,
    isSmallLoading,
    setSplashScreen,
    setPreMarketProperty,
    handleUpdateFavorites,
  } = props;

  const drawerRef = useRef(null);

  // Function to close the drawer menus when we click outside
  useOutsideAlerter(drawerRef, {
    action: 'function',
    func: () => {
      if (closeOutside === true) {
        document.body.classList.remove('ov-h');
        history.push(closeLink);
      }
    },
  });

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

  const SplashScreenPreMarket = () => (
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
                  <h6 className="fweight-500 txtDark700 ellipsis one max-w-fix-304">{get(activePreMarketProperty, 'title', '')}</h6>

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
  );

  return (
    <SplashScreenPreMarket />
  );
};

SplashScreen.propTypes = {
  activePreMarketProperty: PropTypes.object,
  closeLink: PropTypes.string,
  closeOutside: PropTypes.bool,
  favoritesProperties: PropTypes.object,
  loggedInUser: PropTypes.object,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.string,
  setSplashScreen: PropTypes.func,
  setPreMarketProperty: PropTypes.func,
  handleUpdateFavorites: PropTypes.func,
};

SplashScreen.defaultProps = {
  activePreMarketProperty: {},
  closeLink: null,
  closeOutside: false,
  favoritesProperties: {},
  loggedInUser: {},
  isSmallLoading: null,
  setSplashScreen: () => '',
  setPreMarketProperty: () => '',
  handleUpdateFavorites: () => '',
};

const mapStateToProps = (state) => ({
  activePreMarketProperty: get(state, 'property.activePreMarketProperty', {}),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
  setPreMarketProperty: bindActionCreators(setActivePremarketProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SplashScreen);
