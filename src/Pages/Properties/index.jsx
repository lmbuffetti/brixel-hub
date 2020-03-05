/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
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
import last from 'lodash/last';
import DrawerLayout from '../../components/DrawerLayout';
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
    getFavoritesOfUser,
    getPropertiesOfUser,
    favoritesProperties,
    history,
    match,
    user,
    userProperties,
  } = props;

  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const checkActiveTab = () => last(history.location.pathname.split('/'));
  const sectionPage = get(match, 'params.act', 'home');

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
    <DrawerLayout
      classNameDrawer="ov-a"
    >
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
          onClick={() => history.push(`/${propID}/${sectionPage}`)}
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
        activeTab={checkActiveTab() === 'list' ? '' : checkActiveTab()}
        onClick={(tab) => {
          history.push(`/${propID}/property/list/${tab}`);
        }}
        fullWidth
      />

      <PropertyList activeSection={checkActiveTab()} />
    </DrawerLayout>
  );
};

Properties.propTypes = {
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  activeProperty: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  userProperties: PropTypes.arrayOf(PropTypes.object.isRequired),
  favoritesProperties: PropTypes.arrayOf(PropTypes.object.isRequired),
  getPropertiesOfUser: PropTypes.func.isRequired,
  getFavoritesOfUser: PropTypes.func.isRequired,
};

Properties.defaultProps = {
};

const mapStateToProps = (state) => ({
  user: get(state, 'user.loggedUser', {}),
  userProperties: get(state, 'user.userProperties', []),
  favoritesProperties: get(state, 'user.favorites', []),
  activeProperty: get(state, 'property.property', {}),
});

const mapDispatchToProps = (dispatch) => ({
  getPropertiesOfUser: bindActionCreators(getUserProperties, dispatch),
  getFavoritesOfUser: bindActionCreators(getFavorites, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Properties);
