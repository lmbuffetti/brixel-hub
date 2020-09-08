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
import { diff } from 'deep-object-diff';
import has from 'lodash/has';
import { change, initializeForm, reset } from '@brixel/brixel-components';
import {
  getPropertyListings,
  getActiveSingleProperty,
  saveActiveSingleProperty,
  getActiveSinglePropertyBookings,
  savePropertyVisitSchedule,
  createPropertyVisitSchedule,
  savePropertyVisitBooking,
} from '../../actions/PropertyActions';
import { deleteDocument, uploadDocument, getImageType } from '../../actions/UploadActions';
import {
  addGameHistory, getAchievement, getGamegroup, getGameHistory,
} from '../../actions/GamificationActions';
import { setModal, setPageData, setScreenNotification } from '../../actions/CommonActions';
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
    activeSingleProperty,
    errorValue,
    formValue,
    gameAchievement,
    gameGroup,
    gameHistory,
    handleAddGameHistory,
    handleCreatePropertyVisitSchedule,
    handleGetAchievement,
    handleGetActiveSingleCompany,
    handleGetActiveSingleProperty,
    handleGetActiveSinglePropertyBookings,
    handleGetGameGroup,
    handleGetGameHistory,
    handleGetImageType,
    handleGetPropertyListings,
    handleSaveActiveSingleProperty,
    handleSaveData,
    handleSavePropertyVisitSchedule,
    handleSetScreenNotification,
    history,
    imageType,
    initForm,
    initValues,
    initialValues,
    isLoading,
    isSmallLoading,
    loggedInUser,
    match,
    notification,
    resetForm,
    savePageData,
    userTypes,
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
      resetForm(initialValues);
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
    if (gameGroup.length === 0) handleGetGameGroup();
    if (gameHistory.length === 0) handleGetGameHistory();
  }, []);

  // INITIALIZE FORM
  useEffect(() => {
    const changeInitialValue = diff(initialValues, initValues);
    if (Object.keys(changeInitialValue).length > 1 || (Object.keys(changeInitialValue).length === 1 && Object.keys(changeInitialValue)[0] !== 'inputSheet')) initForm(cloneDeep(initialValues));
  }, [initialValues]);

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
          // handleAddGameHistory({ stub: 'media' });
        }
      }
    }
  };

  // FORM VALIDATION
  const validForm = () => {
    const changeObj = diff(initialValues, formValue);
    const allVal = [];
    let isValid = true;
    const extractKey = (obj, parent) => {
      Object.keys(obj).map((key) => {
        if (isObject(obj[key])) {
          const newKey = parent ? `${parent}.${key}` : key;
          extractKey(obj[key], newKey);
        } else {
          allVal.push(`${parent}.${key}`);
        }
        return null;
      });
    };
    extractKey(changeObj);
    allVal.map((name) => {
      const getError = get(errorValue, name, true);
      if (getError !== 'Mark Required' && getError !== true && isValid) isValid = false;
      return null;
    });
    return isValid;
  };

  // LOAD SAVE FUNCTION FORM REDUX
  useEffect(() => {
    if (savePageData === 'saveFacts') {
      saveData();
      handleSaveData(null);
    }
  }, [savePageData]);

  // FUNCTION TO DISCARD SAVE
  useEffect(() => {
    if (isDiscardChanges) {
      const newNotification = cloneDeep(notification);
      resetForm(initialValues);
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
      // initializeForm('inputSheet', inputSheet);
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
  activeSingleProperty: PropTypes.object.isRequired,
  errorValue: PropTypes.object,
  formValue: PropTypes.object.isRequired,
  gameAchievement: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameHistory: PropTypes.object.isRequired,
  handleAddGameHistory: PropTypes.func.isRequired,
  handleCreatePropertyVisitSchedule: PropTypes.func.isRequired,
  handleGetAchievement: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  handleGetGameGroup: PropTypes.func.isRequired,
  handleGetGameHistory: PropTypes.func.isRequired,
  handleGetImageType: PropTypes.func.isRequired,
  handleGetPropertyListings: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  handleSaveData: PropTypes.func.isRequired,
  handleSavePropertyVisitSchedule: PropTypes.func.isRequired,
  handleSetScreenNotification: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  imageType: PropTypes.arrayOf(PropTypes.object).isRequired,
  initForm: PropTypes.func.isRequired,
  initValues: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSmallLoading: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  notification: PropTypes.object,
  resetForm: PropTypes.func.isRequired,
  savePageData: PropTypes.string,
  userTypes: PropTypes.string,
};

Dashboard.defaultProps = {
  errorValue: null,
  isSmallLoading: null,
  notification: null,
  savePageData: null,
  userTypes: null,
};

const mapStateToProps = (state) => {
  const properties = get(state, 'property.activeSingleProperty.properties', {});
  const formValue = get(state, 'property.activeSingleProperty', {});
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
  const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
  inputSheet.totalComplete = calcPercentageFacts('Property', formValue).calcPerc;
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', undefined),
    errorValue: get(state, 'brixelForm.Property.syncErrors', null),
    formValue: get(state, 'brixelForm.Property.values', {}),
    gameAchievement: get(state, 'gamification.achievement', []),
    gameGroup: get(state, 'gamification.gameGroup', []),
    gameHistory: get(state, 'gamification.gameHistory', {}),
    imageType: get(state, 'image.imageType', []),
    initValues: get(state, 'brixelForm.Property.initialValues', {}),
    initialValues: {
      assessor: get(state, 'property.activeSingleProperty.assessor', {}),
      booking: get(state, 'property.activeSinglePropertyBooking', []),
      changeCountry: get(state, 'property.activeSingleProperty.location.countryCode', {}),
      coverPhoto: get(state, 'property.activeSingleProperty.coverPhoto', {}),
      description: get(state, 'property.activeSingleProperty.description', {}),
      documents: get(state, 'property.activeSingleProperty.documents', []),
      floorPlans: get(state, 'property.activeSingleProperty.floorPlans', []),
      id: get(state, 'property.activeSingleProperty.id', null),
      inputSheet: get(state, 'property.activeSingleProperty.inputSheet', inputSheet) || inputSheet,
      location: {
        ...get(state, 'property.activeSingleProperty.location', {}),
        searchAddress: get(state, 'property.activeSingleProperty.location.address', {}),
      },
      price: get(state, 'property.activeSingleProperty.price', {}),
      status: get(state, 'property.activeSingleProperty.status', null),
      // language: get(state, 'property.activeSingleProperty.language', null),
      // listed: get(state, 'property.activeSingleProperty.listed', null),
      photos: get(state, 'property.activeSingleProperty.photos', []),
      packageUpgrade: {
        contactEmail: get(state, 'user.loggedInUser.user.email', ''),
        contactPhone: get(state, 'user.loggedInUser.user.phone', ''),
      },
      portals: get(state, 'property.activeSingleProperty.portals', {}),
      portalsReview: get(state, 'property.activeSingleProperty.portalsReview', null),
      properties: get(state, 'property.activeSingleProperty.properties', {}),
      publishReview: get(state, 'property.activeSingleProperty.publishReview', null),
      published: get(state, 'property.activeSingleProperty.published', null),
      schedule: get(state, 'property.activeSingleProperty.schedule', {}),
      stub: get(state, 'property.activeSingleProperty.stub', null),
      title: get(state, 'property.activeSingleProperty.title', null),
      virtual: get(state, 'property.activeSingleProperty.virtual', null),
    },
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isSmallLoading: get(state, 'common.isSmallLoading', null),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    notification: get(state, 'common.notification', {}),
    regFields: get(state, 'brixelForm.Property.registeredFields', null),
    savePageData: get(state, 'common.setPageData', null),
    userTypes: get(state, 'user.userTypes', null),
  });
};
const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('Property', value));
  },
  resetForm(data) {
    (dispatch(reset('Property', data)));
  },
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleCreatePropertyVisitSchedule: bindActionCreators(createPropertyVisitSchedule, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleGetAchievement: bindActionCreators(getAchievement, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleGetGameGroup: bindActionCreators(getGamegroup, dispatch),
  handleGetGameHistory: bindActionCreators(getGameHistory, dispatch),
  handleGetImageType: bindActionCreators(getImageType, dispatch),
  handleGetPropertyListings: bindActionCreators(getPropertyListings, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSaveData: bindActionCreators(setPageData, dispatch),
  handleSavePropertyVisitBooking: bindActionCreators(savePropertyVisitBooking, dispatch),
  handleSavePropertyVisitSchedule: bindActionCreators(savePropertyVisitSchedule, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetScreenNotification: bindActionCreators(setScreenNotification, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
