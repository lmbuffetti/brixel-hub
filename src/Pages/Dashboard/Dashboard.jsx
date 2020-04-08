/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import find from 'lodash/find';
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
    handleGetActiveSinglePropertyBookings,
    handleGetImageType,
    handleSaveActiveSingleProperty,
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
  //const [showButton, setShowButton] = useState(true);
  //const [showMessage, setShowMessage] = useState(false);

  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);
  // const checkActiveTab = () => last(history.location.pathname.split('/'));

  useEffect(() => {
    if (propID && !activeSingleProperty.id) {
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
    if (typeof activeSingleProperty !== 'undefined') {
      if (!propID && activeSingleProperty.id) {
        history.push(`/${activeSingleProperty.id}/rewards`);
      }
      if (activeSingleProperty.owner === loggedInUser.user.id) {
        handleGetActiveSingleProperty({ fullVersion: true, id: propID });
        handleGetActiveSinglePropertyBookings({ id: propID });
      }
      handleGetImageType();
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
        const data = {
          id: propID,
          smallLoader: true,
          setSuccessNotification: true,
          ...objToSave,
        };
        handleSaveActiveSingleProperty(data);
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

  const discardChanges = () => {
    handleSetScreenNotification({
      ...notification,
      state: false,
    });
    reset('Property');
  };

  useEffect(() => {
    if (notification && notification.actions && notification.type === 'infoHub') {
      const getID = notification.actions.findIndex(item => item.label === 'Save');
      const newNotification = cloneDeep(notification);
      newNotification.actions[getID].isLoading = isSmallLoading;
      handleSetScreenNotification({
        ...newNotification,
      })
    }
  }, [isSmallLoading]);

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const isDocEdit = find(diff(initialValues, formValue).documents, (el) => {
      if ((has(el, 'isPrivate') || has(el, 'name')) && !has(el, 'id')) {
        return true;
      }
      return false;
    });
    // Conditions to remove the notification bar for document edit
    // It is redundant to have the edit buttons to confirm and discard
    // together with the notification bar

    if (formValue.id && initialValues.id) {
      const changeObj = diff(initialValues, formValue);
      if (
        typeof isDocEdit !== 'undefined' &&
        !has(isDocEdit, 'name') &&
        !has(isDocEdit, 'isPrivate') &&
        Object.keys(changeObj).length > 0 &&
        (Object.keys(changeObj).length > 1 || !changeObj.inputSheet ) &&
        !isSmallLoading &&
        !isLoading &&
        validForm()
      ) {
        handleSetScreenNotification({
          state: true,
          type: 'infoHub',
          label: 'Save changes?',
          actions:
            [
              { type: 'secondary', label: 'Discard', func: () => discardChanges() },
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

  if (!userTypes) return (<div />);

  return (
    <div className="container" id="dashboard">
      { /* SECTION: APP HEADER */ }
      <ProtectedRoute path="/:propId?/rewards/:rewardType?" component={RewardsDashboard} />
      <ProtectedRoute path="/:propId?/property" component={PropertyDashboard} />
      <ProtectedRoute path="/:propId?/listings" component={ListingsDashboard} />
      <ProtectedRoute path="/:propId?/support" component={SupportDashboard} />
      <ProtectedRoute path="/:propId?/upgrade" component={Upgrade} />
    </div>
  )
};

Dashboard.propTypes = {
  errorValue: PropTypes.object,
  formValue: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  isSmallLoading: PropTypes.bool,
  userTypes: PropTypes.string,
  handleGetPropertyListings: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
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
