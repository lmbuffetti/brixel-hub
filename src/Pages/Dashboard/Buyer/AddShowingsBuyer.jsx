/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import subDays from 'date-fns/subDays';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelDatePicker,
  BrixelIcon,
  BrixelModal,
  BrixelSwitchButton,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { phonecode } from '@brixel/brixel-components/dist/constants/CountryCodePhone';
import { DateTime } from 'luxon';
import { createPropertyVisitBooking } from '../../../actions/PropertyActions';
import { spinnerSmallOff } from '../../../actions/CommonActions';
import ContactForm from '../../../components/ContactForm';
import 'react-input-range/lib/css/index.css';

// COMPONENTS

const AddShowingsBuyer = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeSingleProperty,
    lang,
    isSmallLoading,
    userLang,
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
    if (isSmallLoading.savedBooking === 'sentMessage' || isSmallLoading.sendMessage === 'sentMessage') {
      setCurrentStep('sentMessage');
    }
  }, [isSmallLoading]);

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
          isLoading: isSmallLoading.sendMessage === true,
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
                      key={`vst_${i.toString()}`}
                    >
                      <div>
                        <div className="day mb-1">
                          <BrixelIcon
                            icon="calendar"
                            className="mr-1"
                          />
                          {DateTime.fromMillis(val.date, { locale: userLang }).toFormat('cccc, dd LLLL yyyy')}
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
                              <BrixelDatePicker
                                hideInput
                                ref1={datePicker}
                                ref2={calendarRef}
                                inline
                                selected={date}
                                onChange={(day) => handleChangeDate(day)}
                                minDate={subDays(new Date(), 0)}
                                lang={lang.value || lang}
                                hasButtonChoice
                                onClick={() => {
                                  setShowDate(false);
                                  setShowResizer(true);
                                }}
                              />
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
                  resetAction={() => setAction(null)}
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
            <section
              className="bodySection mx-2-neg px-2 bgWhite shadow-1dp brdRadiusTop pt-2 pb-4 mx-sm-5-neg px-sm-5 mb-1-neg"
            >
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
                  <BrixelIcon
                    icon="favorite-house"
                    color="green"
                    background="green"
                    saturation={200}
                    saturationTxt={700}
                  />
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
  lang: PropTypes.string.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  userLang: PropTypes.string.isRequired,
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
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    userLang: get(state, 'user.loggedInUser.language', 'en'),
  });
};

const mapDispatchToProps = (dispatch) => ({
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
  handleSpinnerSmallOff: bindActionCreators(spinnerSmallOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AddShowingsBuyer);
