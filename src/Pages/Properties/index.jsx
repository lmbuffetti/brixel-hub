/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Loadable from 'react-loadable';
import {
  BrixelButtonIcon,
  BrixelTabs,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
// COMPONENTS
import LoadingSimple from '../../components/LoadingSimple';

import {
  getUserProperties,
  getFavorites,
} from '../../actions/UserActions';

const PropertyList = Loadable({
  loader: () => import('./PropertyList' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const Properties = (props) => {
  // PROPS
  const {
    closeProperty,
    getFavoritesOfUser,
    getPropertiesOfUser,
    favoritesProperties,
    user,
    userProperties,
  } = props;
  // STATE
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (get(user, 'user.id')) {
      getPropertiesOfUser(user.user.id);
      getFavoritesOfUser()
    }
  }, [user]);

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
      <div className="properties-header dis-fl-row a-c jc-b mb-3 p-2">
        <div className="dis-fl-row a-c">
          <span className="docubox-title fweight-500 txtDark700">Properties</span>
        </div>

        <BrixelButtonIcon
          className="shadow-3dp"
          noBorder
          background="white"
          color="dark"
          saturationTxt={700}
          icon="close-small"
          onClick={() => closeProperty()}
        />
      </div>
      <BrixelTabs
        className={`tabs mb-1-neg mr-3`}
        clicksList={[
          '',
          'seller',
          'buyer',
        ]}
        labels={[
          `All (${countNumProperties()})`,
          `Owner (${countNumProperties('seller')})`,
          `Buyer (${countNumProperties('buyer')})`,
        ]}
        activeTab={activeTab}
        onClick={(tab) => setActiveTab(tab)}
        fullWidth
      />

      <PropertyList activeSection={activeTab} />
    </>
  );
};

Properties.propTypes = {
  closeProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  activeProperty: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  userProperties: PropTypes.arrayOf(PropTypes.object.isRequired),
  favoritesProperties: PropTypes.arrayOf(PropTypes.object.isRequired),
  getPropertiesOfUser: PropTypes.func.isRequired,
  getFavoritesOfUser: PropTypes.func.isRequired,
  windowDimensions: PropTypes.object.isRequired,
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
  getPropertiesOfUser: bindActionCreators(getUserProperties, dispatch),
  getFavoritesOfUser: bindActionCreators(getFavorites, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Properties);
