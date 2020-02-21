/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reduxForm, Field } from 'redux-form';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { diff } from 'deep-object-diff';
import {
  BrixelIcon,
} from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import {
  setModal, setNotification,
} from '../../actions/CommonActions';
import LoadingSimple from '../../components/LoadingSimple';
import { uploadDocument, deleteDocument } from '../../actions/UploadActions';
import { InputSheets } from '../../resources/inputSheets';
import { getCalcSectionInputSheets } from '../../utils/helpers';

// COMPONENTS
import Loading from '../../components/Loading';
import { updateProperty, getProperty } from '../../actions/PropertyActions';

const Maps = Loadable({
  loader: () => import('../../components/Map/Maps' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const InputSheet = (props) => {
  const {
    errorValue, match, formValue, handleSaveProperty, reset,
    initialValues, setUserActiveProperty,
    handleSetModal, notification, setNotification,
  } = props;

  // STATE
  const [Questions, setQuestions] = useState([]);
  const [accordion, setAccordion] = useState({});
  const [accordionAnimatad, setAccordionAnimatad] = useState({});
  const [skipSection, setSkipSection] = useState(get(initialValues, 'inputSheet.skipSection', {}));
  const [sectionProgress, setSectionProgress] = useState({});

  const propID = get(match, 'params.propID', null);

  useEffect(() => {
    const id = get(match, 'params.propId', null);
    if (id) {
      setUserActiveProperty({ id })
    }
    setQuestions(InputSheets('en'));
  }, []);

  // FUNCTION ON CLICK TO ENABLE/DISABLE QUESTION GROUP
  const handleSkipSection = async (key) => {
    const id = get(match, 'params.propId', null);
    const newSkipSection = skipSection;
    newSkipSection[key] = !newSkipSection[key];
    setSkipSection({...newSkipSection});
    setSectionProgress({
      ...sectionProgress,
      section: newSkipSection,
    });

    const data = {
      skipSection: newSkipSection,
      totalComplete: getCalcSectionInputSheets(Questions, formValue, accordion, 'getPercentage', newSkipSection),
    };
    const getData = getCalcSectionInputSheets(Questions, formValue, accordion, null, newSkipSection);
    setSectionProgress({...getData.accordion});
    setSectionProgress({...getData.section});
    await handleSaveProperty({id, inputSheet: data});
  };

  // FUNCTION TO LOAD DIFFERENT CHACKMAR IF GROUP IS COMPLETE, UNCOMPLETE, DISABLE
  const checkQuestionGroup = (quest, skipped) => {
    if (sectionProgress && sectionProgress.sectionComplete && sectionProgress.sectionComplete[quest.history]) {
      return (
        <div>
          <BrixelIcon
            className="dis-b p-small-4"
            icon="check"
            rounded
            background="green"
            saturation={400}
            color="white"
            saturationTxt={0}
            iconSize="small"
            padding="p-small-4"
          />
        </div>
      )
    } else {
      return (
        <div>
          <BrixelIcon
            icon="check"
            rounded
            bgTransparent={skipped[quest.history]}
            background={skipped[quest.history] ? 'primary' : ''}
            saturation={skipped[quest.history] ? 300 : 0}
            noBorder={skipped[quest.history]}
            color={skipped[quest.history] ? "white" : "dark"}
            saturationTxt={skipped[quest.history] ? 0 : 400}
            className="brdSmall dis-b p-small-4"
            iconSize="small"
            padding="p-small-4"
            onClick={() => handleSkipSection(quest.history)}
          />
        </div>
      )
    }
  };

  const discardChanges = () => {
    reset('InputSheet');
  };

  const closeNotificationBar = () => {
    setNotification({ state: false });
  };

  const saveData = async () => {
    const data = {
      id: propID,
      data: formValue,
    };
    // For now we still dont use the diff object (TODO: API ticket)
    // diff(initialValues, formValue)
    const dataInputSheet = {
      skipSection: skipSection,
      totalComplete: getCalcSectionInputSheets(Questions, formValue, accordion,'getPercentage', null),
    };

    await handleSaveProperty({id: propID, inputSheet: dataInputSheet});
    await handleSaveProperty(data);
  };

  useEffect(() => {
    //
    if (formValue.id) {
      const getData = getCalcSectionInputSheets(Questions, formValue, accordion,null, null);
      setAccordion({...getData.accordion});
      setAccordionAnimatad({...getData.accordion});
      setSectionProgress({...getData.section});
      setSkipSection(initialValues.inputSheet.skipSection);
    }
  }, [initialValues]);

  useEffect(() => {
    // SET NOTIFICATION AND CHECK IF VALUES ARE CHANGED
    if (Object.keys(diff(initialValues, formValue)).length > 0) {
      let setValid = true;
      if (Questions) {
        Questions.map((input) => {
          input.inputs.map((inp) => {
            const curVal = get(errorValue, inp.name, true);
            if (curVal !== true && curVal !== 'Mark Required') setValid = false;
            return null;
          });
          return null;
        });
      }
      if (setValid) {
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
  }, [errorValue]);

  if (!formValue.id) {
    return (
      <Loading />
    );
  }

  const checkCondition = (val) => {
    let isToShow = true;
    if (val && val.condition) {
      const formCurVal = get(formValue, val.condition.name, null);
      if (val.condition.value === 'isPositive') isToShow = formCurVal > 0;
      else if (val.condition.value !== formCurVal) isToShow = false;
    }
    return isToShow;
  };

  const getCalcPerc = () => {
    const getData = getCalcSectionInputSheets(Questions, formValue, accordion,null, null);
    setSectionProgress({...getData.accordion});
    setSectionProgress({...getData.section});
  };

  const toggleAccordion = (quest) => {
    setAccordion({ ...accordion, [quest.history]: !accordion[quest.history] });
    setAccordionAnimatad({ ...accordion, [quest.history]: true });

    setTimeout(() => setAccordionAnimatad({ ...accordionAnimatad, [quest.history]: !accordion[quest.history] }), 1000, );
  };

  return (
    <>
      <div className="container dis-fl-col">
        <div className="progressInfo dis-f a-c my-3 jc-b">
          <h6>All tasks</h6>
          {
            sectionProgress && (
              <span className="txtPrimary700">{sectionProgress.percComplete} %</span>
            )
          }
        </div>

        {
          Questions.map((quest, i) => (
            <div className="accordionWrap" key={i.toString()}>
              <div className="dis-f a-c jc-b">
                <div className="dis-f a-c">
                  {checkQuestionGroup(quest, skipSection)}
                  <h4
                    className="ml-2 txtDark200 body2 cur-poi"
                    onClick={() => toggleAccordion(quest)}
                  >
                    {quest.title}
                  </h4>
                </div>
                <BrixelIcon
                  icon={accordion[quest.history] ? "arrow-simple-up" : "arrow-simple-down"}
                  color="dark"
                  saturationTxt={700}
                  iconSize="small"
                  onClick={() => toggleAccordion(quest)}
                />
              </div>
              <div key={i.toString()} className={`accrodionList ${accordion[quest.history] ? 'openAccordion' : 'closedAccordion'}`}>
                {
                  quest.inputs.map((input, f) => (
                    <div key={f.toString()}>
                      {
                        checkCondition(input) && (typeof accordion[quest.history] !== 'undefined' ? accordion[quest.history] : accordionAnimatad[quest.history]) && (
                          <div key={f.toString()}>
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
                                    {input.deactivable ? input.deactivable.toString() : ''}
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
                                      deactivable={typeof input.deactivable !== 'undefined' ? input.deactivable : true}
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
                                      onBlur={() => getCalcPerc()}
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
                    </div>
                  ))
                }
              </div>
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
