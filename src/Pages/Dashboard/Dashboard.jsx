/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
//import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import {
  Switch,
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import last from 'lodash/last';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonTertiary, BrixelTabs } from '@brixel/brixel-components';
import { getPropertyListings, getActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
import { getCalcSectionInputSheets } from '../../utils/helpers';
import { InputSheets } from '../../resources/inputSheets';
import { reduxForm } from 'redux-form';
import cloneDeep from 'lodash/cloneDeep';

// SIDEBAR MENU
const MenuSidebar = Loadable({
  loader: () => import('../../components/MenuSidebar' /* webpackChunkName: "header" */),
  loading: Loading,
});


const RewardsDashboard = Loadable({
  loader: () => import('./RewardsDashboard' /* webpackChunkName: "HomeDashboard" */),
  loading: Loading,
});

const PropertyDashboard = Loadable({
  loader: () => import('./PropertyDashboard' /* webpackChunkName: "PropertyDashboard" */),
  loading: Loading,
});

const SupportDashboard = Loadable({
  loader: () => import('./SupportDashboard' /* webpackChunkName: "SupportDashboard" */),
  loading: Loading,
});

const ProtectedRoute = Loadable({
  loader: () => import('../../components/ProtectedRoute' /* webpackChunkName: "ProtectedRoute" */),
  loading: Loading,
});

const Dashboard = (props) => {
  // PROPS
  const {
    userTypes,
    handleGetProperties,
    handleGetProperty,
    handleSaveProperty,
    history,
    loggedInUser,
    match,
    property,
  } = props;

  // STATE
  const [widthWindow, setWindowWidth] = useState(get(window, 'innerWidth', 0));

  //const [showButton, setShowButton] = useState(true);
  //const [showMessage, setShowMessage] = useState(false);

  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);
  const checkActiveTab = () => last(history.location.pathname.split('/'));

  useEffect(() => {
    if (propID && !property.id) {
      handleGetProperty({fullVersion: false, id: propID});
    } else if (!propID) {
      const data = {
        limit: 1,
        offset: `0/?owner=${loggedInUser.user.id}`,
        setAsSingle: true,
      };
      handleGetProperties(data);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    }
  }, []);

  useEffect(() => {
    if (!propID && property.id) {
      history.push(`/${property.id}/rewards`);
    }
    if (property.owner === loggedInUser.user.id) {
      handleGetProperty({fullVersion: true, id: propID});
    }
    const getPercComplete = get(property, 'inputSheet.totalComplete', null);
    if (property.id && !getPercComplete && property.owner.id) {
      const getPerc = getCalcSectionInputSheets(InputSheets('en'), property, {});
      const data = {
        skipSection: getPerc.section.section,
        totalComplete: getPerc.section.percComplete,
      };
      handleSaveProperty({id: property.id, inputSheet: data});
    }
  }, [property]);

  if (!userTypes) return (<div />);

  return (
    <div className="container" id="dashboard">

      { /* SECTION: APP HEADER */ }

      <div className="w-perc-100">
        <div className="dis-f jc-b w-perc-100 a-t brdLight100">
          <BrixelTabs
            classNameLi="dis-fl-col"
            classNameUl="zIndex4"
            labels={['Rewards', 'Property', 'Listings']}
            clicksList={['rewards', 'property', 'listings']}
            classNameArray={['order-md-2 homeTab mt-1 mt-md-0 px-md-2', 'order-md-1 propertyTab mt-1 mt-md-0 px-md-2', 'order-md-3 supportTab  mt-1 mt-md-0 px-md-2']}
            activeTab={checkActiveTab()}
            fullWidth={false}
            onClick={(val) => history.push(`/${propID}/${val}`)}
            showFull={false}
          />
          <button className="fsize-400 txtLight400">Support</button>
        </div>


        <ProtectedRoute path="/:propId?/rewards" component={RewardsDashboard} />
        <ProtectedRoute path="/:propId?/property" component={PropertyDashboard} />
        <ProtectedRoute path="/:propId?/listings" component={SupportDashboard} />
        <ProtectedRoute path="/:propId?/support" component={SupportDashboard} />
      </div>


    </div>
  )
};

Dashboard.propTypes = {
  userTypes: PropTypes.string,
  handleGetProperties: PropTypes.func.isRequired,
  handleGetProperty: PropTypes.func.isRequired,
  handleSaveProperty: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Dashboard.defaultProps = {
  userTypes: null,
};

const DashboardForm = reduxForm({
  // a unique name for the form
  form: 'Property',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(Dashboard);

const mapStateToProps = (state) => ({
  userTypes: get(state, 'user.userTypes', null),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  property: get(state, 'property.activeSingleProperty', {}),
  initialValues: {
    assessor: get(state, 'property.activeSingleProperty.assessor', {}),
    coverPhoto: get(state, 'property.activeSingleProperty.coverPhoto', {}),
    description: get(state, 'property.activeSingleProperty.description', {}),
    id: get(state, 'property.activeSingleProperty.id', null),
    floorPlans: get(state, 'property.activeSingleProperty.floorPlans', []),
    inputSheet: get(state, 'property.activeSingleProperty.inputSheet', {}),
    language: get(state, 'property.activeSingleProperty.language', null),
    listed: get(state, 'property.activeSingleProperty.listed', null),
    location: get(state, 'property.activeSingleProperty.location', {}),
    photos: cloneDeep(get(state, 'property.activeSingleProperty.photos', [])),
    portals: get(state, 'property.activeSingleProperty.portals', {}),
    properties: get(state, 'property.activeSingleProperty.properties', {}),
    published: get(state, 'property.activeSingleProperty.published', null),
    stub: get(state, 'property.activeSingleProperty.stub', null),
    virtual: get(state, 'property.activeSingleProperty.virtual', null),
  },
});

const mapDispatchToProps = (dispatch) => ({
  handleGetProperties: bindActionCreators(getPropertyListings, dispatch),
  handleGetProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSaveProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardForm);
