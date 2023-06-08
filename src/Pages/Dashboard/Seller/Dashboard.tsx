import React, {Suspense, useEffect, useState} from 'react';
import {change, initializeForm, reset} from '@brixel-io/brixel-components/dist/form';
import {diff} from 'deep-object-diff';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import isObject from 'lodash/isObject';
import omit from 'lodash/omit';
import set from 'lodash/set';
import {connect} from 'react-redux';
import {Navigate, Route, Routes, useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {setModal, setPageData, setScreenNotification, spinnerOff, spinnerOn} from '../../../actions/CommonActions';
import {getActiveSingleCompany} from '../../../actions/CompanyActions';
import {
  getActiveSingleProperty,
  getScheduleVisit,
  getEstimation,
  getPackageProperty,
  saveActiveSingleProperty,
} from '../../../actions/PropertyActions';
import {deleteDocument, getImageType, uploadDocument} from '../../../actions/UploadActions';
import {setUserTypes} from '../../../actions/UserActions';
import lazyWithRetry from '../../../components/LazyWithRetry';
import {calcPercentageFacts} from '../../../utils/helpers';

import SellerSidebar from './SellerSidebar';
import type {DashboardType} from '../../../@types/Pages/Dashboard/Seller/Dashboard';

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

const Dashboard = (props: DashboardType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleCompany,
    activeSingleProperty,
    errorValue,
    formValue,
    handleGetActiveSingleCompany,
    handleGetActiveSingleProperty,
    handleGetScheduleVisit,
    handleGetActiveSinglePropertyEstimation,
    handleGetImageType,
    handleGetPackageProperty,
    handleSaveActiveSingleProperty,
    handleSetScreenNotification,
    handleSetUserTypes,
    handleSpinnerOff,
    imageType,
    initForm,
    initialValues,
    isLoading,
    isSmallLoading,
    loggedInUser,
    notification,
    handleReset,
  } = props;
  const [loadedProp, setLoadedProp] = useState(false);

  // GET URL PARAMS
  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (get(loggedInUser, 'id', null) && activeSingleProperty?.id) {
      if (loggedInUser?.id !== get(activeSingleProperty, 'owner.id', null) && loggedInUser?.id !== activeSingleProperty.owner) {
        history.push(`/buyer/${activeSingleProperty.id}/property`);
      }
    } else {
      handleSetUserTypes('seller');
    }
  }, [loggedInUser?.id, activeSingleProperty?.id]);

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

  // FUNCTION TO LOAD THE PROPERTY BY ID OR LOAD THE DEFAULT
  useEffect(() => {
    if ((propID !== get(activeSingleProperty, 'id', null) || !get(activeSingleProperty, 'id', null)) && propID !== 'sell') {
      if (propID && propID !== 'home' && propID !== 'company') {
        handleGetActiveSingleProperty({ fullVersion: true, id: propID, multiLoader: !formValue.id });
        handleGetPackageProperty({ id: propID });
        handleGetActiveSinglePropertyEstimation({ id: propID, smallLoader: 'getEstimation' });
      } else {
        handleSpinnerOff();
      }
    }
    setLoadedProp(true);
  }, [propID]);

  // INITIALIZE FORM
  useEffect(() => {
    if (propID !== 'seller' && propID !== 'buyer' && propID && activeSingleProperty?.id === propID) {
      initForm(cloneDeep(initialValues));
    }
  }, [activeSingleProperty, propID]);

  // FUNCTION TO REDIRECT TO REWARDS PAGE OR LOAD EMPTY STATE (IF USER NO HAS PROPERTY) - LOAD COMPANY FRO SELECTED PROPERTY
  useEffect(() => {
    if (loadedProp && propID !== 'sell' && activeSingleProperty?.id) {
      if ((typeof activeSingleProperty !== 'undefined' && get(activeSingleProperty, 'id', null)) || propID === 'no-property') {
        if ((!propID || propID === 'no-property') && get(activeSingleProperty, 'id', null)) {
          const isSellerUser = get(loggedInUser, 'user.seller', false);
          const isBuyerUser = get(loggedInUser, 'user.buyer', false);
          if (!isSellerUser && isBuyerUser) history.push('/buy');
          else history.push('/sell');
        }
        if (get(activeSingleProperty, 'owner', null) === get(loggedInUser, 'user.id', '')) {
          // handleGetActiveSingleProperty({ fullVersion: true, id: propID });
          handleGetScheduleVisit({ id: propID });
        }
        if (imageType.length === 0) handleGetImageType();
      } else {
        history.push('/sell');
      }
    }
    const activeLeads = get(activeSingleProperty, 'company.id', get(activeSingleProperty, 'company', null));
    if (activeLeads && activeLeads !== activeSingleCompany.id && activeSingleProperty.id) {
      handleGetActiveSingleCompany({ id: activeLeads, smallLoader: 'singleCompany' });
    }
  }, [activeSingleProperty?.id]);

  // FUNCTION TO GLOBAL SAVE - BUTTON SAVE ON NOTIFICATION BAR
  const saveData = () => {
    const changeObj = diff(initialValues, formValue);
    if (Object.keys(changeObj).length > 0) {
      const objToSave = {};
      Object.keys(changeObj).forEach((key) => {
        objToSave[key] = get(formValue, key, {});
      });
      if (get(changeObj, 'photos', null)) {
        set(objToSave , 'coverPhoto', get(formValue, 'photos', [])[0]);
      }
      set(objToSave, 'inputSheet', get(formValue, 'inputSheet', {}));
      const data = {
        id: propID,
        smallLoader: 'saveData',
        setSuccessNotification: true,
        ...objToSave,
      };
      handleSaveActiveSingleProperty(data);
    }
  };

  // FORM VALIDATION
  const validForm = () => {
    const changeObj = diff(initialValues, formValue);
    const allVal: string[] = [];
    let isValid = true;
    const extractKey = (obj, parent: string | null = null) => {
      Object.keys(obj).forEach((key) => {
        if (isObject(obj[key])) {
          const newKey = parent ? `${parent}.${key}` : key;
          extractKey(obj[key], newKey);
        } else {
          allVal.push(`${parent}.${key}`);
        }
      });
    };
    extractKey(changeObj);
    allVal.forEach((name) => {
      const getError = get(errorValue, name, null);
      if (getError !== true && getError !== null && isValid) isValid = false;
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
    if (!get(history, 'location.pathname', '').includes('formFlow')) {
      const docsList = get(diff(initialValues, formValue), 'documents', []);
      const isDocEdit = find(docsList, (el) => {
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
        changeObj = omit(changeObj, ['inputSheet', 'documents']);
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
          (Object.keys(changeObj).length > 1 || !get(changeObj, 'inputSheet', null)) &&
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
        set(inputSheet, 'totalComplete', calcPercentageFacts().calcPerc);
        // initializeForm('inputSheet', inputSheet);
      }
    }
  }, [formValue, errorValue]);

  const sectionClass = get(history, 'location.pathname', '/').split('/');

  return (
    <>
      <div className={`dashboardContainer mt-0 mt-md-3 dis-f jc-b ${sectionClass[2]}`} id="dashboard">
        <div className="w-perc-100">
          <Suspense fallback={<></>}>
            {/* teaserScreens && isEligible(activeSingleProperty) && () */}
            { /* SECTION: ROUTES FOR ONLY LOGGED USER - MAIN HUB PAGES  */ }
            <Routes>
              <Route path="/home" element={<DashboardHome />} />
              <Route path="/property/*" element={<PropertyDashboard />} />
              <Route path="/docubox/*" element={<Documents />} />
              <Route path="/marketing" element={<MarketingDashboard />} />
              <Route path="/prospects/*" element={<Deals />} />
              <Route path="/closing/*" element={<DashboardOffer />} />
              <Route path="/upgrade/*" element={<Upgrade />} />
              <Route path="/trialRequest/*" element={<ScanTrialFlow />} />
              <Route path="/no-property" element={<EmptyProperty />} />
              <Route path="*" element={<Navigate to={`/${propID}/home`} />} />
            </Routes>
          </Suspense>
        </div>
        {
          get(history, 'location.pathname', '').includes('home') && (
            <div className="historySidebar w-perc-100 max-w-fix-360">
              <SellerSidebar />
            </div>
          )
        }
      </div>
    </>
  );
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
      allowVisits: get(state, 'property.activeSingleProperty.allowVisits', true),
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
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
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
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleGetScheduleVisit: bindActionCreators(getScheduleVisit, dispatch),
  handleGetActiveSinglePropertyEstimation: bindActionCreators(getEstimation, dispatch),
  handleGetImageType: bindActionCreators(getImageType, dispatch),
  handleGetPackageProperty: bindActionCreators(getPackageProperty, dispatch),
  handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
  handleSaveData: bindActionCreators(setPageData, dispatch),
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
