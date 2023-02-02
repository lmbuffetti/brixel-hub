import React, {useEffect, useRef, useState} from 'react';
import {BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonText} from '@brixel/brixel-components';
import BrixelSwitchButton from '@brixel/brixel-components/dist/components/Form/BrixelSwitchButton';
import {phonecode} from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import {
  BrixelDatePicker,
  BrixelInputMultiRange,
  initializeForm,
  MultiFileldsReduxForm,
} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import has from 'lodash/has';
import {DateTime} from 'luxon';
import {connect} from 'react-redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import {spinnerSmallOff} from '../../../actions/CommonActions';
import {
  createPropertyVisitBooking,
  getActiveSingleProperty,
  getActiveSinglePropertyBookings,
} from '../../../actions/PropertyActions';
import scheduleSvg from '../../../images/dashboard/scehdule.svg';
import {QuestionsList} from '../../../resources/SingleProperty/AddShowings';
import {checkBrowser} from '../../../utils/helpers';
import translateTo from '../../../utils/translation';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';
import type {AddShowingsBuyerType} from '../../../@types/Pages/Dashboard/Buyer/AddShowingsBuyer';
import {ScanTrialQuestions} from '../../../resources/Flows/ScanTrialRequest';

const AddShowingsBuyer = (props: AddShowingsBuyerType) => {
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
    handleGetActiveSinglePropertyBookings,
    handleGetActiveSingleProperty,
    initForm,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
  } = props;
  const [questions, setQuestions] = useState<QuestionsListType[]>(QuestionsList(lang));
  const [quest, setQuest] = useState<QuestionsListType>(QuestionsList(lang)[0]);
  const [showError, setShowError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [action, setAction] = useState<string | null>(null);
  const [chooseDatesOpen, setChooseDatesOpen] = useState(true);
  const [showResizer, setShowResizer] = useState(false);
  const [date, setDate] = useState(null);
  const [hours, setHours] = useState({ min: 8, max: 20 });
  const [allDay, setAllDay] = useState(false);
  const [scheduleVisitFree, setScheduleVisitFree] = useState<AddShowingsBuyerType['activeSinglePropertyBookingSlots']>([]);

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
  }, [activeSingleProperty.id]);

  useEffect(() => {
    if (!isSmallLoading.scheduleVisit && (questions[currentIndex + 1] && questions[currentIndex + 1].history === 'success')) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setQuest(questions[newIndex]);
    }
  }, [isSmallLoading]);

  useEffect(() => {
    if (propID && loggedInUser.id) {
      if (get(history, 'location.search', '').split('?')[1] === 'showBookings') {
        setChooseDatesOpen(false);
        const newIndex = questions.length - 1;
        setCurrentIndex(newIndex);
        setQuest(questions[questions.length - 1]);
        const data2 = {
          id: propID,
          data: {
            user: loggedInUser.id,
          },
          smallLoader: 'getBooking',
        };
        handleGetActiveSinglePropertyBookings(data2);
      }
    }
  }, [propID, loggedInUser]);


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

  useEffect(() => {
    if (activeSinglePropertyBookingSlots.length > 0 && get(history, 'location.search', '').split('?')[1] === 'showBookings') {
      setScheduleVisitFree(activeSinglePropertyBookingSlots);
    }
  }, [activeSinglePropertyBookingSlots]);

  // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
  const checkValidateField = (act = '') => {
    let isValid = true;
    let isNotEmpty = false;
    if (get(quest, 'inputs', null)) {
      get(quest, 'inputs', []).forEach((input) => {
        if (input?.name) {
          const err = get(errorValue, input.name, null);
          const noEmpty = get(formValue, input.name, 'ayc');
          if (noEmpty !== 'ayc') isNotEmpty = true;
          if (input.condition) {
            input.condition.forEach((item) => {
              if (item.name && item.value && get(formValue, item.name, null) === item.value) {
                if (err !== true && err !== false && err !== null && isValid) isValid = false;
              }
              if (item.name && item.noValue && get(formValue, item.name, null) !== item.noValue) {
                if (err !== true && err !== false && isValid) isValid = false;
              }
            });
          } else if (isValid) {
            isValid = get(errorValue, input.name, null) === true || get(errorValue, input.name, 'ayc') === 'ayc';
          }
        }
      });
    }
    if (quest.history === 'financeCalculator') {
      if (get(formValue, 'affordabilityCheck', null) === null) isValid = false;
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
  const checkCondition = (id, act = '') => {
    let newIndex = id;
    if (get(questions, `[${newIndex}].conditions`, null)) {
      let checkCond = true;
      get(questions[newIndex], 'conditions', []).map((cond) => {
        let val;
        if (cond?.name) {
          val = get(formValue, cond.name, null);
          if (has(cond, 'value') && val !== cond.value && checkCond) {
            if (act === 'back') newIndex -= 1;
            else newIndex += 1;
            checkCond = false;
          }
        }
        if (cond.noValue && val === cond.noValue && checkCond) {
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
  const changeStep = (act = 'next', e: null | React.FormEvent = null, step = 1, skipValidation = false) => {
    if (e) e.preventDefault();
    const newQuestions = QuestionsList(lang);
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
          saveData();
        } else {
          const newQuest = {
            ...newQuestions[defId],
          };
          setQuest(newQuest);
          setCurrentIndex(defId);
          if (checkBrowser() > 0) {
            // @ts-ignore
            if (singleStepEl && singleStepEl.scrollTop) singleStepEl.scrollTop = 0;
            // @ts-ignore
            if (multiStepSlidesEl && multiStepSlidesEl.scrollTop) multiStepSlidesEl.scrollTop = 0;
          } else {
            // @ts-ignore
            if (singleStepEl && typeof singleStepEl.scrollTo === 'function') singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
            // @ts-ignore
            if (multiStepSlidesEl && typeof multiStepSlidesEl.scrollTo === 'function') multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    }
    return null;
  };

  // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
  useEffect(() => {
    const newQuest: QuestionsListType[] = [];
    if (formValue) {
      ScanTrialQuestions(lang).map((quests) => {
        if (quests.condition) {
          let isValid = true;
          quests.condition.map((item) => {
            if (item.name && get(formValue, item.name, null) !== item.value) {
              isValid = false;
            }
            return null;
          });
          if (isValid) newQuest.push(quests);
        } else {
          newQuest.push(quests);
        }
        return null;
      });
      setQuest(newQuest[currentIndex]);
      setQuestions(newQuest);
    }
    if (currentIndex === 0) changeStep();
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
        slot: date ? DateTime.fromMillis(date).toFormat('yyyy-MM-dd', { locale:  lang}) : null,
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
        className={`bodyModal max-w-fix-600 pt-10 container ${get(quest, 'history', '')}`}
      >
        <div className="ov-h ta-c">
          <img loading="lazy" className="w-perc-100 max-w-fix-120" src={scheduleSvg} alt="text-1" />
        </div>
        <form
          id="multiStepForm"
          autoComplete="off"
          className="interactive dis-fl-col jc-b"
          onSubmit={(e) => changeStep('', e)}
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
                          <p className="mb-5 ta-c txtText600 w-perc-100 px-3 px-sm-2" dangerouslySetInnerHTML={{ __html: quest.subtitle }} />)
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
                                          className="date-schedule dis-fl-row bgText100 py-small-4 px-2 mb-1"
                                          key={`vst_${i.toString()}`}
                                        >
                                          <div className="dis-fl-row a-c">
                                            {
                                              val.date && (
                                                <span className="day pr-1 fsize-300">
                                                  {DateTime.fromMillis(val.date, { locale: lang }).toFormat('dd LLLL yyyy')},
                                                </span>
                                              )
                                            }
                                            <div className="time fsize-300">
                                              {
                                                val.isAllDay ? (
                                                  <span>{translateTo('All day', lang)}</span>
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
                                        </div>
                                      ))
                                    }
                                    {
                                      (scheduleVisitFree.length > 0 && scheduleVisitFree.length < 3) && (
                                        <BrixelButtonText
                                          themeSat={400}
                                          className="mt-1 fsize-300"
                                          theme="green"
                                          label={translateTo('Choose another date', lang)}
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
                              <span className="fsize-400 fweight-400 mb-3">
                                {translateTo('Choose your date', lang)}
                              </span>
                              <BrixelDatePicker
                                hideInput
                                ref1={datePicker}
                                ref2={calendarRef}
                                inline
                                selected={date}
                                onChange={(day) => handleChangeDate(day)}
                                minDate={new Date()}
                                lang={get(lang, 'value', lang)}
                              />
                            </div>
                          )
                        }
                        {
                          showResizer && (
                            <div>
                              <div id="rzSlider" className="modalWindow" ref={hoursRef}>
                                <h6>{translateTo('Choose your time', lang)}</h6>
                                <p
                                  className="mt-4 mb-2 mb-lg-0 mt-lg-0x"
                                >
                                  {hours.min % 1 !== 0 ? `${Math.trunc(hours.min)}:30` : `${hours.min}:00`} - {hours.max % 1 !== 0 ? `${Math.trunc(hours.max)}:30` : `${hours.max}:00`}
                                </p>
                                <BrixelInputMultiRange
                                  maxLengthNum={20}
                                  minLengthNum={8}
                                  step={0.5}
                                  formatLabel={(value) => `${value % 1 !== 0 ? `${Math.trunc(value)}:30` : `${value}:00`}`}
                                  disabled={allDay}
                                  input={{
                                    name: 'rangeDay',
                                    value: hours,
                                    onChange: (value) => setHours(value),
                                  }}
                                />
                                <div className="dis-f a-c mt-4 mb-lg-0">
                                  <BrixelSwitchButton
                                    label={translateTo('I\'m available all day', lang)}
                                    input={{
                                      name: 'allDay',
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
                            <span className="mb-2">
                              {translateTo('We will contact you as soon as possible', lang)}
                            </span>
                            {
                              scheduleVisitFree.map((val, i) => (
                                <div
                                  className="date-schedule dis-fl-row bgText100 py-small-4 px-2 mb-1"
                                  key={`vst_${i.toString()}`}
                                >
                                  <div className="dis-fl-row a-c">
                                    {
                                      val.date && (
                                        <span className="day pr-1 fsize-300">
                                          {DateTime.fromMillis(val.date, { locale: lang }).toFormat('dd LLLL yyyy')},
                                        </span>
                                      )
                                    }
                                    <div className="time fsize-300">
                                      {
                                        val.isAllDay ? (
                                          <span>{translateTo('All day', lang)}</span>
                                        ) : (
                                          <>
                                            {
                                              get(val, 'start') && (
                                                <span>{typeof val.start === 'number' ? DateTime.fromMillis(val.start).toFormat('hh:mm') : val.start}</span>

                                              )
                                            }
                                            {
                                              val.end && (
                                                <span>
                                                  &nbsp;-&nbsp;
                                                  {typeof val.end === 'number' ? DateTime.fromMillis(val.end).toFormat('hh:mm') : val.end}
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
            (date || (get(history, 'location.search', '').split('?')[1] === 'showBookings')) && (
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
                          onClick={() => {
                            setShowResizer(false);
                            setChooseDatesOpen(true);
                          }}
                          theme="light"
                          secondary
                        />
                      )
                    }
                    {
                      (get(quest, 'inputs', []).length > 1 || action === 'back' || (get(history, 'location.search', '').split('?')[1] === 'showBookings') || date || scheduleVisitFree.length > 0) && (
                        <BrixelButtonPrimary
                          className={`noWrap ${get(quest, 'history', null)} as-c`}
                          disabled={!checkValidateField()}
                          rounded
                          theme="green"
                          label={translateTo(buttonLabel(), lang)}
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

const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  const activeSingleCompany = get(state, 'companies.activeSingleCompany', {});
  activeSingleCompany.defaultDialCode = countryPhoneCode?.dial_code;
  const initialValues = {
    ...get(state, 'brixelForm.Showings.values', {}),
    name: get(state, 'user.loggedInUser.user.name', null),
    phone: {
      prefix: get(state, 'user.loggedInUser.user.phone.prefix', countryPhoneCode?.dial_code) || countryPhoneCode?.dial_code,
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
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  initForm(value) {
    dispatch(initializeForm('Showings', value));
  },
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
  handleGetActiveSinglePropertyBookings: bindActionCreators(getActiveSinglePropertyBookings, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSpinnerSmallOff: bindActionCreators(spinnerSmallOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AddShowingsBuyer);
