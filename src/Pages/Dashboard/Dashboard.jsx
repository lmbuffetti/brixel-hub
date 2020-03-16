/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
//import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { getPropertyListings, getActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
import { getCalcSectionInputSheets } from '../../utils/helpers';
import { InputSheets } from '../../resources/inputSheets';
import { reduxForm, reset } from 'redux-form';
import cloneDeep from 'lodash/cloneDeep';
import { diff } from 'deep-object-diff';
import { deleteDocument, uploadDocument } from '../../actions/UploadActions';
import { setModal, setScreenNotification } from '../../actions/CommonActions';

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
    errorValue,
    formValue,
    handleGetProperties,
    handleGetProperty,
    handleSaveProperty,
    history,
    initialValues,
    isSmallLoading,
    loggedInUser,
    match,
    notification,
    property,
    regFields,
    setNotification,
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
      handleGetProperty({fullVersion: false, id: propID});
    } else if (!propID) {
      const data = {
        limit: 1,
        offset: `0/?owner=${loggedInUser.user.id}`,
        setAsSingle: true,
      };
      handleGetProperties(data);
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

  const saveData = async () => {
    const dataToSend = formValue;
    delete dataToSend.owner;
    delete dataToSend.favoritedByUsers;
    const data = {
      id: propID,
      smallLoader: true,
      ...dataToSend,
      setSuccessNotification: true,
    };
    // For now we still dont use the diff object (TODO: API ticket)
    // diff(initialValues, formValue)
    // const dataInputSheet = {
    //   skipSection: skipSection,
    // totalComplete: getCalcSectionInputSheets(Questions, formValue, accordion,'getPercentage', null),
    // };

    // await handleSaveProperty({id: propID, inputSheet: dataInputSheet});
    await handleSaveProperty(data);
  };

  const discardChanges = () => {
    reset('Property');
  };

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
          setNotification({
            state: false,
            type: 'info',
            label: 'Save changes?',
            actions:
              [
                { type: 'primary', label: 'Save', func: () => saveData(), isLoading: isSmallLoading },
                { type: 'secondary', label: 'Discard', func: () => discardChanges() },
              ],
          });
        }
        // SET NOTIFICATION TO SUCCESS SAVE
      } else if (Object.keys(diff(initialValues, formValue)).length === 0 && notification.type === 'success') {
        //setTimeout(() => closeNotificationBar(), 2000);
        // REMOVE NOTIFICATION
      } else if (Object.keys(diff(initialValues, formValue)).length === 0 && notification.type === 'info') {
        // setNotification({ state: false });
      } else {
        // closeNotificationBar()
      }
    }
  }, [formValue, isSmallLoading, initialValues]);

  if (!userTypes) return (<div />);

  return (
    <div className="container" id="dashboard">

      { /* SECTION: APP HEADER */ }

      <div className="w-perc-100">
        <ProtectedRoute path="/:propId?/rewards/:rewardType?" component={RewardsDashboard} />
        <ProtectedRoute path="/:propId?/property" component={PropertyDashboard} />
        <ProtectedRoute path="/:propId?/listings" component={SupportDashboard} />
        <ProtectedRoute path="/:propId?/support" component={SupportDashboard} />
      </div>


    </div>
  )
};

Dashboard.propTypes = {
  errorValue: PropTypes.object,
  formValue: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.bool,
  userTypes: PropTypes.string,
  handleGetProperties: PropTypes.func.isRequired,
  handleGetProperty: PropTypes.func.isRequired,
  handleSaveProperty: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  notification: PropTypes.object.isRequired,
  regFields: PropTypes.object,
  setNotification: PropTypes.func.isRequired,
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
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  setNotification: bindActionCreators(setScreenNotification, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardForm);
