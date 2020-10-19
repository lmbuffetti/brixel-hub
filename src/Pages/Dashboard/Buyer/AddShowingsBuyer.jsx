/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import InputRange from 'react-input-range';
import subDays from 'date-fns/subDays';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  BrixelIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelSwitchButton,
  BrixelTextArea,
  BrixelInputText,
} from '@brixel/brixel-components';
import defaultMessages from '@brixel/brixel-configuration-partner/src/Messages';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import PageHeaderAchievement from '../../../components/PageHeaderAchievement';
import { createPropertyVisitBooking } from '../../../actions/PropertyActions';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-input-range/lib/css/index.css';

// COMPONENTS

const AddShowingsBuyer = (props) => {
  // PROPS
  const {
    activeSingleCompany,
    formValue,
    history,
    lang,
    handleCreatePropertyVisitBooking,
    loggedInUser,
    smallLoading,
  } = props;
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState(null);
  const [datePickerModal, setDatePickerModal] = useState(false);
  const [hours, setHours] = useState({ min: 8, max: 20 });
  const [isEnter, setIsEnter] = useState(true);
  const [scheduleVisitFree, setScheduleVisitFree] = useState([]);
  const [showDate, setShowDate] = useState(false);
  const [showResizer, setShowResizer] = useState(false);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState({});
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(0);
  // REFS
  const calendarRef = useRef(null);
  const datePicker = useRef(null);
  const hoursRef = useRef(null);

  useEffect(() => {
    setIsEnter(true);
  }, [step]);

  useEffect(() => {
    setEmail(get(loggedInUser, 'email', ''));
    if (get(loggedInUser, 'phone.prefix', null)) setPhone(get(loggedInUser, 'phone', {}));
    else setPhone({ prefix: activeSingleCompany.defaultDialCode, number: '' });
    setMessage(get(defaultMessages, `scheduleTextArea.${lang}`, ''));
  }, [loggedInUser]);

  const removeEl = (id) => {
    const visit = scheduleVisitFree;
    scheduleVisitFree.splice(id, 1);
    setScheduleVisitFree(visit.length === 0 ? [] : [...scheduleVisitFree]);
    if (visit.length === 0) history.push({ state: { schedule: false } });
  };

  const handleChange = (e) => {
    setAllDay(e);
    setHours({ min: 8, max: 20 });
  };

  const handleChangeDate = (day) => {
    setDate(day);
  };

  const saveDate = (e) => {
    setDatePickerModal(!datePickerModal);
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
        date,
        isAllDay: allDay,
        normDate: date,
      },
    ]);
    setShowResizer(false);
  };

  const changeStep = () => {
    if (step === 0) setStep(1);
    else {
      const data = {
        getByUser: loggedInUser.id,
        page: formValue.id,
        slots: scheduleVisitFree,
        buyer: {
          name: loggedInUser.name,
          phone,
          email,
          language: lang,
        },
        message,
      };
      handleCreatePropertyVisitBooking(data);
    }
  };

  const checkValidateField = () => true;

  return (
    <div id="bodyModalWrapper" className="achievementFlow">
      <div className="bodyModal">
        <PageHeaderAchievement
          icon="calendar-add"
          title="Add Showings"
          onClick={() => history.push('../showings')}
        />
        <form
          id="multiStepForm"
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off"
          className="dis-fl-col jc-b"
        >
          <div className="multiStepSlides">
            <div
              className={`singleStep jc-c a-t w-perc-100 max-w-fix-440 m-a ${isEnter ? 'fade-enter-active' : 'fade-enter'}`}
            >
              <div className="subcontainer m-a mt-0 rewardsFacts">
                {
                  step === 0 && (
                    <>
                      <div className="min-h-fix-320">
                        {
                          scheduleVisitFree.map((val, i) => (
                            <div
                              className="date-schedule mx-2-neg px-2 bgWhite mx-sm-5-neg px-sm-5"
                              key={i.toString()}
                            >
                              <div>
                                <div className="day mb-1">
                                  <i className="icon-calendar" />
                                  {moment(val.date).format('dddd, DD MMMM YYYY')}
                                </div>
                                <div className="time">
                                  <i className="icon-clock" />
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
                              <div className="remove cur-poi" onClick={() => removeEl(i)}><BrixelIcon
                                icon="bin"
                                color="red"
                              />
                              </div>
                            </div>
                          ))
                        }
                        {
                          scheduleVisitFree.length < 3 && (
                            <div className={`dis-f a-c jc-c ${scheduleVisitFree.length > 0 ? 'mt-2' : ''}`}>
                              <BrixelButtonSecondary
                                bgTransparent
                                className="w-perc-100 max-w-fix-240 mt-3"
                                background="primary"
                                saturation={400}
                                label="Choose new date"
                                rounded
                                leftIcon="calendar"
                                onClick={() => {
                                  setShowDate(!showDate);
                                  setDatePickerModal(!datePickerModal);
                                }}
                              />
                            </div>
                          )
                        }
                        {
                          scheduleVisitFree.length < 3 && datePickerModal && (
                            <div id="chooseDate">
                              <div id="wrapDatePicker">
                                {
                                  showDate && (
                                    <div className="overlay">
                                      <div id="fixedDatePicker" ref={datePicker}>
                                        <DatePicker
                                          inline
                                          selected={date}
                                          onChange={(day) => handleChangeDate(day)}
                                          ref={calendarRef}
                                          minDate={subDays(new Date(), 0)}
                                          locale={lang.value || lang}
                                        />
                                        <div className="bgWhite dis-f a-c jc-c my-1 mt-md-2 mb-md-3">
                                          <BrixelButtonPrimary
                                            className="w-perc-100 max-w-fix-240"
                                            background="primary"
                                            disabled={!date}
                                            saturation={400}
                                            label="Choose time"
                                            rounded
                                            onClick={() => {
                                              setShowDate(false);
                                              setShowResizer(true);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                              </div>
                              <div>
                                {
                                  showResizer && (
                                    <div className="overlay">
                                      <div id="rzSlider" className="modalWindow" ref={hoursRef}>
                                        <h5>Choose the time </h5>
                                        <p
                                          className="mt-4 mb-2 mb-md-0 mt-md-0x"
                                        >{hours.min % 1 !== 0 ? `${Math.trunc(hours.min)}:30` : `${hours.min}:00`} - {hours.max % 1 !== 0 ? `${Math.trunc(hours.max)}:30` : `${hours.max}:00`}
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
                                        <div className="dis-f a-c mb-1 mb-md-0">
                                          <BrixelSwitchButton
                                            label="All day"
                                            input={{
                                              onChange: (e) => handleChange(e),
                                            }}
                                          />
                                        </div>
                                        <div className="dis-f jc-c">
                                          <BrixelButtonPrimary
                                            onClick={(e) => saveDate(e)}
                                            rounded
                                            label="Save"
                                            className="mt-4 w-perc-100 max-w-fix-240"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </>
                  )
                }
                {
                  step === 1 && (
                    <div>
                      <BrixelInputText
                        label="Email"
                        input={{
                          onChange: (val) => setEmail(val),
                          name: 'email',
                          value: email,
                        }}
                      />
                      <BrixelInputText
                        label="Phone"
                        formatType="tel"
                        input={{
                          onChange: (val) => setPhone(val),
                          name: 'phone',
                          value: phone,
                        }}
                      />
                      <BrixelTextArea
                        label="Message"
                        input={{
                          onChange: (val) => setMessage(val),
                          name: 'message',
                          value: message,
                        }}
                      />
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
              <div className="w-perc-100 a-c dis-fl-row m-a jc-fe">
                <BrixelButtonPrimary
                  className="noWrap"
                  disabled={scheduleVisitFree.length === 0}
                  rounded
                  background="primary"
                  saturation={400}
                  label={step === 0 ? 'Next' : 'Save'}
                  rightIcon="arrow-right-small"
                  onClick={() => changeStep()}
                  isLoading={smallLoading === 'property'}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

AddShowingsBuyer.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreatePropertyVisitBooking: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  smallLoading: PropTypes.string,
};

AddShowingsBuyer.defaultProps = {
  smallLoading: '',
};

const mapStateToProps = (state) => {
  const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
  const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
  const activeSingleCompany = get(state, 'companies.activeSingleCompany', {});
  activeSingleCompany.defaultDialCode = countryPhoneCode.dial_code;
  return ({
    activeSingleCompany,
    formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
    lang: get(state, 'user.loggedInUser.user.language', ''),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    smallLoading: get(state, 'common.isSmallLoading', null),
  });
};

const mapDispatchToProps = (dispatch) => ({
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AddShowingsBuyer);
