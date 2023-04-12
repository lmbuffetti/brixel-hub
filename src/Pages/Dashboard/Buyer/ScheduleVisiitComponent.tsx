import React, {useEffect, useRef, useState} from 'react';
import {DateTime} from 'luxon';
import {useLocation, useNavigate} from 'react-router-dom';
import get from 'lodash/get';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {
  BrixelButtonPrimary,
  BrixelButtonText,
  BrixelButtonIcon,
} from '@brixel/brixel-components';
import {
  BrixelDatePicker,
  BrixelInputMultiRange,
  BrixelSwitchButton, change,
} from '@brixel/brixel-components/dist/form';
import translateTo from '../../../utils/translation';
import type {AddShowingsBuyerType} from '../../../@types/Pages/Dashboard/Buyer/AddShowingsBuyer';
import type {ScheduleVisitComponentType} from '../../../@types/Pages/Dashboard/Buyer/ScheduleVisitComponent';

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

  const [pageStage, setPageStage] = useState('date');
  const [date, setDate] = useState(null);
  const [hours, setHours] = useState({ min: 8, max: 20 });
  const [allDay, setAllDay] = useState(false);
  const [scheduleVisit, setScheduleVisit] = useState<AddShowingsBuyerType['activeSinglePropertyBookingSlots']>([]);

  useEffect(() => {

    if (activeSinglePropertyBookingSlots.length > 0 && get(history, 'location.search', '').split('?')[1] === 'showBookings') {
      setPageStage('resume');
      setScheduleVisit(get(activeSinglePropertyBookingSlots[activeSinglePropertyBookingSlots.length - 1], 'slots', []));
    }
  }, [activeSinglePropertyBookingSlots]);

  const removeEl = (id) => {
    history.push({search: ''});
    const visit = scheduleVisit;
    scheduleVisit.splice(id, 1);
    setScheduleVisit(visit.length === 0 ? [] : [...scheduleVisit]);
    if (visit.length === 0) {
      setPageStage('date');
      setDate(null);
    }
  };

  const handleChangeDate = (day) => {
    setPageStage('hour');
    setDate(day);
  };

  const handleChange = (e) => {
    // setPageStage('hour');
    setAllDay(e);
    setHours({ min: 8, max: 20 });
  };

  const onClickBtn = () => {
    const newScheduleVisit: AddShowingsBuyerType['activeSinglePropertyBookingSlots'] = [...scheduleVisit];
    if (pageStage === 'resume') {
      history.push(`/buyer/${activeSingleProperty.id}/home`)
    } else if (pageStage === 'hour' && date) {
      history.push({search: ''});
      const startHour = hours.min;
      const endHour = hours.max;
      const formattedDate = DateTime.fromMillis(date).toFormat('d LLL yyyy');
      const startObjDate = DateTime.fromFormat(`${formattedDate}, ${startHour}:00`, 'd LLL yyyy, H:mm', {setZone: true});
      const startTimestamp = startObjDate.toMillis();

      const endObjDate = DateTime.fromFormat(`${formattedDate}, ${endHour}:00`, 'd LLL yyyy, H:mm', {setZone: true});
      const endTimestamp = endObjDate.toMillis();

      const objDate = {
        end: endTimestamp,
        start: startTimestamp,
        isAllDay: allDay,
        timezone: startObjDate.zoneName,
      };
      newScheduleVisit.push(objDate);
      setPageStage('date');
    } else {
      changeFieldValue('scheduleVisit', scheduleVisit);
      onClick();
    }
  }

  const buttonLabel = () => {
    if (pageStage === 'resume') return 'Close';
    return 'Continue';
  }

  return (
    <>
      <div className="formWrapper bgWhite brdRadius w-perc-100 shadow-1dp p-3 p-sm-5">
        <div className="dis-fl-col a-c scheduleVisit">
          {
            (scheduleVisit.length > 0) && (
              <div id="recap-date-screen" className="dis-fl-col a-c jc-b">
                {
                  scheduleVisit.map((val, i) => (
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
                  (scheduleVisit.length > 0 && scheduleVisit.length < 3) && (
                    <BrixelButtonText
                      themeSat={400}
                      className="mt-1 fsize-300"
                      theme="green"
                      label={translateTo('Choose another date', lang)}
                      rightIcon="calendar"
                      onClick={() => setPageStage('date')}
                    />
                  )
                }
              </div>
            )
          }
          {
            pageStage === 'hour' && (
              <div id="select-time-screen" className="w-perc-100">
                <div id="rzSlider" className="modalWindow" ref={hoursRef}>
                  <h6>{translateTo('Choose your time', lang)}</h6>
                  <BrixelInputMultiRange
                    className="mt-5"
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
            pageStage === 'date' && (
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
        pageStage !== 'date' && (
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
    activeSinglePropertyBookingSlots: get(state, 'property.activeSinglePropertyBookingss', []),
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
