/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonIcon, BrixelIcon, BrixelProgressBar } from '@brixel/brixel-components';
import MultiStepForm from '../../components/MultiStepReduxForm';
import { QuestionsList } from '../../resources/brixelComintTownPropertyQuestion';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { createActiveSingleProperty } from '../../actions/PropertyActions';
import { reduxForm, reset, Field, change } from 'redux-form';
import PageHeader from '../../components/PageHeader';
import last from 'lodash/last';
import { titleProperty } from '../../utils/titleCreation';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import queryString from 'query-string';
import { setCookie } from '../../utils/helpers';
import Cookies from 'universal-cookie';
import { getGamegroup } from '../../actions/GamificationActions';
import { setLanguage } from '../../actions/CommonActions';

const cookie = new Cookies();

const GetStarted = (props) => {
  // PROPS
  const {
    changeFieldValue,
    company,
    errorValue,
    formValue,
    lang,
    handleCreateActiveSingleProperty,
    handleGetActiveSingleCompany,
    handleSetLanguage,
    handleGetGamegroup,
    initialValue,
    startForm,
    history,
    match,
    reset,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(QuestionsList('en'));
  // const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState(QuestionsList('en')[0]);
  const [isEnter, setIsEnter] = useState(true);
  const [selGameGroup, setSelGameGroup] = useState({});
  const [finishedFlow, setFinishedFlow] = useState(false);
  const [lastID, setLastID] = useState(0);
  // GET URL PARAMS
  const getAchievement = () => last(history.location.pathname.split('/'));
  const propID = get(match, 'params.propId', null);

  useEffect(() => {
    // SET DEFAULT LOCATION FOR DEV
    if (baseByData.env === 'dev') {
      const location = {
        type: "stateCode",
        country: "Schweiz",
        countryCode: "CH",
        name: "Ernastrasse",
        vicinity: "Kreis 4",
        address: "Ernastrasse, 8004 Zürich, Schweiz",
        latitude: 47.3807432,
        longitude: 8.516775800000005,
        state: "Zürich",
        stateCode: "ZH",
        zip: 8004,
        city: "Zürich",
      };
      changeFieldValue('location', location);
    }
    // GET GAME GROUP TO POPULATE THE HOMEBASE SCREEN
    handleGetGamegroup();

    // GET THE COMPANY BY URL OR COOKIE
    const companyByUrl = queryString.parse(get(history, 'location.search', ''));
    const companyCookie = cookie.get('brixelStubCompany') || null;
    if (get(companyByUrl, 'company', companyCookie)) {
      const defComp = get(companyByUrl, 'company', companyCookie);
      handleGetActiveSingleCompany({stub: defComp});
      setCookie('brixelStubCompany', defComp);
    }
    const getCurrentUrl = last(history.location.pathname.split('/'));
    if (getCurrentUrl !== questions[0].history || get(companyByUrl, 'company', null)) history.push(`/packageFlow/getStarted/${questions[0].history}`);
    return () => {
      reset('GetStarted');
    };
  }, []);

  useEffect(() => {
    setIsEnter(true);
  }, [currentIndex]);

  const closeWindow = () => {
    reset('Property');
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      history.push(`/${propID}/rewards`);
    } else {
      history.push(`/${propID}/rewards/${getAchievement()}`);
    }
  };

  const saveData = () => {
    handleCreateActiveSingleProperty({stub: getAchievement()});
    reset('Property');
  };

  const changeStep = (act) => {
    setIsEnter(false);
    let newIndex = currentIndex;
    if (act === 'back') {
      newIndex -= 1;
    } else {
      newIndex += 1;
    }
    if (questions[newIndex].toSave) {
      saveData();
    }
    setCurrentIndex(newIndex);
    // setPosition(newIndex);
    setQuest(questions[newIndex]);
    if (questions[newIndex].history) {
      history.push(`/packageFlow/getStarted/${questions[newIndex].history}`);
    }
  };

  useEffect(() => {
    if (formValue) {
      let newQuest = [];
      QuestionsList('en').map((quest) => {
        if (quest.condition) {
          let isValid = true;
          quest.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false
            }
            return null;
          });
          if (isValid) newQuest.push(quest);
        } else {
          newQuest.push(quest);
        }
        return null;
      });
      setLastID(newQuest.length - 1);
      setQuestions(newQuest);
      const pageTitle = titleProperty(formValue.location, formValue.propertyType, lang, formValue);
      if (pageTitle)
        changeFieldValue('pageTitle', pageTitle);
    }
  }, [formValue]);

  useEffect(() => {
    const cookieLang = cookie.get('brixelLang');
    if (company.languageCode && !cookieLang) {
      handleSetLanguage(company.languageCode.toLowerCase());
      const compLang = company.languageCode.toLowerCase();
      setQuestions(QuestionsList(compLang, get(company, 'countryCode', 'CH')));
    }
  }, [company]);

  const valideConditionInput = (quest) => {
    let isVerified = true;
    if (quest.condition) {
      quest.condition.map((item) => {
        if (get(formValue, item.name, null) !== item.value) {
          isVerified = false;
        }
        return null;
      });
    }
    return isVerified;
  };

  const checkValidateField = (act) => {
    let isValid = true;
    let isNotEmpty = false;
    if (get(quest, 'inputs', null)) {
      quest.inputs.forEach((input) => {
        const err = get(errorValue, input.name, null);
        const noEmpty = get(formValue, input.name, 'ayc');
        if(noEmpty !== 'ayc') isNotEmpty = true;
        if (input.condition) {
          input.condition.forEach((item) => {
            if (get(formValue, item.name, null) === item.value) {
              if (err !== true && err !== false && isValid) isValid = false;
            }
          });
        } else if (input.validation) {
          //const getRegField = get(registeredFields
          if (input.name === 'owner') {
            const page = get(formValue, 'signupScreen', null);
            let field = ['email', 'firstName', 'lastName', 'privacy'];
            if (page === 'login') {
              field = ['email', 'password'];
            }
            field.forEach((item) => {
              const err = get(errorValue, item, null);
              if (err !== true && err !== false && isValid) isValid = false;
            })
          } else if (err !== true && err !== false && isValid) isValid = false;
        }
      });
    }
    if (quest.history === 'createProfile') {
      //console.log(quest);
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (currentIndex === questions.length - 1) label = 'Back to Hub';
    else if (currentIndex === 0) label = 'Next';
    else label = 'Next';
    return label;
  };

  return (
    <div id="bodyModalWrapper">
      {
        get(quest, `inputs`, null) && (
          <BrixelProgressBar
            large
            saturation={400}
            barBackground="Light"
            backgroundSaturation={300}
            progressValue={currentIndex * 5 / 100}
          />
        )
      }
      <div className="bodyModal">
        <form
          id="multiStepForm"
          // onSubmit={(e) => {e.preventDefault(); changeStep()}}
          autoComplete="off"
          className="dis-fl-col jc-b"
        >
          <div className={`slideMultiStepForm`}>
            <div
              className={`singleStep jc-c ${quest.background || ''} ${isEnter ? 'fade-enter-active' : 'fade-enter'}`}
            >
              <div className="subcontainer m-a">
                {
                  quest.inputs && (
                    <div>
                      {
                        quest.titleGreen && (
                          <h3 className="txtGreen400">{quest.titleGreen}</h3>
                        )
                      }
                      <h3 className={`${quest.subtitle ? 'mb-1' : 'mb-5'}`}>{quest.title}</h3>
                      {quest.subtitle && (
                        <p className="mb-5 txtDark200" dangerouslySetInnerHTML={{ __html: quest.subtitle }}/>)}
                      <Field component="input" type="hidden" name="initialize" />
                      {
                        quest.inputs.map((input, f) => (
                          <React.Fragment key={f.toString()}>
                            {
                              valideConditionInput(input) && (
                                <MultiStepForm
                                  formName="GetStarted"
                                  disableNextBtn={false}
                                  formValue={formValue}
                                  input={input}
                                  className={input.className}
                                  onClick={() => changeStep()}
                                />
                              )
                            }
                          </React.Fragment>
                        ))
                      }
                    </div>
                  )
                }
                {
                  get(quest, 'cardType', null) === 'loadComponent' && (
                    React.createElement(
                      quest.component,
                      {
                        formName: 'GetStarted',
                        finishedFlow,
                        initialValue: formValue,
                        ...quest
                      }
                    )
                  )
                }
                {
                  (get(quest, 'cardType', null) === 'card') && (
                    <div className="scaleAnim ta-c">
                      <img src={quest.img} alt={quest.title} className="max-w-fix-232 mb-5" />
                      <h5
                        className="fadeAnim mt-2 ta-c"
                        dangerouslySetInnerHTML={{ __html: quest.title}}
                      />
                      {
                        quest.subtitle && (
                          <h6
                            className="fadeAnim mt-2 ta-c"
                            dangerouslySetInnerHTML={{ __html: quest.subtitle}}
                          />
                        )
                      }
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <div
            className={`footerAction p-1 p-md-2 shadow-1dp-top ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
          >
            <div className="container pos-r">
              <div className={`w-perc-100 a-c dis-fl-row jc-b m-a ${currentIndex === lastID ? 'jc-c' : 'jc-b'}`}>
                {
                  questions[currentIndex] && questions[currentIndex].inputs && (
                    <BrixelButtonIcon
                      className={`shadow-2dp backBtn ${currentIndex === 0 ? 'hide' : ''}`}
                      icon="arrow-simple-left"
                      onClick={() => changeStep('back')}
                      background="white"
                      saturation={0}
                      color="primary"
                      saturationTxt={400}
                      noBorder
                    />
                  )
                }
                {
                  checkValidateField() && quest.successMessage && (
                    <div className="txtGreen700 ta-r ml-a pr-1 textSuccess">
                      {quest.successMessage}
                      <BrixelIcon icon="check" className="ml-1" />
                    </div>
                  )
                }
                <BrixelButtonPrimary
                  className={`noWrap w-perc-100 max-w-fix-160 ${currentIndex === 0 && !checkValidateField() ? 'ml-a' : ''}`}
                  disabled={!checkValidateField()}
                  rounded
                  background="primary"
                  saturation={400}
                  label={buttonLabel()}
                  rightIcon="arrow-right-small"
                  onClick={() => questions[currentIndex + 1] ? changeStep() : closeWindow()}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
};

GetStarted.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  registeredFields: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleCreateActiveSingleProperty: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  match: PropTypes.object.isRequired,
  packagesProperty: PropTypes.arrayOf(PropTypes.object).isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', null),
  company: get(state, 'companies.activeSingleCompany', {}),
  errorValue: get(state, 'form.GetStarted.syncErrors', {}),
  formValue: get(state, 'form.GetStarted.values', {}),
  startForm: get(state, 'form.GetStarted', null),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  lang: get(state, 'common.language', 'en'),
  packagesProperty: get(state, 'property.packagesProperty', []),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('GetStarted', field, value));
  },
  reset(form) {
    (dispatch(reset(form)))
  },
  handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
  handleGetGamegroup: bindActionCreators(getGamegroup, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
  handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
});

const AnyForm = reduxForm({
  form: 'GetStarted',
  enableReinitialize: true,
})(GetStarted)

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AnyForm);
