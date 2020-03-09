/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { change, reset, Field } from 'redux-form';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  BrixelButtonIcon,
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
import { updateProperty } from '../../actions/PropertyActions';

const Maps = Loadable({
  loader: () => import('../../components/Map/Maps' /* webpackChunkName: "Maps" */),
  loading: LoadingSimple,
});

const InputSheet = (props) => {
  const {
    changeFieldValue,
    errorValue,
    formValue,
    handleSaveProperty,
    handleSetModal,
    initial,
    isIntLoading,
    match,
  } = props;

  // STATE
  const [Questions] = useState(InputSheets('en'));
  const [accordion, setAccordion] = useState({});
  const [accordionAnimatad, setAccordionAnimatad] = useState({});
  const [skipSection, setSkipSection] = useState(get(initial, 'inputSheet.skipSection', {}));
  const [sectionProgress, setSectionProgress] = useState({});
  const [selObj, setSelObj] = useState(null);

  useEffect(() => {
    if (initial.inputSheet) setSkipSection(get(initial, 'inputSheet.skipSection', {}));
  }, [initial]);

  const propID = get(match, 'params.propId', null);

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
    changeFieldValue('inputSheet', data);
    await handleSaveProperty({id: propID, inputSheet: data, smallLoader: true});
  };

  // FUNCTION TO LOAD DIFFERENT CHACKMAR IF GROUP IS COMPLETE, UNCOMPLETE, DISABLE
  const checkQuestionGroup = (quest, skipped = {}) => {
    console.log(sectionProgress);
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
            bgTransparent={!skipped[quest.history]}
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

  useEffect(() => {
    //
    console.log(formValue)
    if (formValue.id) {
      const getData = getCalcSectionInputSheets(Questions, formValue, accordion,null, null);
      console.log(getData);
      setAccordion({...getData.accordion});
      setAccordionAnimatad({...getData.accordion});
      setSectionProgress({...getData.section});
    }
  }, [errorValue]);

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
    <div className="pb-10">

      <div className="dis-f a-c my-2 jc-b body2 txtDark200 px-2">
        <span>Expand all</span>
        <span>All tasks</span>
      </div>

      {
        Questions.map((quest, i) => (
          <div
            className={`accordWrap px-0 px-md-2 ${accordion[quest.history] ? 'openedAccord' : 'closedAccord'}`}
            key={i.toString()}
          >
            {
              quest.group && (
                <span className="accordGroup fweight-600 dis-b pt-3 pb-1 txtDark700 px-2 px-md-0">
                  {quest.group || ''}
                </span>
              )
            }
            <div className="accordControl dis-f a-c jc-b pl-1 pr-1 pl-md-0">
              <div
                className="accordTitle dis-f a-c cur-poi pt-2 pb-2"
                onClick={() => toggleAccordion(quest)}
              >
                <BrixelIcon
                  icon={accordion[quest.history] ? "minus" : "plus"}
                  color="dark"
                  saturationTxt={accordion[quest.history] ? 400 : 200}
                  iconSize="small"
                  className="ml-1"
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
                                        modal={input.modal ? {message: input.modal.func.hint, func: () => handleSetModal(input.modal.func)} : null }
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
  );
};

InputSheet.propTypes = {
  isLoading: PropTypes.bool,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  initial: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  singleUserPropertyList: PropTypes.arrayOf(PropTypes.object).isRequired,
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

const mapStateToProps = (state) => {
  const formValue = get(state, 'property.singleUserActiveProperty', {});
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
    initial: get(state, 'form.Property.initial', {}),
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
  handleSaveProperty: bindActionCreators(updateProperty, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  setNotification: bindActionCreators(setNotification, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(InputSheet);
