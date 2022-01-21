/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  BrixelButtonIcon,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';

import {
  getUserProperties,
  getFavorites,
} from '../../actions/UserActions';
import lazyWithRetry from '../../components/LazyWithRetry';

const PropertyList = lazyWithRetry(() => import('./PropertyList'));

const Properties = (props) => {
  // PROPS
  const {
    closeProperty,
    // handleGetFavorites,
    handleGetUserProperties,
    favoritesProperties,
    user,
    userProperties,
  } = props;
  // STATE
  // const [activeTab, setActiveTab] = useState('');
  const activeTab = '';

  // GET USER PROPERTIES LIST
  useEffect(() => {
    if (get(user, 'user.id')) {
      handleGetUserProperties(user.user.id);
      // handleGetFavorites()
    }
  }, [user]);

  // FUNCTION TO COUNT USER PROPERTIES
  // TODO SEPARATE BUYER/SELLER
  const countNumProperties = (section) => {
    let count = 0;
    switch (section) {
      case 'buyer':
        count = favoritesProperties.length;
        break;
      case 'seller':
        count = userProperties.length;
        break;
      default:
        count = favoritesProperties.length + userProperties.length;
    }
    return count;
  };

  if (!userProperties) {
    return (
      <div />
    );
  }

  return (
    <>
      <div className="properties-header dis-fl-row a-c jc-b mb-2 mb-lg-4 py-2 px-3 pos-r zIndex1">
        <div className="dis-fl-row a-c">
          <span className="docubox-title fweight-500 txtDark700">
            <span>Properties</span>
            &nbsp;
            <span className="notranslate">({countNumProperties()})</span>
          </span>
        </div>

        <BrixelButtonIcon
          ghost
          icon="close-small"
          onClick={() => closeProperty()}
        />
      </div>
      {/*
      <BrixelTabs
        className={`tabs mb-1-neg px-2 px-lg-3 py-2 bgWhite zIndex1`}
        clicksList={[
          '',
          'seller',
          'buyer',
        ]}
        labels={[
          `<span>All</span>&nbsp;<span>(${countNumProperties()})</span>`,
          `<span>Owner</span>&nbsp;<span>(${countNumProperties('seller')})</span>`,
          `<span>Buyer</span>&nbsp;<span>(${countNumProperties('buyer')})</span>`,
        ]}
        activeTab={activeTab}
        onClick={(tab) => setActiveTab(tab)}
        fullWidth
      />
      */}
      <Suspense fallback="">
        <PropertyList className="px-2 px-lg-3" activeSection={activeTab} />
      </Suspense>
    </>
  );
};

Properties.propTypes = {
  closeProperty: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  userProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  favoritesProperties: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleGetUserProperties: PropTypes.func.isRequired,
};

Properties.defaultProps = {

};

const mapStateToProps = (state) => ({
  activeProperty: get(state, 'property.activeSingleProperty', {}),
  favoritesProperties: get(state, 'user.favorites', []),
  user: get(state, 'user.loggedInUser', {}),
  userProperties: get(state, 'user.userProperties', []),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetUserProperties: bindActionCreators(getUserProperties, dispatch),
  handleGetFavorites: bindActionCreators(getFavorites, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Properties);
