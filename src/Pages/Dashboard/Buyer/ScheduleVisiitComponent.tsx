import React, {useEffect, useRef, useState} from 'react';
import {DateTime} from 'luxon';
import translateTo from '../../../utils/translation';
import get from 'lodash/get';
import type {AddShowingsBuyerType} from '../../../@types/Pages/Dashboard/Buyer/AddShowingsBuyer';
import {BrixelButtonPrimary, BrixelButtonText, BrixelButtonIcon} from '@brixel/brixel-components';
import {
  BrixelDatePicker,
  BrixelInputMultiRange,
  BrixelSwitchButton, change,
} from '@brixel/brixel-components/dist/form';
import {compose} from 'redux';
import {connect} from 'react-redux';
import type {ScheduleVisitComponentType} from '../../../@types/Pages/Dashboard/Buyer/ScheduleVisitComponent';
import {useLocation, useNavigate} from 'react-router-dom';

const ScheduleVisitComponent = (props: ScheduleVisitComponentType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleProperty,
    activeSinglePropertyBookingSlots,
    changeFieldValue,
    lang,
    onClick,
  } = props;

  const calendarRef = useRef(null);
  const datePicker = useRef(null);
  const hoursRef = useRef(null);

  const [date, setDate] = useState(null);
  const [hours, setHours] = useState({ min: 8, max: 20 });
  const [allDay, setAllDay] = useState(false);
  const [showResizer, setShowResizer] = useState(false);
  const [chooseDatesOpen, setChooseDatesOpen] = useState(true);
  const [recapScreen, setRecapScreen] = useState(false);
  const [scheduleVisitFree, setScheduleVisitFree] = useState<AddShowingsBuyerType['activeSinglePropertyBookingSlots']>([]);

  useEffect(() => {

    if (activeSinglePropertyBookingSlots.length > 0 && get(history, 'location.search', '').split('?')[1] === 'showBookings') {
      setChooseDatesOpen(false);
      setScheduleVisitFree(get(activeSinglePropertyBookingSlots[activeSinglePropertyBookingSlots.length - 1], 'slots', []));
      setRecapScreen(true);
    }
  }, [activeSinglePropertyBookingSlots]);

  const removeEl = (id) => {
    history.push({search: ''});
    const visit = scheduleVisitFree;
    scheduleVisitFree.splice(id, 1);
    setScheduleVisitFree(visit.length === 0 ? [] : [...scheduleVisitFree]);
    if (visit.length === 0) {
      setRecapScreen(false);
      setChooseDatesOpen(true);
      setDate(null);
    }
    setRecapScreen(false);
    setShowResizer(false);
  };

  const handleChangeDate = (day) => {
    setRecapScreen(false);
    setDate(day);
    setShowResizer(true);
    setChooseDatesOpen(false);
  };

  const handleChange = (e) => {
    setRecapScreen(false);
    setAllDay(e);
    setHours({ min: 8, max: 20 });
  };

  const onClickBtn = () => {
    if (recapScreen) {
      history.push(`/buyer/${activeSingleProperty.id}/home`)
    } else if (showResizer) {
      history.push({search: ''});
      setRecapScreen(false);
      const startFormHour = Math.trunc(hours.min) < 10 ? `0${Math.trunc(hours.min)}` : Math.trunc(hours.min);
      const startHour = hours.min % 1 !== 0 ? `${startFormHour}:30` : `${startFormHour}:00`;
      const endFormHour = Math.trunc(hours.max) < 10 ? `0${Math.trunc(hours.max)}` : Math.trunc(hours.max);
      const endHour = hours.max % 1 !== 0 ? `${endFormHour}:30` : `${endFormHour}:00`;
      setScheduleVisitFree([
        ...scheduleVisitFree,
        {
          start: allDay ? null : startHour,
          end: allDay ? null : endHour,
          slot: date ? DateTime.fromMillis(date).toFormat('yyyy-MM-dd', {locale: lang}) : null,
          date,
          isAllDay: allDay,
          normDate: date,
        },
      ]);
      setShowResizer(false);
      setChooseDatesOpen(false);
    } else {
      changeFieldValue('scheduleVisitFree', scheduleVisitFree);
      onClick();
    }
  }

  const buttonLabel = () => {
    if (recapScreen) return 'Close';
    return 'Continue';
  }

  return (
    <>
      <div className="formWrapper bgWhite brdRadius w-perc-100 shadow-1dp p-6">
        <div className="dis-fl-col a-c scheduleVisit">
          {
            (scheduleVisitFree.length > 0) && (
              <div id="recap-date-screen" className="dis-fl-col a-c jc-b">
                {
                  scheduleVisitFree.map((val, i) => (
                    <div
                      className="date-schedule dis-fl-row bgText50 py-small-4 px-2 mb-1"
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
                                <span>
                                  {val.slot && val.slot.split(' ')[1] ? val.slot.split(' ')[1] : val.start}
                                </span>
                                {
                                  val.end && (
                                    <span>
                                                          &nbsp;-&nbsp;
                                      {val.slot && val.slot.split(' ')[2] ? val.slot.split(' ')[2] : val.end}
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
          {
            showResizer && (
              <div id="select-time-screen" className="w-perc-100">
                <div id="rzSlider" className="modalWindow" ref={hoursRef}>
                  <h6>{translateTo('Choose your time', lang)}</h6>
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
            chooseDatesOpen && (
              <div id="select-date-screen" className="dis-fl-col a-c jc-b">
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
        </div>
      </div>
      {
        !chooseDatesOpen && (
          <div className="mt-3">
            <BrixelButtonPrimary
              className="mr-a ml-a noWrap"
              rounded
              theme="green"
              label={translateTo(buttonLabel(), lang)}
              rightIcon="arrow-right-small"
              onClick={() => onClickBtn()}
              type="submit"
            />
          </div>
        )
      }
    </>
  )
}

const mapStateToProps = (state) => {
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    activeSinglePropertyBookingSlots: get(state, 'property.activeSinglePropertyBooking', []),
    lang: get(state, 'common.language', 'en'),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Showings', field, value));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ScheduleVisitComponent);
