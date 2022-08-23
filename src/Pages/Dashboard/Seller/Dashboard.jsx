// @collapse
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useState, Suspense,
} from 'react';
import {
  Routes, Route, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import omit from 'lodash/omit';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import find from 'lodash/find';
import { diff } from 'deep-object-diff';
import has from 'lodash/has';
import { change, initializeForm, reset } from '@brixel/brixel-components/dist/form';
import { setUserTypes } from '../../../actions/UserActions';
import lazyWithRetry from '../../../components/LazyWithRetry';
import Loading from '../../../components/Loading';
import {
  getPropertyListings,
  getActiveSingleProperty,
  saveActiveSingleProperty,
  getActiveSinglePropertyBookings,
  savePropertyVisitSchedule,
  createPropertyVisitSchedule,
  savePropertyVisitBooking,
  getEstimation,
  getPackageProperty,
} from '../../../actions/PropertyActions';
import { deleteDocument, uploadDocument, getImageType } from '../../../actions/UploadActions';
import {
  setModal, setPageData, setScreenNotification, spinnerOff, spinnerOn,
} from '../../../actions/CommonActions';
import { getActiveSingleCompany } from '../../../actions/CompanyActions';
import { calcPercentageFacts } from '../../../utils/helpers';

import SellerSidebar from './SellerSidebar';

const DashboardHome = lazyWithRetry(() => import('./DashboardHome'));

const PropertyDashboard = lazyWithRetry(() => import('./PropertyDashboard'));

const MarketingDashboard = lazyWithRetry(() => import('./MarketingDashboard'));

const Deals = lazyWithRetry(() => import('../../Deals/Deals'));

const EmptyProperty = lazyWithRetry(() => import('./EmptyProperty'));

const Documents = lazyWithRetry(() => import('../../SingleProperty/Documents'));

const DashboardOffer = lazyWithRetry(() => import('../../Closing/Offers/DashboardOffer'));

// UPGRADE
const Upgrade = lazyWithRetry(() => import('../../Upgrade/Upgrade'));

const ScanTrialFlow = lazyWithRetry(() => import('../../ContactFlow/ScanTrial/ScanTrialFlow'));

const Dashboard = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    // gameAchievement,
    // handleGetAchievement,
    // handleGetGameGroup,
    // handleGetGameHistory,
    activeSingleCompany,
    activeSingleProperty,
    errorValue,
    formValue,
    handleCreatePropertyVisitSchedule,
    handleGetActiveSingleCompany,
    handleGetActiveSingleProperty,
    handleGetActiveSinglePropertyBookings,
    handleGetActiveSinglePropertyEstimation,
    handleGetImageType,
    handleGetPackageProperty,
    handleGetPropertyListings,
    handleSaveActiveSingleProperty,
    handleSavePropertyVisitSchedule,
    handleSetScreenNotification,
    handleSetUserTypes,
    handleSpinnerOff,
    imageType,
    initForm,
    initValues,
    initialValues,
    isLoading,
    isSmallLoading,
    loggedInUser,
    notification,
    handleReset,
    userTypes,
  } = props;
  const [userType, setUserType] = useState(null);
  const [loadedProp, setLoadedProp] = useState(false);
  const [progressStep, setProgressStep] = useState({});
  // const [showMessage, setShowMessage] = useState(false);

  // GET URL PARAMS
  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (get(loggedInUser, 'user.id', null) && activeSingleProperty.id) {
      if (loggedInUser.user.id !== activeSingleProperty.owner.id && loggedInUser.user.id !== activeSingleProperty.owner) {
        history.push(`/buyer/${activeSingleProperty.id}/property`);
      }
    } else {
      handleSetUserTypes('seller');
    }
  }, [loggedInUser, activeSingleProperty]);

  // FUNCTION TO RESET FORM ON CHANGE SECTIONS - EXCEPT FOR FACTS AND ACHIEVEMENT FLOW
  useEffect(() => {
    if (
      !get(history, 'location.pathname', '').includes('facts') &&
      !get(history, 'location.pathname', '').includes('achievement') &&
      !get(history, 'location.pathname', '').includes('docubox') &&
      get(activeSingleProperty, 'id', null)
    ) {
      handleReset(initialValues);
    }
    if (get(history, 'location.pathname', '').includes('deal') && !get(history, 'location.pathname', '').includes('prospects')) {
      history.push({ pathname: `/${propID}/prospects` });
    }
  }, [history.location.pathname]);

  // FUNCTION TO LOAD DEFAULT USER PROPERTY IF NO ID
  const loadDefaultProperty = () => {
    if (!get(formValue, 'id', null)) {
      const data = {
        limit: 1,
        offset: `0/?owner=${get(loggedInUser, 'user.id', '')}`,
        setAsSingle: true,
        multiLoader: true,
      };
      handleGetPropertyListings(data);
    }
  };

  // FUNCTION TO LOAD THE PROPERTY BY ID OR LOAD THE DEFAULT
  useEffect(() => {
    if ((propID !== get(activeSingleProperty, 'id', null) || !get(activeSingleProperty, 'id', null)) && propID !== 'sell') {
      if (propID && propID !== 'home' && propID !== 'company') {
        handleGetActiveSingleProperty({ fullVersion: true, id: propID, multiLoader: !formValue.id });
        handleGetPackageProperty({ id: propID });
        handleGetActiveSinglePropertyEstimation({ id: propID, smallLoader: 'getEstimation' });
      } else if (!propID) {
        // history.push('/home');
        loadDefaultProperty();
      } else {
        handleSpinnerOff();
      }
    }
    setLoadedProp(true);
  }, [propID]);

  // INITIALIZE FORM
  useEffect(() => {
    const changeInitialValue = diff(initialValues, initValues);
    if (
      typeof activeSingleProperty !== 'undefined' && get(activeSingleProperty, 'id', null) && (
        Object.keys(changeInitialValue).length > 1 ||
        (Object.keys(changeInitialValue).length === 1 && Object.keys(changeInitialValue)[0] !== 'inputSheet') ||
        propID !== formValue.id
      )
    ) {
      if (propID !== 'seller' && propID !== 'buyer' && propID && activeSingleProperty.id === propID) {
        initForm(cloneDeep(initialValues));
      }
    }
  }, [initialValues, propID]);

  // FUNCTION TO REDIRECT TO REWARDS PAGE OR LOAD EMPTY STATE (IF USER NO HAS PROPERTY) - LOAD COMPANY FRO SELECTED PROPERTY
  useEffect(() => {
    if (loadedProp && propID !== 'sell' && activeSingleProperty.id) {
      if ((typeof activeSingleProperty !== 'undefined' && get(activeSingleProperty, 'id', null)) || propID === 'no-property') {
        if ((!propID || propID === 'no-property') && get(activeSingleProperty, 'id', null)) {
          const isSellerUser = get(loggedInUser, 'user.seller', false);
          const isBuyerUser = get(loggedInUser, 'user.buyer', false);
          if (!isSellerUser && isBuyerUser) history.push('/buy');
          else history.push('/sell');
        }
        if (get(activeSingleProperty, 'owner', null) === get(loggedInUser, 'user.id', '')) {
          // handleGetActiveSingleProperty({ fullVersion: true, id: propID });
          handleGetActiveSinglePropertyBookings({ id: propID });
        }
        if (imageType.length === 0) handleGetImageType();
      } else {
        setUserType('emptyState');
        history.push('/sell');
      }
    }
    const activeLeads = get(activeSingleProperty, 'company.id', get(activeSingleProperty, 'company', null));
    if (activeLeads && activeLeads !== activeSingleCompany.id && activeSingleProperty.id) {
      handleGetActiveSingleCompany({ id: activeLeads, smallLoader: 'singleCompany' });
    }
  }, [activeSingleProperty.id]);

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
          objToSave.coverPhoto = get(formValue, 'photos', [])[0];
        }
        objToSave.inputSheet = get(formValue, 'inputSheet', {});
        const data = {
          id: propID,
          smallLoader: 'saveData',
          setSuccessNotification: true,
          ...objToSave,
        };
        handleSaveActiveSingleProperty(data);
        // const inputSheet = get(formValue, 'inputSheet', {}) || {};
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
    const checkSaveNotidification = notification.filter((item) => item.action === 'saveData');
    if (checkSaveNotidification.length > 0) {
      saveData();
    }
  }, [notification]);

  // FUNCTION TO SHOW/HIDE THE NOTIFICATION BAR TO SAVE
  useEffect(() => {
    // eslint-disable-next-line consistent-return
    if (!get(history, 'location.pathname', '').includes('formFlow')) {
      const isDocEdit = find(diff(initialValues, formValue).documents, (el) => {
        if (history.location.pathname.includes('docubox') &&
          (has(el, 'isPrivate') || has(el, 'name') || has(el, 'folder')) &&
          !has(el, 'id')) {
          return true;
        }
        return false;
      });
      if (formValue.id && initialValues.id) {
        let changeObj = diff(initialValues, formValue);
        const checkIsValid = Object.keys(changeObj).find((key) => typeof changeObj[key] !== 'undefined');
        changeObj = omit(changeObj, ['inputSheet']);
        const getIndexNotification = notification.findIndex((item) => item.type === 'save');
        if (Object.keys(changeObj).length === 0 && get(notification, 'label', '').toLowerCase().includes('changes')) {
          handleSetScreenNotification({
            ...notification[getIndexNotification],
            state: false,
          });
        }
        if (
          checkIsValid &&
          Object.keys(changeObj).length > 0 &&
          (Object.keys(changeObj).length > 1 || !changeObj.inputSheet) &&
          !isSmallLoading.saveData &&
          !isLoading &&
          !has(isDocEdit, 'name') &&
          !has(isDocEdit, 'isPrivate') &&
          !has(isDocEdit, 'folder') &&
          validForm()
        ) {
          handleSetScreenNotification({
            state: true,
            type: 'save',
            label: 'Unsaved changes',
          });
        } else if (
          !!notification &&
          !get(notification, 'label', '').toLowerCase().includes('saved')
        ) {
          handleSetScreenNotification({
            ...notification[getIndexNotification],
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
    }
  }, [formValue, errorValue]);

  if (!userTypes && !userType) return (<div />);

  const sectionClass = get(history, 'location.pathname', '/').split('/');

  return (
    <>
      <div className={`dashboardContainer mt-0 mt-md-3 dis-f jc-b ${sectionClass[2]}`} id="dashboard">
        <div className="w-perc-100">
          <Suspense fallback={<Loading isLoading />}>
            {/* teaserScreens && isEligible(activeSingleProperty) && () */}
            { /* SECTION: ROUTES FOR ONLY LOGGED USER - MAIN HUB PAGES  */ }
            <Routes>
              <Route path="/home" element={<DashboardHome onProgressStep={(step) => setProgressStep(step)} />} />
              <Route path="/property/*" element={<PropertyDashboard />} />
              <Route path="/docubox/*" element={<Documents />} />
              <Route path="/marketing/*" element={<MarketingDashboard />} />
              <Route path="/prospects/*" element={<Deals />} />
              <Route path="/closing/*" element={<DashboardOffer />} />
              <Route path="/upgrade/*" element={<Upgrade />} />
              <Route path="/trialRequest/*" element={<ScanTrialFlow />} />
              <Route path="/no-property" element={<EmptyProperty />} />
            </Routes>
          </Suspense>
        </div>
        {
          get(history, 'location.pathname', '').includes('home') && (
            <div className="historySidebar w-perc-100 max-w-fix-360">
              <SellerSidebar progressStep={progressStep} />
            </div>
          )
        }
      </div>
    </>
  );
};

Dashboard.propTypes = {
  // handleSpinnerOn: PropTypes.func.isRequired,
  activeSingleCompany: PropTypes.object,
  activeSingleProperty: PropTypes.object,
  errorValue: PropTypes.object,
  formValue: PropTypes.object.isRequired,
  handleCreatePropertyVisitSchedule: PropTypes.func.isRequired,
  handleGetActiveSingleCompany: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  handleGetActiveSinglePropertyEstimation: PropTypes.func.isRequired,
  handleGetImageType: PropTypes.func.isRequired,
  handleGetPackageProperty: PropTypes.func.isRequired,
  handleGetPropertyListings: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSaveActiveSingleProperty: PropTypes.func.isRequired,
  handleSavePropertyVisitSchedule: PropTypes.func.isRequired,
  handleSetScreenNotification: PropTypes.func.isRequired,
  handleSetUserTypes: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  imageType: PropTypes.arrayOf(PropTypes.object).isRequired,
  initForm: PropTypes.func.isRequired,
  initValues: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  notification: PropTypes.arrayOf(PropTypes.object).isRequired,
  userTypes: PropTypes.string,
};

Dashboard.defaultProps = {
  activeSingleCompany: {},
  activeSingleProperty: {},
  errorValue: null,
  userTypes: null,
};

const mapStateToProps = (state) => {
  const properties = get(state, 'property.activeSingleProperty.properties', {});
  const formValue = get(state, 'property.activeSingleProperty', {});
  set(properties, 'typology.livingArea.unit', 'm2');
  set(properties, 'typology.grossArea.unit', 'm2');
  set(properties, 'typology.additionalArea.unit', 'm2');
  set(properties, 'typology.lotArea.unit', 'm2');
  set(properties, 'typology.floorSpace.unit', 'm2');
  set(properties, 'typology.roomHeight.unit', 'm');
  set(properties, 'typology.lotAreaUsable.unit', 'm2');
  set(properties, 'typology.constructedVolume.unit', 'm3');
  set(properties, 'typology.balconyArea.unit', 'm2');
  set(properties, 'typology.gardenArea.unit', 'm2');
  set(properties, 'building.expandableAtticArea.unit', 'm2');
  set(properties, 'typology.basementArea.unit', 'm2');
  set(properties, 'typology.storeroomArea.unit', 'm2');
  set(properties, 'typology.collectiveSpacesArea.unit', 'm2');
  const inputSheet = cloneDeep(get(formValue, 'inputSheet', {}) || {});
  inputSheet.totalComplete = calcPercentageFacts('Property', formValue).calcPerc;
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: has(state, 'property.activeSingleProperty.id') ? get(state, 'property.activeSingleProperty', { }) : undefined,
    errorValue: get(state, 'brixelForm.Property.syncErrors', null),
    formValue: get(state, 'brixelForm.Property.values', {}),
    imageType: get(state, 'images.imageType', []),
    initValues: get(state, 'brixelForm.Property.initialValues', {}),
    initialValues: {
      // booking: get(state, 'property.activeSinglePropertyBooking', []),
      allowVisits: get(state, 'property.activeSingleProperty.allowVisits', false),
      changeCountry: get(state, 'property.activeSingleProperty.location.countryCode', {}),
      coverPhoto: get(state, 'property.activeSingleProperty.coverPhoto', {}),
      // customPortals: get(state, 'property.activeSingleProperty.customPortals', {}),
      description: get(state, 'property.activeSingleProperty.description', {}),
      documents: get(state, 'property.activeSingleProperty.documents', []),
      floorPlans: get(state, 'property.activeSingleProperty.floorPlans', []),
      id: get(state, 'property.activeSingleProperty.id', null),
      inputSheet: get(state, 'property.activeSingleProperty.inputSheet', inputSheet) || inputSheet,
      location: {
        ...get(state, 'property.activeSingleProperty.location', {}),
        searchAddress: get(state, 'property.activeSingleProperty.location.address', {}),
      },
      packageFlowProcess: get(state, 'property.activeSingleProperty.packageFlowProcess', {}),
      price:{
        ...get(state, 'property.activeSingleProperty.price', {}),
        total: get(state, 'property.activeSingleProperty.price.total', ''),
      },
      proEstimation: get(state, 'property.activeSingleProperty.proEstimation', {}),
      status: get(state, 'property.activeSingleProperty.status', null),
      // language: get(state, 'property.activeSingleProperty.language', null),
      // listed: get(state, 'property.activeSingleProperty.listed', null),
      photos: get(state, 'property.activeSingleProperty.photos', []),
      packageUpgrade: {
        contactEmail: get(state, 'user.loggedInUser.user.email', ''),
        contactPhone: get(state, 'user.loggedInUser.user.phone', ''),
      },
      // portals: allPortals,
      portalsReview: get(state, 'property.activeSingleProperty.portalsReview', null),
      properties,
      preMarketVisible: get(state, 'property.activeSingleProperty.preMarketVisible', false),
      publishReview: get(state, 'property.activeSingleProperty.publishReview', null),
      published: get(state, 'property.activeSingleProperty.published', null),
      // schedule: get(state, 'property.activeSingleProperty.schedule', {}),
      // stub: get(state, 'property.activeSingleProperty.stub', null),
      title: get(state, 'property.activeSingleProperty.title', null),
      virtual: get(state, 'property.activeSingleProperty.virtual', null),
    },
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    loggedInUser: get(state, 'user.loggedInUser', {}),
    notification: get(state, 'common.notification', []),
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
  handleReset(data) {
    (dispatch(reset('Property', data)));
  },
  handleCreatePropertyVisitSchedule: bindActionCreators(createPropertyVisitSchedule, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleGetActiveSinglePropertyEstimation: bindActionCreators(getEstimation, dispatch),
  handleGetImageType: bindActionCreators(getImageType, dispatch),
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
  handleGetPropertyListings: bindActionCreators(getPropertyListings, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSaveData: bindActionCreators(setPageData, dispatch),
  handleSavePropertyVisitBooking: bindActionCreators(savePropertyVisitBooking, dispatch),
  handleSavePropertyVisitSchedule: bindActionCreators(savePropertyVisitSchedule, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSetScreenNotification: bindActionCreators(setScreenNotification, dispatch),
  handleSetUserTypes: bindActionCreators(setUserTypes, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
