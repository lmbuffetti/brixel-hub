/* eslint-disable array-callback-return */
import { diff } from 'deep-object-diff';
import has from 'lodash/has';
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import InputRange from 'react-input-range';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import subDays from 'date-fns/subDays';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonText,
} from '@brixel/brixel-components';
import BrixelSwitchButton from '@brixel/brixel-components/dist/components/Form/BrixelSwitchButton';
import {
  initializeForm,
  MultiFileldsReduxForm,
  BrixelDatePicker,
} from '@brixel/brixel-components/dist/form';
import { DateTime } from 'luxon';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import {
  createPropertyVisitBooking,
  getActiveSingleProperty,
  getActiveSinglePropertyBookings,
} from '../../../actions/PropertyActions';
import { spinnerSmallOff } from '../../../actions/CommonActions';
import { QuestionsList } from '../../../resources/AddShowings';
import 'react-input-range/lib/css/index.css';
import { checkBrowser } from '../../../utils/helpers';
import scheduleSvg from '../../../images/dashboard/scehdule.svg';

const AddShowingsBuyer = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    activeSinglePropertyBookingSlots,
    errorValue,
    formValue,
    handleCreatePropertyVisitBooking,
    handleGetActiveSingleProperty,
    handleGetActiveSinglePropertyBookings,
    initForm,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
    userLang,
  } = props;
  const [questions, setQuestions] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH')));
  const [quest, setQuest] = useState(QuestionsList(lang, get(formValue, 'location.countryCode', 'CH'))[0]);
  const [showError, setShowError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [action, setAction] = useState(null);
  const [chooseDatesOpen, setChooseDatesOpen] = useState(true);
  const [showResizer, setShowResizer] = useState(false);
  const [date, setDate] = useState(null);
  const [hours, setHours] = useState({ min: 8, max: 20 });
  const [allDay, setAllDay] = useState(false);
  const [scheduleVisitFree, setScheduleVisitFree] = useState([]);

  // REFS
  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);
  const calendarRef = useRef(null);
  const datePicker = useRef(null);
  const hoursRef = useRef(null);

  // GET URL PARAMS
  const propID = get(match, 'propID', null);

  useEffect(() => {
    if (activeSingleProperty.id) {
      initForm(initialValues);
    }
  }, [activeSingleProperty]);
  
  useEffect(() => {
    if (propID && loggedInUser.id) {
      const data = {
        id: propID,
        data: {
          user: loggedInUser.id,
        },
        smallLoader: 'getBooking',
      };
      handleGetActiveSinglePropertyBookings(data);
    }
  }, [propID, loggedInUser]);

  useEffect(() => {
    if (!isSmallLoading.scheduleVisit && (questions[currentIndex + 1] && questions[currentIndex + 1].history === 'success')) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setQuest(questions[newIndex]);
    }
  }, [isSmallLoading]);
  
  useEffect(() => {
    if (activeSinglePropertyBookingSlots.length > 0) {
      setScheduleVisitFree(activeSinglePropertyBookingSlots);
    }
  }, [activeSinglePropertyBookingSlots]);
  

  useEffect(() => {
    if (propID && propID !== 'propertyLists' && propID !== activeSingleProperty.id) {
      const data = {
        fullVersion: false,
        smallLoader: 'property',
        id: propID,
      };
      handleGetActiveSingleProperty(data);
    }
  }, [propID]);

  // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
  const checkValidateField = (act) => {
    let isValid = true;
    let isNotEmpty = false;
    if (get(quest, 'inputs', null)) {
      quest.inputs.forEach((input) => {
        let err = get(errorValue, input.name, null);
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
              err = get(errorValue, item, true);
              if (err !== true && err !== false && isValid) isValid = false;
            });
          }
          if (input.name === 'register.ownerType') {
            if (!has(formValue, 'register.ownerType') || get(formValue, 'register.ownerType', '') === null) isValid = false;
          }
          if (input.name === 'register.whenToSell') {
            if (!has(formValue, 'register.whenToSell') || get(formValue, 'register.whenToSell', '') === null) isValid = false;
          } else if (err !== true && err !== false && err !== null && isValid) isValid = false;
        }
      });
    }
    if (act === 'value') return isValid && isNotEmpty;
    return isValid;
  };

  const singleStepEl = singleStepRef.current;
  const multiStepSlidesEl = multiStepSlidesRef.current;

  const saveData = () => {
    const data = {
      page: activeSingleProperty.id,
      slots: scheduleVisitFree,
      buyer: {
        name: formValue.name,
        phone: formValue.phone,
        email: formValue.email,
        language: lang,
      },
      getByUser: loggedInUser.id,
      message: formValue.message,
      smallLoader: 'scheduleVisit',
    };
    handleCreatePropertyVisitBooking(data);
    return null;
  };

  // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
  const checkCondition = (id, act) => {
    let newIndex = id;
    const newQuestions = QuestionsList();
    if (get(newQuestions, `[${newIndex}].conditions`, null)) {
      let checkCond = true;
      newQuestions[newIndex].conditions.map((cond) => {
        const val = get(formValue, cond.name, null);
        if (has(cond, 'value') && val !== cond.value && checkCond) {
          if (act === 'back') newIndex -= 1;
          else newIndex += 1;
          checkCond = false;
        }
        return null;
      });
    }
    return newIndex;
  };

  // FUNCTION TO GO TO NEXT STEP
  const changeStep = (act, e, step = 1, skipValidation) => {
    if (e) e.preventDefault();
    const newQuestions = QuestionsList('en', get(formValue, 'location.countryCode', 'CH'));
    let newIndex = currentIndex;
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
    if (newIndex > -1) {
      let defId = checkCondition(newIndex, act);
      if (defId !== newIndex) defId = checkCondition(defId, act);
      if (newQuestions[defId]) {
        // setPosition(newIndex);
        if (newQuestions[defId].toSave) {
          saveData(get(newQuestions[defId], 'action', null));
        } else {
          let newQuest = {
            ...newQuestions[defId],
          };
          if (newQuestions[defId].effect === 'slideUp') {
            newQuest = {
              ...newQuestions[defId - 1],
            };
          }
          if (act === 'back' && newQuestions[defId + 1].effect === 'slideUp') {
            setQuest(newQuest);
            setCurrentIndex(defId);
          } else {
            setQuest(newQuest);
            setCurrentIndex(defId);
          }
          if (checkBrowser() > 0) {
            if (singleStepEl && singleStepEl.scrollTop) singleStepEl.scrollTop = 0;
            if (multiStepSlidesEl && multiStepSlidesEl.scrollTop) multiStepSlidesEl.scrollTop = 0;
          } else {
            if (singleStepEl && singleStepEl.scrollTo) singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
            if (multiStepSlidesEl && multiStepSlidesEl.scrollTo) multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    }
    return null;
  };

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    if (formValue) {
      const newQuest = [];
      QuestionsList('en', get(formValue, 'location.countryCode', 'CH')).map((qst) => {
        if (qst.condition) {
          let isValid = true;
          qst.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
            return null;
          });
          if (isValid) newQuest.push(qst);
        } else {
          newQuest.push(qst);
        }
        return null;
      });
      const checkDiff = diff(quest, newQuest);
      if (Object.keys(checkDiff).length > 0) setQuestions(newQuest);
    }
  }, [formValue]);

  // FUNCTION TO CLOSE
  const closeWindow = () => {
    history.push(`/buyer/${propID}/home`);
  };

  const removeEl = (id) => {
    const visit = scheduleVisitFree;
    scheduleVisitFree.splice(id, 1);
    setScheduleVisitFree(visit.length === 0 ? [] : [...scheduleVisitFree]);
    if (visit.length === 0) setDate(null);
    setShowResizer(false);
  };

  const handleChangeDate = (day) => {
    setDate(day);
  };

  const handleChange = (e) => {
    setAllDay(e);
    setHours({ min: 8, max: 20 });
  };

  const saveDate = (e) => {
    // setDatePickerModal(!datePickerModal);
    e.preventDefault();
    e.stopPropagation();
    const startFormHour = Math.trunc(hours.min) < 10 ? `0${Math.trunc(hours.min)}` : Math.trunc(hours.min);
    const startHour = hours.min % 1 !== 0 ? `${startFormHour}:30` : `${startFormHour}:00`;
    const endFormHour = Math.trunc(hours.max) < 10 ? `0${Math.trunc(hours.max)}` : Math.trunc(hours.max);
    const endHour = hours.max % 1 !== 0 ? `${endFormHour}:30` : `${endFormHour}:00`;
    setScheduleVisitFree([
      ...scheduleVisitFree,
      {
        start: allDay ? null : startHour,
        end: allDay ? null : endHour,
        slot: DateTime.fromMillis(date).toFormat('yyyy-MM-dd', { locale:  userLang}),
        date,
        isAllDay: allDay,
        normDate: date,
      },
    ]);
    setShowResizer(false);
    setChooseDatesOpen(false);
  };

  // DYNAMIC LABEL NEXT BUTTON
  const buttonLabel = () => {
    let label;
    if (date && chooseDatesOpen && !showResizer) label = 'Choose time';
    else if (date && showResizer) label = 'Save'
    else if (get(questions, `[${currentIndex + 2}].toSave`, null)) label = 'Continue';
    else if (get(quest, 'history', '') === 'contactInfo') label = 'Send';
    else label = 'Back to Hub';
    return label;
  };

  const getClickFunc = (e) => {
    if (get(quest, 'history', '') === 'visitDates') {
      if (date && chooseDatesOpen && !showResizer) {
        setChooseDatesOpen(false);
        setShowResizer(true);
      }
      else if (date && !chooseDatesOpen && showResizer) {
        saveDate(e);
      }
      else if (get(questions, `[${currentIndex + 2}].toSave`, null)) changeStep();
    }
    if (get(quest, 'history', '') === 'contactInfo') {
      if (questions[currentIndex + 1]) changeStep();
      else closeWindow();
    }
    if (get(quest, 'history', '') === 'success') closeWindow();
  };

  return (
    <div id="bodyModalWrapper" className={`withHeader getStarted scheduleVisit ${get(quest, 'background', '') ? get(quest, 'background', '') : ''} ${get(quest, 'background', '')} ${get(quest, 'history', '')}`}>
      <div
        className={`bodyModal max-w-fix-600 pt-10 container ${questions[currentIndex].effect === 'slideUp' ? 'signUpScreen' : ''} ${get(quest, 'history', '')}`}
      >
        <div className="ov-h ta-c">
          <img className="w-perc-100 max-w-fix-120" src={scheduleSvg} alt="text-1" />
        </div>
        <form
          id="multiStepForm"
          autoComplete="off"
          className="interactive dis-fl-col jc-b"
          onSubmit={(e) => changeStep(null, e)}
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className="singleStep buyerShowings jc-c">
              <div className="subcontainer m-a">
                {
                  get(quest, 'inputs', null) && (
                    <div id={`step-${currentIndex}`} className="dis-fl-col a-c flex-wrap">
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
                          <p className="mb-5 ta-c txtDark200 w-perc-100 px-3 px-sm-2" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
                      }
                      <div className="formWrapper bgWhite brdRadius w-perc-100 shadow-1dp p-6">
                        {
                          get(quest, 'history', '') === 'visitDates' && !chooseDatesOpen && !showResizer && (
                            <div className="dis-fl-col a-c">
                              {
                                (scheduleVisitFree.length > 0) && (
                                  <div className="dis-fl-col a-c jc-b">
                                    {
                                      scheduleVisitFree.map((val, i) => (
                                        <div
                                          className="date-schedule dis-fl-row bgAltGrey100 py-small-4 px-2 mb-1"
                                          key={`vst_${i.toString()}`}
                                        >
                                          {
                                            val.slot ? (
                                              <div className="dis-fl-row a-c">
                                                <span className="day pr-1 fsize-300">
                                                  {DateTime.fromFormat(val.slot.split(' ')[0], 'yyyy-MM-dd', { locale: userLang }).toFormat('dd LLLL yyyy', { locale: userLang })},
                                                </span>
                                                <div className="time fsize-300">
                                                  {
                                                    val.isAllDay ? (
                                                      <span>All day</span>
                                                    ) : (
                                                      <>
                                                        <span>{val.slot.split(' ')[1]}</span>
                                                        {
                                                          val.end && (
                                                            <span>
                                                          &nbsp;-&nbsp;
                                                              {val.slot.split(' ')[2]}
                                                            </span>
                                                          )
                                                        }
                                                      </>
                                                    )
                                                  }
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="dis-fl-row a-c">
                                                <span className="day pr-1 fsize-300">
                                                  {DateTime.fromMillis(val.date).toFormat('dd LLLL yyyy', { locale: userLang })},
                                                </span>
                                                <div className="time fsize-300">
                                                  {
                                                    val.isAllDay ? (
                                                      <span>All day</span>
                                                    ) : (
                                                      <>
                                                        <span>{val.start}</span>
                                                        {
                                                          val.end && (
                                                            <span>
                                                          &nbsp;-&nbsp;
                                                              {val.end}
                                                            </span>
                                                          )
                                                        }
                                                      </>
                                                    )
                                                  }
                                                </div>
                                              </div>
                                            )
                                          }
                                          {
                                            !val.slot && (
                                              <div
                                                className="remove cur-poi a-c ml-1"
                                                onClick={() => removeEl(i)}
                                              >
                                                <BrixelButtonIcon
                                                  icon="bin"
                                                  theme="red"
                                                  ghost
                                                  small
                                                  bgTransparent
                                                />
                                              </div>
                                            )
                                          }
                                        </div>
                                      ))
                                    }
                                    {
                                      (scheduleVisitFree.length > 0 && scheduleVisitFree.length < 3) && (
                                        <BrixelButtonText
                                          saturation={400}
                                          className="mt-1 fsize-300"
                                          color="green"
                                          label="Suggest more dates"
                                          rightIcon="calendar"
                                          onClick={() => {
                                            setShowResizer(false);
                                            setChooseDatesOpen(true);
                                          }}
                                        />
                                      )
                                    }
                                  </div>
                                )
                              }
                            </div>
                          )
                        }
                        {
                          chooseDatesOpen && (
                            <div className="dis-fl-col a-c jc-b">
                              <span className="fsize-400 fweight-400 mb-3">Choose your date</span>
                              <BrixelDatePicker
                                hideInput
                                ref1={datePicker}
                                ref2={calendarRef}
                                inline
                                selected={date}
                                onChange={(day) => handleChangeDate(day)}
                                minDate={subDays(new Date(), 0)}
                                lang={lang.value || lang}
                                onClick={() => {
                                }}
                              />
                            </div>
                          )
                        }
                        {
                          showResizer && (
                            <div>
                              <div id="rzSlider" className="modalWindow" ref={hoursRef}>
                                <h6>Choose your time </h6>
                                <p
                                  className="mt-4 mb-2 mb-lg-0 mt-lg-0x"
                                >
                                  {hours.min % 1 !== 0 ? `${Math.trunc(hours.min)}:30` : `${hours.min}:00`} - {hours.max % 1 !== 0 ? `${Math.trunc(hours.max)}:30` : `${hours.max}:00`}
                                </p>
                                <InputRange
                                  maxValue={20}
                                  minValue={8}
                                  value={hours}
                                  step={0.5}
                                  formatLabel={(value) => `${value % 1 !== 0 ? `${Math.trunc(value)}:30` : `${value}:00`}`}
                                  onChange={(value) => setHours(value)}
                                  disabled={allDay}
                                />
                                <div className="dis-f a-c mt-4 mb-lg-0">
                                  <BrixelSwitchButton
                                    label="I'm available all day"
                                    input={{
                                      onChange: (e) => handleChange(e),
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        }
                        {
                          get(quest, 'history', '') === 'contactInfo' && !chooseDatesOpen && (
                            <MultiFileldsReduxForm
                              form="Showings"
                              className="w-perc-100"
                              disableNextBtn={false}
                              formValue={formValue}
                              inputs={quest.inputs}
                              onClick={() => changeStep()}
                              onCloseGoBack={() => changeStep('back')}
                              onSubmit={() => changeStep()}
                              showSendButton={quest.showSendButton}
                              showErrors={showError}
                              disableDelay={quest.history !== 'createProfile'}
                            />
                          )
                        }
                        {
                          get(quest, 'history', '') === 'success' &&
                          <div className="dis-fl-col a-c">
                            <span className="mb-2">We will contact you as soon as possible</span>
                            {
                              scheduleVisitFree.map((val, i) => (
                                <div
                                  className="date-schedule dis-fl-row bgAltGrey100 py-small-4 px-2 mb-1"
                                  key={`vst_${i.toString()}`}
                                >
                                  <div className="dis-fl-row a-c">
                                    <span className="day pr-1 fsize-300">
                                      {DateTime.fromMillis(val.date, { locale: userLang }).toFormat('dd LLLL yyyy')},
                                    </span>
                                    <div className="time fsize-300">
                                      {
                                        val.isAllDay ? (
                                          <span>All day</span>
                                        ) : (
                                          <>
                                            <span>{val.start}</span>
                                            {
                                              val.end && (
                                                <span>
                                                  &nbsp;-&nbsp;
                                                  {val.end}
                                                </span>
                                              )
                                            }
                                          </>
                                        )
                                      }
                                    </div>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        }
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          {
            date && (
              <div
                className={`footerAction flowFooter ${get(quest, 'footerWidth', '')} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}`}
              >
                <div className="pos-r">
                  <div className="w-perc-100 a-c dis-fl-row jc-c flex-wrap">
                    {
                      showResizer && (
                        <BrixelButtonIcon
                          className="pos-a ml-0"
                          icon="arrow-left-small"
                          onClick={() => changeStep('back')}
                          theme="light"
                          secondary
                        />
                      )
                    }
                    {
                      (get(quest, 'inputs', []).length > 1 || action === 'back' || date || scheduleVisitFree.length > 0) && (
                        <BrixelButtonPrimary
                          className={`noWrap ${get(quest, 'history', null)} as-c`}
                          disabled={!checkValidateField()}
                          rounded
                          theme="green"
                          label={buttonLabel()}
                          rightIcon="arrow-right-small"
                          onClick={(e) => (getClickFunc(e))}
                          isLoading={isSmallLoading.scheduleVisit}
                          onShowError={() => setShowError(true)}
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
  );
};

AddShowingsBuyer.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyBookingSlots: PropTypes.arrayOf(PropTypes.object).isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreatePropertyVisitBooking: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleGetActiveSinglePropertyBookings: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  userLang: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  const activeSingleCompany = get(state, 'companies.activeSingleCompany', {});
  activeSingleCompany.defaultDialCode = countryPhoneCode.dial_code;
  const initialValues = {
    ...get(state, 'brixelForm.Showings.values', {}),
    name: get(state, 'user.loggedInUser.user.name', null),
    phone: {
      prefix: get(state, 'user.loggedInUser.user.phone.prefix', countryPhoneCode.dial_code) || countryPhoneCode.dial_code,
      number: get(state, 'user.loggedInUser.user.phone.number', ''),
    },
    email: get(state, 'user.loggedInUser.user.email', null),
  };
  return ({
    activeSingleCompany,
    activeSinglePropertyBookingSlots: get(state, 'property.activeSinglePropertyBookingSlots', []),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    errorValue: get(state, 'brixelForm.Showings.syncErrors', {}),
    formValue: get(state, 'brixelForm.Showings.values', {}),
    initialValues,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'user.loggedInUser.user.language', ''),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    userLang: get(state, 'user.loggedInUser.user.language', 'en'),
  });
};

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('Showings', value));
  },
  handleGetActiveSinglePropertyBookings: bindActionCreators(
    getActiveSinglePropertyBookings, dispatch),
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSpinnerSmallOff: bindActionCreators(spinnerSmallOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AddShowingsBuyer);
