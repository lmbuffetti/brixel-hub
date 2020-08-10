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
import set from 'lodash/set';

import Loadable from 'react-loadable';
import { change, reduxForm, reset } from 'redux-form';
import { diff } from 'deep-object-diff';
import has from 'lodash/has';
import {
  getPropertyListings,
  getActiveSingleProperty,
  saveActiveSingleProperty,
  getActiveSinglePropertyBookings, savePropertyVisitSchedule, createPropertyVisitSchedule, savePropertyVisitBooking,
} from '../../actions/PropertyActions';
import { deleteDocument, uploadDocument, getImageType } from '../../actions/UploadActions';
import {
  addGameHistory, getAchievement, getGamegroup, getGameHistory,
} from '../../actions/GamificationActions';
import { setModal, setScreenNotification } from '../../actions/CommonActions';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { calcPercentageFacts } from '../../utils/helpers';

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
    changeFieldValue,
    userTypes,
    errorValue,
    formValue,
    gameAchievement,
    gameGroup,
    gameHistory,
    handleAddGameHistory,
    handleGetActiveSingleProperty,
    handleGetActiveSinglePropertyBookings,
    handleGetActiveSingleCompany,
    handleGetPropertyListings,
    handleGetImageType,
    handleSaveActiveSingleProperty,
    handleGetAchievement,
    handleGetGamegroup,
    handleGetGameHistory,
    handleSavePropertyVisitSchedule,
    handleCreatePropertyVisitSchedule,
    handleSetScreenNotification,
    history,
    imageType,
    initialValues,
    isLoading,
    isSmallLoading,
    loggedInUser,
    match,
    notification,
    activeSingleProperty,
    resetForm,
  } = props;
  const [isDiscardChanges, setIsDiscardChanges] = useState(false);
  const [userType, setUserType] = useState(null);
  // const [showMessage, setShowMessage] = useState(false);

  // GET URL PARAMS
  const propID = get(match, 'params.propId', null);

  // FUNCTION TO RESET FORM ON CHANGE SECTIONS - EXCEPT FOR FACTS AND ACHIEVEMENT FLOW
  useEffect(() => {
    if (
      !get(history, 'location.pathname', '').includes('facts') &&
      !get(history, 'location.pathname', '').includes('achievement')
    ) {
      resetForm('Property');
    }
  }, [history.location.pathname]);

  // FUNCTION TO LOAD DEFAULT USER PROPERTY IF NO ID
  const loadDefaultProperty = () => {
    if (!get(formValue, 'id', null)) {
      const data = {
        limit: 1,
        offset: `0/?owner=${loggedInUser.user.id}`,
        setAsSingle: true,
        multiLoader: true,
      };
      handleGetPropertyListings(data);
    }
  };

  // FUNCTION TO LOAD THE PROPERTY BY ID OR LOAD THE DEFAULT AND GET THE GAME ACHIEVEMENTS - GAME HISTORY - GAME GROUP
  useEffect(() => {
    if (propID && !get(activeSingleProperty, 'id', null)) {
      handleGetActiveSingleProperty({ fullVersion: true, id: propID, multiLoader: true });
    } else if (!propID) {
      loadDefaultProperty();
    }
    if (gameAchievement.length === 0) handleGetAchievement();
    if (gameGroup.length === 0) handleGetGamegroup();
    if (gameHistory.length === 0) handleGetGameHistory();
  }, []);

  // FUNCTION TO REDIRECT TO REWARDS PAGE OR LOAD EMPTY STATE (IF USER NO HAS PROPERTY) - LOAD COMPANY FRO SELECTED PROPERTY
  useEffect(() => {
    if (typeof activeSingleProperty !== 'undefined' && activeSingleProperty) {
      if (!propID && get(activeSingleProperty, 'id', null)) {
        history.push(`/${activeSingleProperty.id}/rewards`);
      }
      if (get(activeSingleProperty, 'owner', null) === loggedInUser.user.id) {
        // handleGetActiveSingleProperty({ fullVersion: true, id: propID });
        handleGetActiveSinglePropertyBookings({ id: propID });
      } else if (get(activeSingleProperty, 'statusCode', null)) {
        loadDefaultProperty();
      }
      if (imageType.length === 0) handleGetImageType();
    } else {
      setUserType('emptyState');
      history.push('/no-property');
    }
    localStorage.removeItem('gameGroup');
    const activeLeads = get(activeSingleProperty, 'pageLeads[0]', null);
    if (activeLeads) {
      handleGetActiveSingleCompany({ id: activeLeads.company });
    }
  }, [activeSingleProperty]);

  // FUNCTION TO GLOBAL SAVE - BUTTON SAVE ON NOTIFICATION BAR
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
        const inputSheet = get(formValue, 'inputSheet', {}) || {};
        if (inputSheet.totalComplete >= 24) {
          handleAddGameHistory({ stub: 'facts' });
        }
        if (get(formValue, 'photos', []).length > 0 && get(formValue, 'floorPlans', []).length > 0 && get(formValue, 'documents', []).length > 0) {
          handleAddGameHistory({ stub: 'media' });
        }
      }
    }
  };

  // FORM VALIDATION
  const validForm = () => {
    const changeObj = diff(initialValues, formValue);
    const allVal = [];
    let isValid = true;
    const extrackKey = (obj, parent) => {
      Object.keys(obj).map((key) => {
        if (isObject(obj[key])) {
          const newKey = parent ? `${parent}.${key}` : key;
          extrackKey(obj[key], newKey);
        } else {
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

  // FUNCTION TO DISCARD SAVE
  useEffect(() => {
    if (isDiscardChanges) {
      const newNotification = cloneDeep(notification);
      resetForm('Property');
      newNotification.state = false;
      handleSetScreenNotification({
        ...newNotification,
      });
      setIsDiscardChanges(false);
    }
  }, [isDiscardChanges]);

  // FUNCTION TO SET TRUE THE DISCARD SAVE
  const discardChanges = () => {
    setIsDiscardChanges(true);
  };

  // FUNCTION TO ADD THE SMALL LOADING ON BUTTON SAVE ON NOTIFICATION BAR
  useEffect(() => {
    if (notification && notification.actions && notification.type === 'infoHub' && isSmallLoading) {
      const getID = notification.actions.findIndex((item) => item.label === 'Save');
      if (getID > -1) {
        const newNotification = cloneDeep(notification);
        newNotification.actions[getID].isLoading = isSmallLoading !== null;
        handleSetScreenNotification({
          ...newNotification,
        });
      }
    }
  }, [isSmallLoading]);

  // FUNCTION TO SHOW/HIDE THE NOTIFICATION BAR TO SAVE
  useEffect(() => {
    if (formValue.id && initialValues.id) {
      const changeObj = diff(initialValues, formValue);
      console.log(changeObj, get(notification, 'label', ''));
      const checkIsValid = Object.keys(changeObj).find((key) => typeof changeObj[key] !== 'undefined');
      if (Object.keys(changeObj).length === 0 && get(notification, 'label', '').toLowerCase().includes('changes')) {
        handleSetScreenNotification({
          ...notification,
          state: false,
        });
      }
      if (
        checkIsValid &&
        Object.keys(changeObj).length > 0 &&
        (Object.keys(changeObj).length > 1 || !changeObj.inputSheet) &&
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
              {
                type: 'primary', label: 'Save', func: () => saveData(), isLoading: isSmallLoading,
              },
            ],
        });
      } else if (
        !!notification &&
        !get(notification, 'label', '').toLowerCase().includes('saved')
      ) {
        handleSetScreenNotification({
          ...notification,
          state: false,
        });
      }
    }
    // FUNCTION TO CHANGE THE FACTS PERCENTAGE
    if (calcPercentageFacts().calcPerc !== calcPercentageFacts().savedPerc) {
      const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
      inputSheet.totalComplete = calcPercentageFacts().calcPerc;
      changeFieldValue('inputSheet', inputSheet);
    }
  }, [formValue, errorValue]);

  if (!userTypes && !userType) return (<div />);

  return (
    <div className="container dashboardContainer" id="dashboard">
      { /* SECTION: ROUTES FOR ONLY LOGGED USER - MAIN HUB PAGES  */ }
      <ProtectedRoute path="/:propId?/rewards/:rewardType?" component={RewardsDashboard} />
      <ProtectedRoute path="/:propId?/property" component={PropertyDashboard} />
      <ProtectedRoute path="/:propId?/listings" component={ListingsDashboard} />
      <ProtectedRoute path="/:propId?/upgrade" component={Upgrade} />
      <ProtectedRoute path="/no-property" exact component={EmptyProperty} />
    </div>
  );
};

Dashboard.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  errorValue: PropTypes.object,
  activeSingleProperty: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSmallLoading: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  userTypes: PropTypes.string,
  gameAchievement: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameHistory: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  handleGetPropertyListings: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  handleGetAchievement: PropTypes.func.isRequired,
  handleGetGamegroup: PropTypes.func.isRequired,
  handleGetGameHistory: PropTypes.func.isRequired,
  handleGetImageType: PropTypes.func.isRequired,
  handleSavePropertyVisitSchedule: PropTypes.func.isRequired,
  handleCreatePropertyVisitSchedule: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  imageType: PropTypes.arrayOf(PropTypes.object).isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  notification: PropTypes.object,
  handleSetScreenNotification: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  errorValue: null,
  isSmallLoading: null,
  userTypes: null,
  notification: null,
};

const DashboardForm = reduxForm({
  // a unique name for the form
  form: 'Property',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(Dashboard);

const mapStateToProps = (state) => {
  const properties = get(state, 'property.activeSingleProperty.properties', {});
  set(properties, 'typology.livingArea.unit', 'm2');
  set(properties, 'typology.grossArea.unit', 'm2');
  set(properties, 'typology.lotArea.unit', 'm2');
  set(properties, 'typology.lotAreaUsable.unit', 'm2');
  set(properties, 'typology.constructedVolume.unit', 'm3');
  set(properties, 'typology.balconyArea.unit', 'm2');
  set(properties, 'typology.gardenArea.unit', 'm2');
  set(properties, 'building.expandableAtticArea.unit', 'm2');
  set(properties, 'typology.basementArea.unit', 'm2');
  set(properties, 'building.properties.typology.storeroomArea.unit', 'm2');
  set(properties, 'typology.collectiveSpacesArea.unit', 'm2');
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', undefined),
    errorValue: get(state, 'form.Property.syncErrors', null),
    formValue: get(state, 'form.Property.values', {}),
    gameAchievement: get(state, 'gamification.achievement', []),
    gameGroup: get(state, 'gamification.gameGroup', []),
    gameHistory: get(state, 'gamification.gameHistory', {}),
    imageType: get(state, 'image.imageType', []),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isSmallLoading: get(state, 'common.isSmallLoading', null),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    notification: get(state, 'common.notification', {}),
    regFields: get(state, 'form.Property.registeredFields', null),
    userTypes: get(state, 'user.userTypes', null),
    initialValues: {
      changeCountry: get(state, 'property.activeSingleProperty.location.countryCode', {}),
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
      location: {
        ...get(state, 'property.activeSingleProperty.location', {}),
        searchAddress: get(state, 'property.activeSingleProperty.location.address', {}),
      },
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
};
const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  resetForm(form) {
    (dispatch(reset(form)));
  },
  handleCreatePropertyVisitSchedule: bindActionCreators(createPropertyVisitSchedule, dispatch),
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetAchievement: bindActionCreators(getAchievement, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
  handleGetGameHistory: bindActionCreators(getGameHistory, dispatch),
  handleGetPropertyListings: bindActionCreators(getPropertyListings, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSavePropertyVisitBooking: bindActionCreators(savePropertyVisitBooking, dispatch),
  handleSavePropertyVisitSchedule: bindActionCreators(savePropertyVisitSchedule, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetScreenNotification: bindActionCreators(setScreenNotification, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleGetImageType: bindActionCreators(getImageType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardForm);
