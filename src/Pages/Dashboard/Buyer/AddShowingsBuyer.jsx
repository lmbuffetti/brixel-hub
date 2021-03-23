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
  BrixelModal,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelSwitchButton,
  BrixelButtonIcon,
  BrixelIcon,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import { createPropertyVisitBooking } from '../../../actions/PropertyActions';
import { spinnerSmallOff } from '../../../actions/CommonActions';
import ContactForm from '../../../components/ContactForm';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-input-range/lib/css/index.css';

// COMPONENTS

const AddShowingsBuyer = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    handleSpinnerSmallOff,
    history,
    lang,
    smallLoading,
  } = props;
  const [currentStep, setCurrentStep] = useState('schedule');
  const [action, setAction] = useState(null);
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState(null);
  const [datePickerModal, setDatePickerModal] = useState(false);
  const [hours, setHours] = useState({ min: 8, max: 20 });
  const [scheduleVisitFree, setScheduleVisitFree] = useState([]);
  const [showDate, setShowDate] = useState(false);
  const [showResizer, setShowResizer] = useState(false);
  // REFS
  const calendarRef = useRef(null);
  const datePicker = useRef(null);
  const hoursRef = useRef(null);

  useEffect(() => {
    if (smallLoading === 'savedBooking') {
      setCurrentStep('sentMessage');
      handleSpinnerSmallOff();
    }
  }, [smallLoading]);

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

  const buttonActions = () => {
    let btn = null;
    if (currentStep === 'schedule') {
      btn = [
        {
          name: 'Continue',
          disabled: scheduleVisitFree.length === 0,
          func: () => setCurrentStep('message'),
          btnType: 'Primary',
          className: 'mr-1',
          bkg: 'primary',
          sat: 400,
          round: true,
        },
      ];
    }
    if (currentStep === 'message') {
      btn = [
        {
          name: 'Send',
          func: () => setAction('send'),
          btnType: 'Primary',
          className: 'mr-1',
          bkg: 'primary',
          isLoading: action === 'isLoading',
          sat: 400,
          round: true,
        },
      ];
    }
    return btn;
  };

  return (
    <BrixelModal
      multiActions={buttonActions()}
      onClose={() => history.push(`/buyer/${activeSingleProperty.id}/property/showings/`)}
      id="contact-foreground"
      layout="large"
    >
      {
        currentStep === 'schedule' && (
          <div className="dis-fl-col test">
            <section className="titleSection">
              <h4 className="mb-2 txtDark700">Schedule a visit</h4>
              <h5 className="heading6 txtDark700">Suggest up to 3 suitable dates to visit the property</h5>
              <div className="min-h-fix-320">
                {
                  scheduleVisitFree.map((val, i) => (
                    <div
                      className="date-schedule brdSmall brdLight200 p-2 brdRadius bgWhite mt-2"
                      key={i.toString()}
                    >
                      <div>
                        <div className="day mb-1">
                          <BrixelIcon
                            icon="calendar"
                            className="mr-1"
                          />
                          {moment(val.date).format('dddd, DD MMMM YYYY')}
                        </div>
                        <div className="time">
                          <BrixelIcon
                            icon="clock"
                            className="mr-1"
                          />
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
                      <div
                        className="remove cur-poi a-c"
                        onClick={() => removeEl(i)}
                      >
                        <BrixelButtonIcon
                          icon="bin"
                          theme="red"
                          ghost
                        />
                      </div>
                    </div>

                  ))
                }
                {
                  scheduleVisitFree.length < 3 && (
                    <>
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
                                  <div className="bgWhite dis-f a-c jc-c my-1 mt-lg-2 mb-lg-3">
                                    <BrixelButtonPrimary
                                      disabled={!date}
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
                                  <p className="mt-4 mb-2 mb-lg-0 mt-lg-0x">{hours.min % 1 !== 0 ? `${Math.trunc(hours.min)}:30` : `${hours.min}:00`} - {hours.max % 1 !== 0 ? `${Math.trunc(hours.max)}:30` : `${hours.max}:00`}</p>
                                  <InputRange
                                    maxValue={20}
                                    minValue={8}
                                    value={hours}
                                    step={0.5}
                                    formatLabel={(value) => `${value % 1 !== 0 ? `${Math.trunc(value)}:30` : `${value}:00`}`}
                                    onChange={(value) => setHours(value)}
                                    disabled={allDay}
                                  />
                                  <div className="dis-f a-c mb-1 mb-lg-0">
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
                                      className="mt-4"
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </>
                  )
                }
              </div>
            </section>
          </div>
        )
      }
      {
        currentStep === 'message' && (
          <div className="dis-fl-col test">
            <section className="titleSection">
              <h4 className="mb-2 txtDark700">About you</h4>
              <h5 className="heading6 txtDark700">How can we reach you?</h5>
              <div className="min-h-fix-320">
                <ContactForm
                  action={action}
                  onChangeAction={(val) => setAction(val)}
                  scheduleVisit={scheduleVisitFree}
                />
              </div>
            </section>
          </div>
        )
      }
      {
        currentStep === 'sentMessage' && (
          <div id="messageSent" className="dis-fl-col jc-b h-perc-100 mb-2-neg">
            <section className="titleSection">
              <h6 className="mb-1 txtGreen400 dis-f a-bl">
                YOUR MESSAGE WAS SENT
              </h6>
              <h4 className="mb-2 txtDark700">Thank you</h4>
              <h5 className="heading6 txtDark700">We will contact you as soon as possible.</h5>
            </section>
            <section className="bodySection mx-2-neg px-2 bgWhite shadow-1dp brdRadiusTop pt-2 pb-4 mx-sm-5-neg px-sm-5 mb-1-neg">
              <p className="mb-2"><b>Here are 3 tips for a smooth process</b></p>

              <ul>
                <li>
                  <BrixelIcon icon="tour" color="green" background="green" saturation={200} saturationTxt={700} />
                  <div>
                    <span>Make sure you visited the</span>&nbsp;
                    <span
                      className="txtPrimary400 cur-poi"
                      onClick={() => window.open(`${baseByData.pageUrl}${activeSingleProperty.stub}/explore/tour`, '_blank')}
                    >
                      <span>3D Tour</span>
                    </span>
                  </div>
                </li>
                <li className="redIcon">
                  <BrixelIcon icon="favorite-house" color="green" background="green" saturation={200} saturationTxt={700} />
                  Do not forget to favorite the property to keep all the information in one place
                </li>
                <li className="redIcon">
                  <BrixelIcon icon="money" color="green" background="green" saturation={200} saturationTxt={700} />
                  Get in touch with your bank about financing before you visit
                </li>
              </ul>
            </section>
          </div>
        )
      }
    </BrixelModal>
  );
};

AddShowingsBuyer.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleSpinnerSmallOff: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
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
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    activeSingleCompany,
    formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
    lang: get(state, 'user.loggedInUser.user.language', ''),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    smallLoading: get(state, 'common.isSmallLoading', null),
  });
};

const mapDispatchToProps = (dispatch) => ({
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
  handleSpinnerSmallOff: bindActionCreators(spinnerSmallOff, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AddShowingsBuyer);
