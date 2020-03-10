/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reduxForm, reset } from 'redux-form';
import get from 'lodash/get';
import has from 'lodash/has';
import last from 'lodash/last';
import cloneDeep from 'lodash/cloneDeep';
import {
  BrixelButtonIcon,
  BrixelProgressBar,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
  setModal, setNotification,
} from '../../actions/CommonActions';
import LoadingSimple from '../../components/LoadingSimple';
import { uploadDocument, deleteDocument } from '../../actions/UploadActions';


// COMPONENTS
import Loading from '../../components/Loading';
import { updateProperty, getProperty } from '../../actions/PropertyActions';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import noCover from '../../images/no_cover.jpg';
import { BrixelTabs } from '@brixel/brixel-components';
import { diff } from 'deep-object-diff';
import { InputSheets } from '../../resources/inputSheets';

const DrawerLayout = Loadable({
  loader: () => import('../../components/DrawerLayout' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const Facts = Loadable({
  loader: () => import('./Facts' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const Media = Loadable({
  loader: () => import('./Media/Media' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const Settings = Loadable({
  loader: () => import('./Settings' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const DetailMedia = Loadable({
  loader: () => import('./Media/DetailMedia' /* webpackChunkName: "DetailMedia" */),
  loading: Loading,
});

const InputSheet = (props) => {
  // PROPS
  const {
    errorValue,
    formValue,
    handleSaveProperty,
    history,
    initial,
    initialValues,
    match,
    notification,
    reset,
    setNotification,
  } = props;
  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const checkActiveTab = () => last(history.location.pathname.split('/'));
  // STATE
  const [Questions] = useState(InputSheets('en'));

  const closeNotificationBar = () => {
    setNotification({ state: false });
  };

  const discardChanges = () => {
    reset('InputSheet');
  };

  const saveData = async () => {
    const dataToSend = formValue;
    delete dataToSend.owner;
    delete dataToSend.favoritedByUsers;
    const data = {
      id: propID,
      ...dataToSend,
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

  useEffect(() => {
    // SET NOTIFICATION AND CHECK IF VALUES ARE CHANGED
    if (formValue.id && initialValues.id) {
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
        if (setValid) {
          setNotification({
            state: true,
            type: 'info',
            label: 'Save changes?',
            actions:
              [
                { type: 'primary', label: 'Save', func: () => saveData() },
                { type: 'secondary', label: 'Discard', func: () => discardChanges() },
              ],
          });
        } else {
          closeNotificationBar()
        }
        // SET NOTIFICATION TO SUCCESS SAVE
      } else if (Object.keys(diff(initialValues, formValue)).length === 0 && notification.type === 'success') {
        setTimeout(() => closeNotificationBar(), 2000);
        // REMOVE NOTIFICATION
      } else if (Object.keys(diff(initialValues, formValue)).length === 0 && notification.type === 'info') {
        setNotification({ state: false });
      }
    }
  }, [formValue]);

  const closeFacts = () => {
    closeNotificationBar()
    history.push(`/${propID}/property`);
  };

  return (
    <DrawerLayout classNameDrawer="ov-a" closeLink={`/${propID}/property`}>
      <div className="dis-fl-col mt-2">
        <div className="property-info-container px-2">
          <div className="header-section dis-fl-row a-c jc-b mb-2">
            <div className="dis-fl-row">
              <div className="avatar w-fix-48 brdCircle h-fix-48 a-c jc-c">
                {
                  initial.coverPhoto && initial.coverPhoto.path ? (
                    <img className="avatar w-fix-48 h-fix-48 brdRadius pos-r" src={`${getConfigEnv.shortPath}${initial.coverPhoto.thumbnailPath}`} alt="Brixel Logo" id="avatar" />
                  ) : (
                    <i
                      className="avatar w-fix-48 h-fix-48 brdRadius pos-r"
                      style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'block',
                        backgroundRepeat: 'no-repeat',
                        backgroundImage: `url(${noCover})`,
                      }}
                    />
                  )
                }
              </div>
              <div className="title ml-1">
                <span className="name dis-fl-row body fweight-500 txtDark700 pt-1">
                  {(has(initial.properties, 'typology') && has(initial.properties.typology, 'bedrooms')) ? initial.properties.typology.bedrooms : ''} {has(initial.properties, 'propertyType') ? initial.properties.propertyType : 'Property'}
                </span>
                <span className="address caption txtDark200">{has(initial.location, 'zip') ? initial.location.zip : ''} {has(initial.location, 'state') ? initial.location.state : ''}</span>
              </div>
            </div>
            <div className="actions dis-fl-row">
              <BrixelButtonIcon
                noBorder
                color="dark"
                saturationTxt={700}
                background="white"
                className="ml-1 bgWhite shadow-3dp"
                icon="close"
                onClick={(e) => closeFacts()}
              />
            </div>
          </div>
          <div className="transparency-container mb-3">
            <div className="dis-fl-col ta-l">
              {
                get(initial, 'Property') && (
                  <>
                    <BrixelProgressBar
                      rounded
                      small
                      saturation={700}
                      barBackground="Red"
                      backgroundSaturation={100}
                      progressValue={initial.Property.totalComplete || 0}
                    />
                    <div className="dis-f body txtPrimary700 pt-1">
                      <span className="mr-1 ff-mono">{initial.Property.totalComplete}%</span>
                      <span className="ff-mono">completed</span>
                    </div>
                  </>
                )
              }
            </div>
          </div>
        </div>

        <BrixelTabs
          className={`tabs mb-1-neg mr-3`}
          clicksList={[
            'facts',
            'media',
            'settings',
          ]}
          labels={[
            'Facts',
            'Media',
            'Publish',
          ]}
          activeTab={checkActiveTab()}
          onClick={(tab) => {
            history.push(`/${propID}/property/edit/${tab}`);
          }}
          fullWidth
        />

        <Switch>
          <Route path="/:propId?/:act/edit/facts" exact component={Facts} />
          <Route path="/:propId?/:act/edit/media" exact component={Media} />
          <Route path="/:propId?/:act/edit/settings" exact component={Settings} />
          <Route path="/:propId?/:act/edit/media/:imgId/:editType" exact component={DetailMedia} />
        </Switch>

      </div>
    </DrawerLayout>
  );
};

InputSheet.propTypes = {
  isLoading: PropTypes.bool,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  initial: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  singleUserPropertyList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setUserActiveProperty: PropTypes.func.isRequired,
  handleSaveProperty: PropTypes.func.isRequired,
  handleSetModal: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
  setNotification: PropTypes.func.isRequired,
  isUnsavedChangesModal: PropTypes.object,
};

InputSheet.defaultProps = {
  isUnsavedChangesModal: {},
  isLoading: false,
};

const InputSheetForm = reduxForm({
  // a unique name for the form
  form: 'Property',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(InputSheet);

const mapStateToProps = (state) => {
  const formValue = get(state, 'property.Property', {});
  if (formValue.price) {
    delete formValue.history;
    delete formValue.owner;
    delete formValue.price.history;
  }
  return ({
    errorValue: get(state, 'form.Property.syncErrors', {}),
    formValue: get(state, 'form.Property.values', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isIntLoading: get(state, 'common.isIntLoading', 0) > 0,
    activeSingleUser: get(state, 'user.activeSingleUser', {}),
    singleUserPropertyList: get(state, 'property.singleUserPropertyList', []),
    notification: get(state, 'common.notification', {}),
    initial: cloneDeep(get(state, 'property.property', {})),
    initialValues: {
      coverPhoto: get(state, 'property.property.coverPhoto', {}),
      id: get(state, 'property.property.id', null),
      description: get(state, 'property.property.description', {}),
      photos: cloneDeep(get(state, 'property.property.photos', [])),
      floorPlans: get(state, 'property.property.floorPlans', []),
      properties: get(state, 'property.property.properties', {}),
      location: get(state, 'property.property.location', {}),
      assessor: get(state, 'property.property.assessor', {}),
      inputSheet: get(state, 'property.property.inputSheet', {}),
      published: get(state, 'property.property.published', null),
      listed: get(state, 'property.property.listed', null),
      portals: get(state, 'property.property.portals', {}),
      stub: get(state, 'property.property.stub', null),
      language: get(state, 'property.property.language', null),
    },
    loggedInUser: get(state, 'user.loggedUser', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form) {
    (dispatch(reset(form)))
  },
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  handleDeleteDocument: bindActionCreators(deleteDocument, dispatch),
  // getUser: bindActionCreators(getActiveSingleUser, dispatch),
  setUserActiveProperty: bindActionCreators(getProperty, dispatch),
  handleSaveProperty: bindActionCreators(updateProperty, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  setNotification: bindActionCreators(setNotification, dispatch),
  // setPreventExit: bindActionCreators(preventExitFromScreen, dispatch),
  // setUnsavedModal: bindActionCreators(setUnsavedChangesModal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(InputSheetForm);
