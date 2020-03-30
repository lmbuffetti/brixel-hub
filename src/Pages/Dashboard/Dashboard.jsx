/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';


import {
  getPropertyListings,
  getActiveSingleProperty,
  saveActiveSingleProperty,
  getActiveSinglePropertyBookings,
} from '../../actions/PropertyActions';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
import { InputSheets } from '../../resources/inputSheets';
import { reduxForm } from 'redux-form';
import cloneDeep from 'lodash/cloneDeep';
import { diff } from 'deep-object-diff';
import { deleteDocument, uploadDocument, getImageType } from '../../actions/UploadActions';
import { setModal, setScreenNotification } from '../../actions/CommonActions';

const RewardsDashboard = Loadable({
  loader: () => import('./RewardsDashboard' /* webpackChunkName: "HomeDashboard" */),
  loading: Loading,
});

const PropertyDashboard = Loadable({
  loader: () => import('./PropertyDashboard' /* webpackChunkName: "PropertyDashboard" */),
  loading: Loading,
});

const ListingsDashboard = Loadable({
  loader: () => import('./ListingsDashboard' /* webpackChunkName: "ListingsDashboard" */),
  loading: Loading,
});

const SupportDashboard = Loadable({
  loader: () => import('./SupportDashboard' /* webpackChunkName: "SupportDashboard" */),
  loading: Loading,
});

// UPGRADE
const Upgrade = Loadable({
  loader: () => import('../Upgrade/Upgrade' /* webpackChunkName: "Upgrade" */),
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
    errorValue,
    formValue,
    handleGetPropertyListings,
    handleGetActiveSingleProperty,
    handleGetActiveSinglePropertyBookings,
    handleGetImageType,
    history,
    initialValues,
    isSmallLoading,
    loggedInUser,
    match,
    notification,
    property,
    regFields,
  } = props;

  // STATE
  const [Questions] = useState(InputSheets('en'));
  const load = useState(isSmallLoading);

  //const [showButton, setShowButton] = useState(true);
  //const [showMessage, setShowMessage] = useState(false);

  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);
  // const checkActiveTab = () => last(history.location.pathname.split('/'));

  useEffect(() => {
    if (propID && !property.id) {
      handleGetActiveSingleProperty({fullVersion: false, id: propID});
    } else if (!propID) {
      const data = {
        limit: 1,
        offset: `0/?owner=${loggedInUser.user.id}`,
        setAsSingle: true,
      };
      handleGetPropertyListings(data);
    }
  }, []);

  useEffect(() => {
    if (!propID && property.id) {
      history.push(`/${property.id}/rewards`);
    }
    if (property.owner === loggedInUser.user.id) {
      handleGetActiveSingleProperty({fullVersion: true, id: propID});
      handleGetActiveSinglePropertyBookings({id: propID});
      handleGetImageType();
    }
    const getPercComplete = get(property, 'inputSheet.totalComplete', null);
    if (property.id && !getPercComplete && property.owner.id) {
      // const getPerc = getCalcSectionInputSheets(InputSheets('en'), property, {});
      /*const data = {
        skipSection: getPerc.section.section,
        totalComplete: getPerc.section.percComplete,
      };*/
      //handleSaveActiveSingleProperty({id: property.id, inputSheet: data});
    }
  }, [property]);

  useEffect(() => {
    // SET NOTIFICATION AND CHECK IF VALUES ARE CHANGED
    if (formValue.id && initialValues.id && regFields) {
      if (Object.keys(diff(initialValues, formValue)).length > 0) {
        let setValid = true;
        if (Questions) {
          Questions.map((input) => {
            input.inputs.map((inp) => {
              const curVal = get(errorValue, inp.name, true);
              if (curVal !== true && curVal !== 'Mark Required') {
                setValid = false;
              }
              return null;
            });
            return null;
          });
        }
        if (setValid && (notification.type !== 'info' || load !== isSmallLoading)) {
          /*handleSetScreenNotification({
            state: false,
            type: 'info',
            label: 'Save changes?',
            actions:
              [
                { type: 'primary', label: 'Save', func: () => saveData(), isLoading: isSmallLoading },
                { type: 'secondary', label: 'Discard', func: () => discardChanges() },
              ],
          });*/
        }
        // SET NOTIFICATION TO SUCCESS SAVE
      } else if (Object.keys(diff(initialValues, formValue)).length === 0 && notification.type === 'success') {
        //setTimeout(() => closeNotificationBar(), 2000);
        // REMOVE NOTIFICATION
      } else if (Object.keys(diff(initialValues, formValue)).length === 0 && notification.type === 'info') {
        // handleSetScreenNotification({ state: false });
      } else {
        // closeNotificationBar()
      }
    }
  }, [formValue, isSmallLoading, initialValues]);

  if (!userTypes) return (<div />);

  return (
    <div className="container" id="dashboard">
      { /* SECTION: APP HEADER */ }
      <Route render={({location}) => (

        <TransitionGroup>
          <CSSTransition>
            <Switch location={location}>
              <ProtectedRoute path="/:propId?/rewards/:rewardType?" component={RewardsDashboard} />
              <ProtectedRoute path="/:propId?/property" component={PropertyDashboard} />
              <ProtectedRoute path="/:propId?/listings" component={ListingsDashboard} />
              <ProtectedRoute path="/:propId?/support" component={SupportDashboard} />
              <ProtectedRoute path="/:propId?/upgrade" component={Upgrade} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      )} />
    </div>
  )
};

Dashboard.propTypes = {
  errorValue: PropTypes.object,
  formValue: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.bool,
  userTypes: PropTypes.string,
  handleGetPropertyListings: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  handleGetImageType: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  notification: PropTypes.object.isRequired,
  regFields: PropTypes.object,
  handleSetScreenNotification: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  errorValue: null,
  regFields: null,
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
  formValue: get(state, 'form.Property.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
  errorValue: get(state, 'form.Property.syncErrors', null),
  regFields: get(state, 'form.Property.registeredFields', null),
  notification: get(state, 'common.notification', {}),
  initialValues: {
    assessor: get(state, 'property.activeSingleProperty.assessor', {}),
    booking: get(state, 'property.activeSinglePropertyBooking', []),
    coverPhoto: get(state, 'property.activeSingleProperty.coverPhoto', {}),
    description: get(state, 'property.activeSingleProperty.description', {}),
    id: get(state, 'property.activeSingleProperty.id', null),
    floorPlans: get(state, 'property.activeSingleProperty.floorPlans', []),
    inputSheet: get(state, 'property.activeSingleProperty.inputSheet', {}),
    price: get(state, 'property.activeSingleProperty.price', {}),
    status: get(state, 'property.activeSingleProperty.status', null),
    // language: get(state, 'property.activeSingleProperty.language', null),
    // listed: get(state, 'property.activeSingleProperty.listed', null),
    location: get(state, 'property.activeSingleProperty.location', {}),
    photos: cloneDeep(get(state, 'property.activeSingleProperty.photos', [])),
    portals: get(state, 'property.activeSingleProperty.portals', {}),
    portalsReview: get(state, 'property.activeSingleProperty.portalsReview', null),
    properties: get(state, 'property.activeSingleProperty.properties', {}),
    schedule: get(state, 'property.activeSingleProperty.schedule', {}),
    published: get(state, 'property.activeSingleProperty.published', null),
    publishReview: get(state, 'property.activeSingleProperty.publishReview', null),
    stub: get(state, 'property.activeSingleProperty.stub', null),
    title: get(state, 'property.activeSingleProperty.title', null),
    virtual: get(state, 'property.activeSingleProperty.virtual', null),
  },
});

const mapDispatchToProps = (dispatch) => ({
  handleGetPropertyListings: bindActionCreators(getPropertyListings, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetScreenNotification: bindActionCreators(setScreenNotification, dispatch),
  handleGetImageType: bindActionCreators(getImageType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardForm);
