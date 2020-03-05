/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React  from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reduxForm } from 'redux-form';
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

const DrawerLayout = Loadable({
  loader: () => import('../../components/DrawerLayout' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const Facts = Loadable({
  loader: () => import('./Facts' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const Media = Loadable({
  loader: () => import('./Media' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const Settings = Loadable({
  loader: () => import('./Settings' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const InputSheet = (props) => {
  const {
    formValue,
    history,
    initialValues,
    match,
    setNotification,
  } = props;

  // URL PARAMS
  const propID = get(match, 'params.propId', null);
  const checkActiveTab = () => last(history.location.pathname.split('/'));

  const closeNotificationBar = () => {
    setNotification({ state: false });
  };

  if (!formValue.id) {
    return (
      <Loading />
    );
  }

  const closeFacts = () => {
    closeNotificationBar()
    history.push(`/${propID}/property`);
  };

  return (
    <DrawerLayout classNameDrawer="ov-a">
      <div className="dis-fl-col mt-2">
        <div className="property-info-container px-2">
          <div className="header-section dis-fl-row a-c jc-b mb-2">
            <div className="dis-fl-row">
              <div className="avatar w-fix-48 brdCircle h-fix-48 a-c jc-c">
                {
                  initialValues.coverPhoto && initialValues.coverPhoto.path ? (
                    <img className="avatar w-fix-48 h-fix-48 brdRadius pos-r" src={`${getConfigEnv.shortPath}${initialValues.coverPhoto.thumbnailPath}`} alt="Brixel Logo" id="avatar" />
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
                  {(has(initialValues.properties, 'typology') && has(initialValues.properties.typology, 'bedrooms')) ? initialValues.properties.typology.bedrooms : ''} {has(initialValues.properties, 'propertyType') ? initialValues.properties.propertyType : 'Property'}
                </span>
                <span className="address caption txtDark200">{has(initialValues.location, 'zip') ? initialValues.location.zip : ''} {has(initialValues.location, 'state') ? initialValues.location.state : ''}</span>
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
                get(initialValues, 'inputSheet') && (
                  <>
                    <BrixelProgressBar
                      rounded
                      small
                      saturation={700}
                      barBackground="Red"
                      backgroundSaturation={100}
                      progressValue={initialValues.inputSheet.totalComplete || 0}
                    />
                    <div className="dis-f body txtPrimary700 pt-1">
                      <span className="mr-1 ff-mono">{initialValues.inputSheet.totalComplete}%</span>
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
            history.push(`/${propID}/property/${tab}`);
          }}
          fullWidth
        />

        <Switch>
          <Route path="/:propId?/:act/facts" exact component={Facts} />
          <Route path="/:propId?/:act/media" exact component={Media} />
          <Route path="/:propId?/:act/settings" exact component={Settings} />
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
  initialValues: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  initial: PropTypes.object.isRequired,
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
  form: 'InputSheet',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(InputSheet);

const mapStateToProps = (state) => {
  const formValue = get(state, 'property.singleUserActiveProperty', {});
  if (formValue.price) {
    delete formValue.history;
    delete formValue.owner;
    delete formValue.price.history;
  }
  return ({
    errorValue: get(state, 'form.InputSheet.syncErrors', {}),
    formValue: get(state, 'form.InputSheet.values', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isIntLoading: get(state, 'common.isIntLoading', 0) > 0,
    activeSingleUser: get(state, 'user.activeSingleUser', {}),
    singleUserPropertyList: get(state, 'property.singleUserPropertyList', []),
    notification: get(state, 'common.notification', {}),
    initial: get(state, 'form.InputSheet.initial', {}),
    initialValues: cloneDeep(get(state, 'property.property', {})),
    loggedInUser: get(state, 'user.loggedUser', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('InputSheet', field, value));
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
