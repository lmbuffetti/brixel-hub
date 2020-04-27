/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';

import {
  getPropertyListings,
  getActiveSingleProperty,
  saveActiveSingleProperty,
  getActiveSinglePropertyBookings, savePropertyVisitSchedule, createPropertyVisitSchedule, savePropertyVisitBooking,
} from '../../actions/PropertyActions';
import Loadable from 'react-loadable';
import { reduxForm, reset } from 'redux-form';
import { diff } from 'deep-object-diff';
import { deleteDocument, uploadDocument, getImageType } from '../../actions/UploadActions';
import { addGameHistory, getAchievement, getGamegroup, getGameHistory } from '../../actions/GamificationActions';
import { setModal, setScreenNotification } from '../../actions/CommonActions';
import has from 'lodash/has';

const RewardsDashboard = Loadable({
  loader: () => import('./RewardsDashboard' /* webpackChunkName: "HomeDashboard" */),
  loading: () => null,
});

const PropertyDashboard = Loadable({
  loader: () => import('./PropertyDashboard' /* webpackChunkName: "PropertyDashboard" */),
  loading: () => null,
});

const ListingsDashboard = Loadable({
  loader: () => import('./ListingsDashboard' /* webpackChunkName: "ListingsDashboard" */),
  loading: () => null,
});

const SupportDashboard = Loadable({
  loader: () => import('./SupportDashboard' /* webpackChunkName: "SupportDashboard" */),
  loading: () => null,
});

const EmptyProperty = Loadable({
  loader: () => import('./EmptyProperty' /* webpackChunkName: "EmptyProperty" */),
  loading: () => null,
});

// UPGRADE
const Upgrade = Loadable({
  loader: () => import('../Upgrade/Upgrade' /* webpackChunkName: "Upgrade" */),
  loading: () => null,
});

const ProtectedRoute = Loadable({
  loader: () => import('../../components/ProtectedRoute' /* webpackChunkName: "ProtectedRoute" */),
  loading: () => null,
});

const Dashboard = (props) => {
  // PROPS
  const {
    userTypes,
    errorValue,
    formValue,
    handleGetPropertyListings,
    handleGetActiveSingleProperty,
    handleAddGameHistory,
    handleGetActiveSinglePropertyBookings,
    handleGetImageType,
    handleSaveActiveSingleProperty,
    handleGetAchievement,
    handleGetGamegroup,
    handleGetGameHistory,
    handleSavePropertyVisitSchedule,
    handleCreatePropertyVisitSchedule,
    handleSetScreenNotification,
    history,
    initialValues,
    isLoading,
    isSmallLoading,
    loggedInUser,
    match,
    notification,
    activeSingleProperty,
    reset,
  } = props;
  const [isDiscardChanges, setIsDiscardChanges] = useState(false);
  const [userType, setUserType] = useState(null);
  //const [showMessage, setShowMessage] = useState(false);

  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);
  // const checkActiveTab = () => last(history.location.pathname.split('/'));

  const loadDefaultProperty = () => {
    const data = {
      limit: 1,
      offset: `0/?owner=${loggedInUser.user.id}`,
      setAsSingle: true,
    };
    handleGetPropertyListings(data);
  };

  useEffect(() => {
    if (propID && !get(activeSingleProperty, 'id', null)) {
      handleGetActiveSingleProperty({fullVersion: true, id: propID});
    } else if (!propID) {
      loadDefaultProperty();
    }
    handleGetAchievement();
    handleGetGamegroup();
    handleGetGameHistory();
  }, []);

  useEffect(() => {
    if (typeof activeSingleProperty !== 'undefined') {
      if (!propID && get(activeSingleProperty, 'id', null)) {
        history.push(`/${activeSingleProperty.id}/rewards`);
      }
      if (activeSingleProperty.owner === loggedInUser.user.id) {
        // handleGetActiveSingleProperty({ fullVersion: true, id: propID });
        handleGetActiveSinglePropertyBookings({ id: propID });
      } else if (activeSingleProperty.statusCode) {
        loadDefaultProperty();
      }
      handleGetImageType();
    } else {
      setUserType('emptyState');
    }
  }, [activeSingleProperty]);

  const saveData = () => {
    const changeObj = diff(initialValues, formValue);
    if (Object.keys(changeObj).length > 0) {
      if (changeObj.schedule) {
        // Update schedule
        if (has(formValue, 'schedule.id')) {
          const data = {
            scheduleId: formValue.schedule.id,
            data: {
              page: formValue.id,
              slots: formValue.schedule.slots,
            },
          };
          handleSavePropertyVisitSchedule(data);
        } else {
          // Create schedule
          const data = {
            page: formValue.id,
            slots: formValue.schedule.slots,
          };
          handleCreatePropertyVisitSchedule(data);
        }
      } else {
        const objToSave = {};
        Object.keys(changeObj).map((key) => {
          objToSave[key] = get(formValue, key, {});
          return null;
        });
        if (changeObj.photos) {
          objToSave.coverPhoto = changeObj.photos[0];
        }
        const data = {
          id: propID,
          smallLoader: true,
          setSuccessNotification: true,
          ...objToSave,
        };
        handleSaveActiveSingleProperty(data);
        handleAddGameHistory({stub: 'market-checker'});
        if (get(formValue, 'photos', []).length > 0) {
          handleAddGameHistory({stub: 'photos'});
        }
        if (get(formValue, 'inputSheet', {}).totalComplete > 70) {
          handleAddGameHistory({stub: 'facts'});
        }
      }
    }
  };

  const validForm = () => {
    const changeObj = diff(initialValues, formValue);
    const allVal = [];
    let isValid = true;
    const extrackKey = (obj, parent) => {
      Object.keys(obj).map((key) => {
        if (isObject(obj[key])) {
          let newKey = parent ? `${parent}.${key}` : key;
          extrackKey(obj[key], newKey);
        }
        else {
          allVal.push(`${parent}.${key}`);
        }
        return null;
      });
    };
    extrackKey(changeObj);
    allVal.map((name) => {
      const getError = get(errorValue, name, true);
      if (getError !== 'Mark Required' && getError !== true && isValid) isValid = false;
      return null;
    });
    return isValid;
  };

  useEffect(() =>{
    if (isDiscardChanges) {
      const newNotification = cloneDeep(notification);
      reset('Property');
      newNotification.state = false;
      handleSetScreenNotification({
        ...newNotification,
      });
      setIsDiscardChanges(false);
    }
  }, [isDiscardChanges]);

  const discardChanges = (not) => {
    setIsDiscardChanges(true)
  };

  useEffect(() => {
    if (notification && notification.actions && notification.type === 'infoHub' && isSmallLoading) {
      const getID = notification.actions.findIndex(item => item.label === 'Save');
      if (getID > -1) {
        const newNotification = cloneDeep(notification);
        newNotification.actions[getID].isLoading = isSmallLoading;
        handleSetScreenNotification({
          ...newNotification,
        })
      }
    }
  }, [isSmallLoading]);

  useEffect(() => {
    if (formValue.id && initialValues.id) {
      const changeObj = diff(initialValues, formValue);
      if (
        Object.keys(changeObj).length > 0 &&
        (Object.keys(changeObj).length > 1 || !changeObj.inputSheet ) &&
        !isSmallLoading &&
        !isLoading &&
        validForm()
      ) {
        handleSetScreenNotification({
          state: true,
          type: 'infoHub',
          label: 'Unsaved changes',
          actions:
            [
              { type: 'secondary', label: 'Discard', func: () => discardChanges(notification) },
              { type: 'primary', label: 'Save', func: () => saveData(), isLoading: isSmallLoading },
            ],
        });
      } else if (!isSmallLoading && !isLoading && notification && notification.type !== 'saved' ) {
        handleSetScreenNotification({
          ...notification,
          state: false,
        });
      }
    }
  }, [formValue, errorValue]);

  if (!userTypes && !userType) return (<div />);

  return (
    <div className="container ov-x-h" id="dashboard">
      { /* SECTION: APP HEADER */ }
      <ProtectedRoute path="/:propId?/rewards/:rewardType?" component={RewardsDashboard} />
      <ProtectedRoute path="/:propId?/property" component={PropertyDashboard} />
      <ProtectedRoute path="/:propId?/listings" component={ListingsDashboard} />
      <ProtectedRoute path="/:propId?/support" component={SupportDashboard} />
      <ProtectedRoute path="/:propId?/upgrade" component={Upgrade} />
      <ProtectedRoute path="/" exact component={EmptyProperty} />
    </div>
  )
};

Dashboard.propTypes = {
  errorValue: PropTypes.object,
  formValue: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  isSmallLoading: PropTypes.bool,
  userTypes: PropTypes.string,
  handleAddGameHistory: PropTypes.func.isRequired,
  handleGetPropertyListings: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  handleGetAchievement: PropTypes.func.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
  handleGetGameHistory: PropTypes.func.isRequired,
  handleGetImageType: PropTypes.func.isRequired,
  handleSavePropertyVisitSchedule: PropTypes.func.isRequired,
  handleCreatePropertyVisitSchedule: PropTypes.func.isRequired,
  handleSavePropertyVisitBooking: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  notification: PropTypes.object,
  regFields: PropTypes.object,
  handleSetScreenNotification: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  errorValue: null,
  regFields: null,
  userTypes: null,
  notification: null,
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
  activeSingleProperty: get(state, 'property.activeSingleProperty', undefined),
  formValue: get(state, 'form.Property.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', 0) > 0,
  isLoading: get(state, 'common.isLoading', 0) > 0,
  errorValue: get(state, 'form.Property.syncErrors', null),
  regFields: get(state, 'form.Property.registeredFields', null),
  notification: get(state, 'common.notification', {}),
  initialValues: {
    assessor: get(state, 'property.activeSingleProperty.assessor', {}),
    booking: get(state, 'property.activeSinglePropertyBooking', []),
    documents: get(state, 'property.activeSingleProperty.documents', []),
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
    photos: get(state, 'property.activeSingleProperty.photos', []),
    portals: get(state, 'property.activeSingleProperty.portals', {}),
    portalsReview: get(state, 'property.activeSingleProperty.portalsReview', null),
    properties: get(state, 'property.activeSingleProperty.properties', {}),
    schedule: get(state, 'property.activeSingleProperty.schedule', {}),
    published: get(state, 'property.activeSingleProperty.published', null),
    publishReview: get(state, 'property.activeSingleProperty.publishReview', null),
    stub: get(state, 'property.activeSingleProperty.stub', null),
    title: get(state, 'property.activeSingleProperty.title', null),
    packageUpgrade: {
      contactEmail: get(state, 'user.loggedInUser.user.email', ''),
      contactPhone: get(state, 'user.loggedInUser.user.phone', ''),
    },
    virtual: get(state, 'property.activeSingleProperty.virtual', null),
  },
});

const mapDispatchToProps = (dispatch) => ({
  reset(form) {
    (dispatch(reset(form)))
  },
  handleGetAchievement: bindActionCreators(getAchievement, dispatch),
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
  handleGetGameHistory: bindActionCreators(getGameHistory, dispatch),
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleGetPropertyListings: bindActionCreators(getPropertyListings, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetScreenNotification: bindActionCreators(setScreenNotification, dispatch),
  handleGetImageType: bindActionCreators(getImageType, dispatch),
  handleSavePropertyVisitSchedule: bindActionCreators(savePropertyVisitSchedule, dispatch),
  handleCreatePropertyVisitSchedule: bindActionCreators(createPropertyVisitSchedule, dispatch),
  handleSavePropertyVisitBooking: bindActionCreators(savePropertyVisitBooking, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardForm);
