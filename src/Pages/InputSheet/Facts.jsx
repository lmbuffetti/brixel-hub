/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reduxForm, Field } from 'redux-form';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import { diff } from 'deep-object-diff';
import {
  BrixelButtonIcon,
  BrixelIcon,
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
import { InputSheets } from '../../resources/inputSheets';
import { getCalcSectionInputSheets } from '../../utils/helpers';


// COMPONENTS
import Loading from '../../components/Loading';
import { updateProperty, getProperty } from '../../actions/PropertyActions';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import noCover from '../../images/no_cover.jpg';

const Maps = Loadable({
  loader: () => import('../../components/Map/Maps' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const DrawerLayout = Loadable({
  loader: () => import('../../components/DrawerLayout' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const InputSheet = (props) => {
  const {
    errorValue,
    formValue,
    handleSaveProperty,
    handleSetModal,
    history,
    initial,
    initialValues,
    isIntLoading,
    match,
    notification,
    reset,
    setNotification,
    setUserActiveProperty,
  } = props;

  // STATE
  const [Questions, setQuestions] = useState([]);
  const [accordion, setAccordion] = useState({});
  const [accordionAnimatad, setAccordionAnimatad] = useState({});
  const [skipSection, setSkipSection] = useState(get(initialValues, 'inputSheet.skipSection', {}));
  const [sectionProgress, setSectionProgress] = useState({});
  const [selObj, setSelObj] = useState(null);

  const propID = get(match, 'params.propId', null);

  useEffect(() => {
    if (propID) {
      //setUserActiveProperty({ id: propID })
    }
    setQuestions(InputSheets('en'));
  }, []);

  // FUNCTION ON CLICK TO ENABLE/DISABLE QUESTION GROUP
  const handleSkipSection = async (key) => {
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
    setSelObj(key);
    await handleSaveProperty({id: propID, inputSheet: data, smallLoader: true});
  };

  // FUNCTION TO LOAD DIFFERENT CHACKMAR IF GROUP IS COMPLETE, UNCOMPLETE, DISABLE
  const checkQuestionGroup = (quest, skipped) => {
    if (sectionProgress && sectionProgress.sectionComplete && sectionProgress.sectionComplete[quest.history]) {
      return (
        <div>
          <BrixelIcon
            className="brdSmall dis-b border-green"
            icon="check"
            rounded
            background="green"
            saturation={400}
            color="white"
            saturationTxt={0}
            iconSize="small"
            padding="p-small-7"
          />
        </div>
      )
    } else {
      return (
        <div>
          <BrixelButtonIcon
            icon="check"
            rounded
            bgTransparent={skipped[quest.history] ? false : true}
            background={skipped[quest.history] ? 'primary' : ''}
            saturation={skipped[quest.history] ? 300 : 0}
            noBorder={skipped[quest.history]}
            color={skipped[quest.history] ? "white" : "dark"}
            saturationTxt={skipped[quest.history] ? 0 : 400}
            className={`brdSmall dis-b p-small-4 ${skipped[quest.history] ? 'border-primary' : ''}`}
            iconSize="small"
            onClick={() => handleSkipSection(quest.history)}
            isLoading={isIntLoading && quest.history === selObj}
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
    const dataToSend = formValue;
    delete dataToSend.owner;
    const data = {
      id: propID,
      ...dataToSend,
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
      console.log(getData, formValue);
      setAccordion({...getData.accordion});
      setAccordionAnimatad({...getData.accordion});
      setSectionProgress({...getData.section});
      setSkipSection(initialValues.inputSheet.skipSection);
    }
  }, [errorValue]);

  useEffect(() => {
    // SET NOTIFICATION AND CHECK IF VALUES ARE CHANGED
    if (Object.keys(diff(initial, formValue)).length > 0) {
      let setValid = true;
      if (Questions) {
        Questions.map((input) => {
          input.inputs.map((inp) => {
            const curVal = get(errorValue, inp.name, true);
            if (curVal !== true && curVal !== 'Mark Required') {
              console.log(inp.name, curVal);
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
    } else if (Object.keys(diff(initial, formValue)).length === 0 && notification.type === 'success') {
      setTimeout(() => closeNotificationBar(), 2000);
    // REMOVE NOTIFICATION
    } else if (Object.keys(diff(initial, formValue)).length === 0 && notification.type === 'info') {
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

  const closeFacts = () => {
    closeNotificationBar()
    history.push(`/${propID}/property`);
  };

  return (
    <DrawerLayout className="factSection" classNameDrawer="ov-a">
      <div className="container dis-fl-col mt-2">
        <div className="property-info-container">
          <div className="header-section dis-fl-row a-c jc-b mb-2">
            <div className="dis-fl-row">
              <div className="avatar w-fix-48 brdCircle h-fix-48 a-c jc-c">
                {
                  initialValues.coverPhoto && initialValues.coverPhoto.path ? (
                    <img className="avatar w-fix-48 h-fix-48 brdRadius pos-r" src={`${getConfigEnv.shortPath}${initialValues.coverPhoto.path}`} alt="Brixel Logo" id="avatar" />
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
          <div className="transparency-container mb-2">
            <div className="dis-fl-col ta-l">
              {
                get(initialValues, 'inputSheet') && (
                  <>
                    <BrixelProgressBar
                      rounded
                      large
                      saturation={700}
                      barBackground="Red"
                      backgroundSaturation={100}
                      progressValue={sectionProgress.percComplete || 0}
                    />
                    <div className="dis-f fSizePx12 ff-mono txtPrimary700 pt-1">
                      <span className="mr-1">{sectionProgress.percComplete}%</span>
                      <span className="">completed</span>
                    </div>
                  </>
                )
              }
            </div>
          </div>
        </div>


        <div className="dis-f a-c my-2 jc-b body2 txtDark200">
          <span>Expand all</span>
          <span>All tasks</span>
        </div>

        {
          Questions.map((quest, i) => (
            <div
              className={`accordWrap ${accordion[quest.history] ? 'openedAccord' : 'closedAccord'}`}
              key={i.toString()}
            >
              {
                quest.group && (
                  <span className="accordGroup fweight-600 dis-b pt-3 pb-1 txtDark700 px-1 px-md-0">
                    {quest.group || ''}
                  </span>
                )
              }
              <div className="accordControl dis-f a-c jc-b pl-1 pr-1 pl-md-0 pr-md-0">
                <div
                  className="accordTitle dis-f a-c cur-poi pt-2 pb-2"
                  onClick={() => toggleAccordion(quest)}
                >
                  <BrixelIcon
                    icon={accordion[quest.history] ? "minus" : "plus"}
                    color="dark"
                    saturationTxt={accordion[quest.history] ? 400 : 200}
                    iconSize="small"
                    className={`ml-1`}
                  />
                  <h4 className={`body ml-1 ${accordion[quest.history] ? "txtDark400 fweight-500" : "txtDark200"}`}>
                    {quest.title}
                  </h4>
                </div>
                {checkQuestionGroup(quest, skipSection)}
              </div>
              {
                accordion[quest.history] && (
                  <div key={i.toString()} className="accrodContent">
                    {
                      quest.inputs.map((input, f) => (
                        <div className="singleInput" key={f.toString()}>
                          {
                            checkCondition(input) && (typeof accordion[quest.history] !== 'undefined' ? accordion[quest.history] : accordionAnimatad[quest.history]) && (
                              <div className="pb-2" key={f.toString()}>
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
                                        className={`${input.classNameBox || ''} dis-fl-col w-perc-100`}
                                        tabIndex="-1"
                                      >
                                        {input.deactivable ? input.deactivable.toString() : ''}
                                        <Field
                                          className={input.className || ''}
                                          inputClassName={input.inputClassName || ''}
                                          isHorizontal={input.isHorizontal}
                                          name={input.name}
                                          label={input.label}
                                          icons={input.icons}
                                          component={input.component}
                                          fluid={false}
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
                                          unit={input.unit}
                                        />
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
                )
              }
            </div>
          ))
        }
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
