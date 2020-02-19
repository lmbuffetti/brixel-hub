/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reduxForm, Field } from 'redux-form';
import get from 'lodash/get';
import { diff } from 'deep-object-diff';
import {
  BrixelButtonIcon, FactsOptions,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
  setModal, setNotification,
} from '../../actions/CommonActions';
import LoadingSimple from '../../components/LoadingSimple';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { uploadDocument, deleteDocument } from '../../actions/UploadActions';
import { InputSheets } from '../../resources/inputSheets';

// COMPONENTS
import Loading from '../../components/Loading';
// import { getActiveSingleUser } from '../../actions/UserActions';
import { updateProperty, getProperty } from '../../actions/PropertyActions';

const Maps = Loadable({
  loader: () => import('../../components/Map/Maps' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const InputSheet = (props) => {
  const {
    errorValue, isLoading, match, history, formValue, handleSaveProperty, getUser, reset,
    initialValues, loggedInUser, setUserActiveProperty, singleUserPropertyList, setPreventExit,
    handleSetModal, notification, setNotification,
  } = props;

  // STATE
  const [uploadFile, setUploadFile] = useState({});
  const [Questions, setQuestions] = useState([]);
  const propID = get(match, 'params.propID', null);

  useEffect(() => {
    const id = get(match, 'params.propId', null);
    if (id) {
      setUserActiveProperty({id})
    }
    setQuestions(InputSheets('en'))
  }, []);

  const saveData = () => {
    const data = {
      id: propID,
      data: formValue,
    };
    // For now we still dont use the diff object (TODO: API ticket)
    // diff(initialValues, formValue)

    handleSaveProperty(data);
  };

  const discardChanges = () => {
    reset('InputSheet');
  };

  const closeNotificationBar = () => {
    setNotification({ state: false });
  };

  useEffect(() => {
    if (Object.keys(diff(initialValues, formValue)).length > 0) {
      setNotification({
        state: true,
        type: 'info',
        label: 'You have unsaved changes',
        actions:
          [
            { type: 'primary', label: 'Save', func: () => saveData() },
            { type: 'secondary', label: 'Discard changes', func: () => discardChanges() },
          ],
      });
    } else if (Object.keys(diff(initialValues, formValue)).length === 0 && notification.type === 'success') {
      setTimeout(() => closeNotificationBar(), 2000);
    } else if (Object.keys(diff(initialValues, formValue)).length === 0 && notification.type === 'info') {
      setNotification({ state: false });
    }
  }, [formValue]);

  if (!formValue.id) {
    return (
      <Loading />
    );
  }

  const checkCondition = (val) => {
    let isToShow = true;
    if (val && val.condition) {
      const formCurVal = get(formValue, val.condition.name, null)
      if (val.condition.value !== formCurVal) isToShow = false;
    }
    return isToShow;
  };

  return (
    <>
      <div className="container dis-fl-col">

        <div className="manager-bar pt-md-5 pr-md-1 pb-md-0 pl-md-3 dis-fl-col shadow-1dp">

          <div className="actions mb-7 dis-fl-row jc-b">
            <div className="address-container dis-fl-row">
              <BrixelButtonIcon
                color="Dark"
                saturationTxt={700}
                icon="arrow-simple-left"
                className="shadow-3dp mr-2"
                background="White"
                noBorder
                onClick={() => history.push('../')}
              />
              <h3>Input Sheet</h3>
              <h6 className="ml-3">{formValue.location.address}</h6>
            </div>
          </div>
        </div>

        {
          Questions.map((quest, i) => (
            <div key={i.toString()}>
              <h2>{quest.title}</h2>
              {
                quest.inputs.map((input, f) => (
                  <>
                    {
                      checkCondition(input) && (
                        <div key={f.toString()}>
                          {console.log(input)}
                          {
                            input.type === 'Map' ? (
                              <>
                                <div className="mb-20 pos-r zIndex1">
                                  <Field
                                    name={input.name}
                                    label={input.label}
                                    component={() => (
                                      <Maps
                                        zoom={14}
                                        scrollZoom
                                        moveMarker
                                        draggable
                                        showSearchLocation
                                        showSelectCountry={true}
                                        showMap={true}
                                        isShowZip={false}
                                        className="w-perc-100"
                                      />
                                    )}
                                    options={input.options}
                                    validate={input.validation}
                                    type={input.type}
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="dis-f a-c jc-b">
                                <div
                                  className={`${input.classNameBox || ''} dis-f a-c jc-b w-perc-100`}
                                  tabIndex="-1"
                                >
                                  <Field
                                    className="w-perc-100"
                                    inputClassName={input.className || ''}
                                    name={input.name}
                                    label={input.label}
                                    icons={input.icons}
                                    component={input.component}
                                    fluid={true}
                                    options={input.options}
                                    validate={input.validation}
                                    type={input.type}
                                    step={+input.step}
                                    min={input.min}
                                    deactivable={false}
                                    placeholder={input.placeholder || ''}
                                    meta={{
                                      dirty: formValue[input.name] && errorValue[input.name] !== true,
                                      invalid: true,
                                    }}
                                    modal={input.modal ? {message: input.modal.hint, func: () => handleSetModal(input.modal.func)} : null }
                                    message={{
                                      help: null,
                                      error: errorValue[input.name],
                                    }}
                                    minLenghtNum={input.minLenghtNum || null}
                                    maxLengthNum={input.maxLenghtNum || null}
                                  />
                                  {
                                    input.unit && (
                                      <span className="pl-2">{input.unit}</span>
                                    )
                                  }
                                </div>
                              </div>
                            )
                          }
                          <p className="body2">{input.help}</p>
                        </div>
                      )
                    }
                  </>
                ))
              }
            </div>
          ))
        }
      </div>
    </>
  );
};

InputSheet.propTypes = {
  isLoading: PropTypes.bool,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
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
  form: 'InputSheet',
  enableReinitialize: true,
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
    activeSingleUser: get(state, 'user.activeSingleUser', {}),
    singleUserPropertyList: get(state, 'property.singleUserPropertyList', []),
    notification: get(state, 'common.notification', {}),
    initialValues: get(state, 'property.property', {}),
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
