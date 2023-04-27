import React, {useEffect, useRef, useState} from 'react';
import {BrixelButtonText, BrixelButtonIcon, BrixelButtonPrimary, BrixelProgressBar} from '@brixel/brixel-components';
import {destroy, MultiFileldsReduxForm, reset} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import has from 'lodash/has';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {spinnerOff, spinnerOn} from '../actions/CommonActions';
import {checkBrowser, redirectUrl} from '../utils/helpers';
import translateTo from '../utils/translation';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';
import type {FlowScreenType} from '../@types/components/FlowScreen';

const FlowScreen = (props: FlowScreenType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    baseURL,
    company,
    closeLink,
    destroyForm,
    errorValue,
    formName,
    formValue,
    handleReset,
    handleSpinnerOff,
    initialValues,
    isSmallLoading,
    lang = 'en',
    onChangeCurrentIndex = () => '',
    onSaveData,
    QuestionsList,
  } = props;
  // STATE
  // SET THE QUESTIONS IN BASE OF THE COUNTRY
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [oldIndex, setOldIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const [action, setAction] = useState('next');
  // SET QUEST TO FIRST QUESTION OF QuestionsList()
  const [quest, setQuest] = useState<QuestionsListType>(QuestionsList[0]);
  // const [roomValue, setRoomValue] = useState('');
  // GET URL PARAMS
  const propID = get(match, 'propID', null);

  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  // DESTROY FORM ON EXIT
  useEffect(() => {
    handleSpinnerOff();
    return () => destroyForm(formName);
  }, []);

  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    let newIndex: number = id;
    if (questions[newIndex] && questions[newIndex].conditions) {
      let checkCond = true;
      const {conditions} = questions[newIndex];
      if (conditions) {
        conditions.map((cond) => {
          if (cond.name) {
            const val = get(formValue, cond.name, null);
            if (has(cond, 'value') && val !== cond.value && checkCond) {
              if (act === 'back') newIndex -= 1;
              else newIndex += 1;
              checkCond = false;
            }
          }
          return null;
        });
      }
    }
    return newIndex;
  };

  // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
  const checkValidateField = (act = '') => {
    let isValid = true;
    let isNotEmpty = false;
    if (quest?.inputs) {
      quest.inputs.forEach((input) => {
        if (input.name) {
          const err = get(errorValue, input.name, null);
          const noEmpty = get(formValue, input.name, 'ayc');
          if (noEmpty !== 'ayc') isNotEmpty = true;
          if (input.condition) {
            input.condition.forEach((item) => {
              if (item.value && get(formValue, item.name, null) === item.value) {
                if (err !== true && err !== false && isValid) isValid = false;
              }
              if (item.noValue && get(formValue, item.name, null) !== item.noValue) {
                if (err !== true && err !== false && isValid) isValid = false;
              }
            });
          } else if (input.validation) {
            // const getRegField = get(registeredFields
            let field;
            if (input.name === 'profile') {
              const page = get(formValue, 'signupScreen', null);
              field = ['register.email', 'register.firstName', 'register.lastName', 'register.password', 'register.privacy'];
              if (page === 'login') {
                field = ['login.email', 'login.password'];
              }
              field.forEach((item) => {
                const errCurr = get(errorValue, item, true);
                if (errCurr !== true && errCurr !== false && isValid) isValid = false;
              });
            }
            if (input.name === 'register.ownerType') {
              if (!has(formValue, 'register.ownerType') || get(formValue, 'register.ownerType', '') === null) isValid = false;
            }
            if (input.name === 'register.whenToSell') {
              if (!has(formValue, 'register.whenToSell') || get(formValue, 'register.whenToSell', '') === null) isValid = false;
            } else if (err !== true && err !== false && err !== null && isValid) isValid = false;
          }
        }
      });
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  const singleStepEl = singleStepRef.current;
  const multiStepSlidesEl = multiStepSlidesRef.current;

  // FUNCTION TO GO TO NEXT STEP
  const changeStep = (act = 'next', e: null | React.FormEvent = null, step = 1, skipValidation = false) => {
    if (e) e.preventDefault();
    const newQuestions = questions;
    let newIndex = currentIndex;
    setOldIndex(currentIndex);
    setShowError(false);
    setAction(act);
    if (act === 'back') {
      newIndex -= step;
    } else {
      if (!checkValidateField() && !skipValidation) {
        setShowError(true);
        return false;
      }
      newIndex += step;
    }
    if (newIndex === -1 && history.location.pathname.includes('packageFlow')) {
      history.push(`/packageFlow/${company.stub}`);
    } else {
      let defId = checkCondition(newIndex, act);
      if (defId !== newIndex) defId = checkCondition(defId, act);
      if (newQuestions[defId]) {
        if (newQuestions[defId].toSave) {
          const actTerms = history.location.pathname.includes('termsConditionFlow') ? 'accept' : '';
          onSaveData(actTerms);
        } else {
          const newQuest = {
            ...newQuestions[defId],
          };
          setCurrentIndex(defId);
          if (newQuest.history !== 'createProfile') {
            if (newQuest.inputs && !newQuest.inputs[0].options && !newQuest.inputs[0].startFrom) {
              const fakeInput = document.createElement('input');
              fakeInput.setAttribute('type', 'text');
              fakeInput.setAttribute('id', 'fakeInput');
              fakeInput.style.position = 'absolute';
              fakeInput.style.opacity = '0';
              fakeInput.style.height = '0';
              fakeInput.style.fontSize = '16px'; // disable auto zoom
              // zoom/scroll behavior
              document.body.prepend(fakeInput);
              fakeInput.focus();
            }

            setTimeout(() => {
              const fakeInput = document.getElementById('fakeInput');
              const getCurStep = document.getElementById(`step-${defId}`);
              if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
                const inputNumber = getCurStep.querySelector('input[type="number"]') as HTMLInputElement;
                if (inputNumber) inputNumber.focus();
              } else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
                const inputText = getCurStep.querySelector('input[type="text"]') as HTMLInputElement;
                if (inputText) inputText.focus();
              } else if (getCurStep && getCurStep.querySelector('input[type="search"]')) {
                const inputSearch = getCurStep.querySelector('input[type="search"]') as HTMLInputElement;
                if (inputSearch) inputSearch.focus();
              }
              // cleanup
              if (fakeInput) fakeInput.remove();
            }, 500);
          }
          if (newQuestions[defId].history) {
            history.push(`${baseURL}/${newQuestions[defId].history}`, { state: get(history, 'location.state', {}) });
          }
          if (checkBrowser() > 0) {
            //@ts-ignore
            if (singleStepEl && singleStepEl.scrollTop) singleStepEl.scrollTop = 0;
            //@ts-ignore
            if (multiStepSlidesEl && multiStepSlidesEl.scrollTop) multiStepSlidesEl.scrollTop = 0;
          } else {
            //@ts-ignore
            if (singleStepEl && typeof singleStepEl.scrollTo === 'function') singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
            //@ts-ignore
            if (multiStepSlidesEl && typeof multiStepSlidesEl.scrollTo === 'function') multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    }
    return null;
  };

  // ON CHANGE VALUE RE-CALC THE PERCENTAGE OF FACTS
  useEffect(() => {
    setOldIndex(currentIndex);
    if (company.stub) {
      const newQuest = questions;
      if (
        (newQuest[currentIndex]?.inputs || []).length === 1 &&
        get(newQuest[currentIndex], 'inputs[0].options', []).length > 0 &&
        get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), null) &&
        typeof get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), '') === 'string' &&
        !get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), '').toLowerCase().includes('other') && !history.location.pathname.includes('termsConditionFlow') && oldIndex <= currentIndex
      ) {
        changeStep('next', null, 1, true);
      }
    }
  }, [get(formValue, get(questions, `[${currentIndex}].inputs[0].name`, ''), null)]);

  useEffect(() => {
    setQuest(questions[currentIndex]);
    onChangeCurrentIndex(currentIndex);
  }, [currentIndex, questions, lang]);

  // MOVE STEP FORWARD AFTER SAVING
  useEffect(() => {
    if (isSmallLoading.sendData === true && questions[currentIndex + 1]) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setQuest(questions[newIndex]);
    }
  }, [isSmallLoading]);


  // FUNCTION TO CLOSE
  const closeWindow = () => {
    handleReset(formName, initialValues);
    const linkToRedirect = redirectUrl(history.location.pathname, {propID});
    history.push(linkToRedirect);
  };

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    const newQuest: QuestionsListType[] = [];
    QuestionsList.map((qst) => {
      if (qst.condition) {
        let isValid = true;
        qst.condition.map((item) => {
          if (item.name && get(formValue, item.name, null) !== item.value) {
            isValid = false;
          }
          return null;
        });
        if (isValid && !qst.hideOnFlow) newQuest.push(qst);
      } else {
        if (!qst.hideOnFlow) newQuest.push(qst);
      }
      return null;
    });
    setQuestions(newQuest);
  }, [formValue, QuestionsList, lang]);

  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    const inputName = get(quest, 'inputs[0].name', null);
    if (get(questions, `[${currentIndex}].btnLabel`, null)) label = get(questions, `[${currentIndex}].btnLabel`, null);
    else if (get(questions, `[${currentIndex + 1}].toSave`, null)) label = 'Save';
    else if (inputName && get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null) label = 'Skip';
    else label = 'Next';
    return label;
  };

  const progressBarCalc = () => {
    let num = 0;
    questions.forEach((item) => {
      if (get(item, 'hideProgress', false) !== true) {
        if (item.conditions) {
          item.conditions.forEach((cond) => {
            if (cond.name) {
              const val = get(formValue, cond.name, null);
              if (has(cond, 'value') && val === cond.value) {
                num += 1;
              } else if (cond.noValue && val !== cond.noValue) {
                num += 1;
              }
            }
          });
        } else {
          num += 1;
        }
      }
    });
    return (currentIndex * 100) / (num - 1);
  };

  // REMOVE FADEIN CLASS TO INITIATE ANIMATION FOR EVERY STEP
  useEffect(() => {
    const getStartedEl = document.querySelector('.getStarted');
    setTimeout(() => {
      if (getStartedEl && getStartedEl.classList) getStartedEl.classList.remove('slideUpTrans');
    }, 350);
  }, [quest]);

  return (
    <>
      <div id="bodyModalWrapper" className={`withHeader getStarted slideUpTrans ${get(quest, 'background', '')} ${get(quest, 'history', '')} ${get(quest, 'classNameWrapper', '')}`}>
        {
          get(quest, 'inputs', null) && get(quest, 'history', '') !== 'createProfile' && get(quest, 'history', null) !== 'resume' && (
            <div className="pos-r">
              <BrixelProgressBar
                large
                classProgressBar="container"
                className="brdRadius"
                saturation={500}
                color="green"
                barBackground="text"
                backgroundSaturation={100}
                progressValue={progressBarCalc()}
              />
            </div>

          )
        }

        <div
          id={`step-${quest?.history || 'default'}`}
          className={`bodyModal container ${currentIndex ? '' : ''} ${get(quest, 'history', '')}`}
        >

          <form
            noValidate
            id="multiStepForm"
            autoComplete="off"
            className="dis-fl-col jc-b interactive"
            onSubmit={() => changeStep()}
          >
            <div id={`step-${currentIndex}`} ref={multiStepSlidesRef} className="multiStepSlides">
              <div ref={singleStepRef} className="singleStep pt-5 jc-c ">
                <div className="subcontainer m-a">
                  {
                    quest && get(quest, 'cardType', null) !== 'card' && (
                      <>
                        {
                          quest.titleIcon && (
                            <div className="ta-c mb-3">
                              <img src={quest.titleIcon}  alt="Title Icon"/>
                            </div>
                          )
                        }
                        {
                          quest.titleGreen && (
                            <h3 className="txtGreen400 w-perc-100">{quest.titleGreen}</h3>
                          )
                        }
                        {
                          quest.title && (
                            <h3 className={`fweight-600 max-w-fix-408 ta-c fsize-600 fsize-sm-800 m-a ${quest.subtitle ? 'mb-1' : 'mb-5'}`} dangerouslySetInnerHTML={{ __html: quest.title }} />
                          )
                        }
                        {
                          quest.subtitle && (
                            <p className="mb-5 ta-c txtText600 w-perc-100 px-3 px-sm-2" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                        }
                      </>
                    )
                  }
                  {
                    get(quest, 'inputs', null) && (
                      <div className="dis-fl-col a-c flex-wrap">
                        <div className={`w-perc-100 ${quest.className}`}>
                          <MultiFileldsReduxForm
                            baseByData={baseByData}
                            onSaveData={() => onSaveData()}
                            form={formName}
                            disableNextBtn={false}
                            formValue={formValue}
                            inputs={quest.inputs}
                            onClick={() => changeStep()}
                            onCloseGoBack={() => changeStep('back')}
                            onClickDisabled={!checkValidateField()}
                            onSubmit={() => changeStep()}
                            showSendButton={quest.showSendButton}
                            showErrors={showError}
                            disableDelay={quest?.history !== 'createProfile'}
                            skipPhone
                          />
                        </div>
                      </div>

                    )
                  }
                  {
                    get(quest, 'cardType', null) === 'loadComponent' && (
                      React.createElement(
                        quest.component,
                        {
                          formName,
                          initialValue: formValue,
                          ...quest,
                          onClick: () => (questions[currentIndex + 1] ? changeStep() : closeWindow()),
                          onSaveData: () => onSaveData(),
                        },
                      )
                    )
                  }
                  {
                    (get(quest, 'cardType', null) === 'card') && (
                      <div className={`scaleAnim ta-c ${quest.cardClass}`}>
                        <img loading="lazy" src={quest.img} alt={quest.title} className="max-w-fix-232 mb-5" />
                        {
                          quest.title && (
                            <h2
                              className="fadeAnim fweight-600 ta-c"
                              dangerouslySetInnerHTML={{ __html: quest.title }}
                            />
                          )
                        }
                        {
                          quest.subtitle && (
                            <h6
                              className="fadeAnim mt-2 ta-c"
                              dangerouslySetInnerHTML={{ __html: quest.subtitle }}
                            />
                          )
                        }
                      </div>
                    )
                  }
                  {
                    (quest?.bulletPoints || quest?.text) && (
                      <>
                        {
                          quest.bulletPoints && (
                            <div
                              className="brdRadius bgWhite ml-a mr-a px-2 px-sm-6 max-w-fix-752 pt-3 pb-6 mb-3 bulletPointsStep"
                            >
                              <div className="brdText50">
                                <span className="fweight-600 my-3 dis-b">{quest.bulletPoints.title}</span>
                                <ul>
                                  {
                                    get(quest, 'bulletPoints.description', []).map((bullet,k) => (
                                      <li
                                        className="mb-2"
                                        key={k.toString()}
                                      >
                                        {bullet}
                                      </li>
                                    ))
                                  }
                                </ul>
                              </div>
                            </div>
                          )
                        }
                        <div
                          className="brdRadius bgWhite ml-a mr-a px-2 px-sm-6 max-w-fix-752 pt-3 pb-6"
                        >
                          {
                            get(quest, 'text', []).map((text, i) => (
                              <div
                                key={i.toString()}
                              >
                                <span className="fweight-600 my-3 dis-b">{text.title}</span>
                                {
                                  text.subtitle && (
                                    <p className="fsize-300 fweight-500 mb-1 dis-b">{text.subtitle}</p>
                                  )
                                }
                                <p className="fsize-300 mb-2 dis-b" dangerouslySetInnerHTML={{ __html: text.description }} />
                              </div>
                            ))
                          }
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
            {
              get(quest, 'history', null) !== 'createProfile' && get(quest, 'hideFooter', null) !== true && (
                <div
                  className={`footerAction flowFooter ${get(quest, 'footerWidth', '')} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
                >
                  <div className="pos-r">
                    <div className="w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c">
                      {
                        (
                          currentIndex !== questions.length - 2 &&
                          get(quest, 'history', '') !== 'baloiseInfo' &&
                          quest?.history !== 'success'
                        ) && (
                          <BrixelButtonIcon
                            className="backBtn pos-a x-l"
                            icon="arrow-left-small"
                            onClick={() => changeStep('back')}
                            theme="text"
                            themeSat={300}
                            secondary
                          />
                        )
                      }
                      {
                        get(quest, 'history', null) !== 'resume' && (get(quest, 'inputs', []).length > 0 || action === 'back' || history.location.pathname.includes('termsConditionFlow')) ? (
                          <BrixelButtonPrimary
                            className={`mr-a ml-a noWrap ${get(quest, 'history', null)}`}
                            rounded
                            theme="green"
                            label={translateTo(buttonLabel(), lang)}
                            isLoading={isSmallLoading.sendData}
                            rightIcon="arrow-right-small"
                            onClick={() => (questions[currentIndex + 1] ? changeStep() : closeWindow())}
                            onShowError={() => setShowError(true)}
                            type="submit"
                          />
                        ) : (
                          <>
                            {
                              quest?.history === 'success' && (
                                <BrixelButtonPrimary
                                  className={`mr-a ml-a noWrap ${get(quest, 'history', null)}`}
                                  rounded
                                  theme="green"
                                  label={translateTo('Close', lang)}
                                  isLoading={isSmallLoading.sendData}
                                  rightIcon="arrow-right-small"
                                  onClick={() => history.push(closeLink || '../../')}
                                  onShowError={() => setShowError(true)}
                                  type="submit"
                                />
                              )
                            }
                          </>
                        )
                      }
                      {
                        history.location.pathname.includes('termsConditionFlow') && (
                          <BrixelButtonText
                            theme="text"
                            themeSat={200}
                            className="pos-a-sm x-r"
                            label={translateTo('Skip', lang)}
                            onClick={() => onSaveData('skip')}
                          />
                        )
                      }
                    </div>
                  </div>
                </div>
              )
            }
          </form>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const formName = get(ownProps, 'formName', '');
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, `brixelForm.${formName}.syncErrors`, {}),
    formValue: get(state, `brixelForm.${formName}.values`, {}),
    initialValues: get(state, `brixelForm.${formName}.values`, {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, `brixelForm.${formName}`, null),
    translations: get(state, 'translations', { }),
  });
};

const mapDispatchToProps = (dispatch) => ({
  destroyForm(formName) {
    dispatch(destroy(formName));
  },
  handleReset(formName, initialValue) {
    (dispatch(reset(formName, initialValue)));
  },
  handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(FlowScreen);

