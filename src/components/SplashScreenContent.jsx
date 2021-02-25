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
  BrixelButtonIcon,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { setSplashType } from '../actions/CommonActions';
import { setActiveMarketOverlayProperty } from '../actions/PropertyActions';
import { updateFavorite, addNotInterested } from '../actions/UserActions';
import MarketCardOverlay from './MarketCardOverlay';

const SplashScreen = (props) => {
  const {
    activeMarketOverlayProperty,
    closeLink,
    favoritesProperties,
    history,
    closeOutside,
    loggedInUser,
    isSmallLoading,
    setSplashScreen,
    setMarketOverlayProperty,
    handleUpdateFavorites,
    handleMarkNotInterested,
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
    const findIndex = favoritesProperties.data.findIndex((prop) => prop.id === activeMarketOverlayProperty.id);
    return findIndex > -1;
  };

  const saveFavorite = () => {
    const data = {
      act: checkFavorite() ? 'remove' : 'add',
      id: activeMarketOverlayProperty.id,
      property: activeMarketOverlayProperty,
      data: {
        email: get(loggedInUser, 'email', ''),
        language: loggedInUser.lang,
      },
    };
    handleUpdateFavorites(data);
  };

  const notInterested = () => {
    handleMarkNotInterested(activeMarketOverlayProperty.id);
  };

  const SplashScreenMarketOverlay = () => (
    <>
      <div className="dis-f jc-fe">
        <BrixelButtonIcon
          ghost
          theme="dark"
          icon="close-small"
          onClick={() => {
            setSplashScreen('');
            setMarketOverlayProperty({});
          }}
        />
      </div>
      <div className="dis-fl-col a-c jc-c">

        <MarketCardOverlay
          item={activeMarketOverlayProperty}
        />

        <div className="dis-fl-row jc-b a-c pos-r w-perc-100 p-3 shadow-1dp">
          <BrixelButtonIcon
            rounded
            ghost
            theme="dark"
            onClick={() => changeProperty('back')}
            icon="arrow-left-small"
          />
          <div className="dis-fl-row jc-c a-c">
            <BrixelButtonIcon
              rounded
              className="mr-4"
              theme="red"
              onClick={() => notInterested()}
              icon="close-small"
              isLoading={isSmallLoading === `notInterested-${activeMarketOverlayProperty.id}`}
            />
            <BrixelButtonIcon
              rounded
              theme="green"
              onClick={() => saveFavorite()}
              icon={checkFavorite() ? 'favorite-fill' : 'favorite'}
              isLoading={isSmallLoading === `favorite-${activeMarketOverlayProperty.id}`}
            />
          </div>
          <BrixelButtonIcon
            rounded
            ghost
            theme="dark"
            onClick={() => changeProperty('forward')}
            icon="arrow-right-small"
          />
        </div>
      </div>
    </>
  );

  return (
    <SplashScreenMarketOverlay />
  );
};

SplashScreen.propTypes = {
  activeMarketOverlayProperty: PropTypes.object,
  closeLink: PropTypes.string,
  closeOutside: PropTypes.bool,
  favoritesProperties: PropTypes.object,
  loggedInUser: PropTypes.object,
  history: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.string,
  setSplashScreen: PropTypes.func,
  setMarketOverlayProperty: PropTypes.func,
  handleUpdateFavorites: PropTypes.func,
  handleMarkNotInterested: PropTypes.func,
};

SplashScreen.defaultProps = {
  activeMarketOverlayProperty: {},
  closeLink: null,
  closeOutside: false,
  favoritesProperties: {},
  loggedInUser: {},
  isSmallLoading: null,
  setSplashScreen: () => '',
  setMarketOverlayProperty: () => '',
  handleUpdateFavorites: () => '',
  handleMarkNotInterested: () => '',
};

const mapStateToProps = (state) => ({
  activeMarketOverlayProperty: get(state, 'property.activeMarketOverlayProperty', {}),
  favoritesProperties: get(state, 'market.favoritesProperties', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', null),
  loggedInUser: get(state, 'user.loggedInUser.user', { }),
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdateFavorites: bindActionCreators(updateFavorite, dispatch),
  handleMarkNotInterested: bindActionCreators(addNotInterested, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
  setMarketOverlayProperty: bindActionCreators(setActiveMarketOverlayProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SplashScreen);
