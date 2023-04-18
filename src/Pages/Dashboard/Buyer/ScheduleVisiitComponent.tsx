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
import type {ScheduleVisitComponentType, ScheduleVisitSlotType} from '../../../@types/Pages/Dashboard/Buyer/ScheduleVisitComponent';

const ScheduleVisitComponent = (props: ScheduleVisitComponentType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeScheduleVisit,
    activeSingleProperty,
    changeFieldValue,
    formValue,
    initalValue,
    lang,
    onClick,
  } = props;

  const calendarRef = useRef(null);
  const datePicker = useRef(null);
  const hoursRef = useRef(null);

  const [pageStage, setPageStage] = useState<null | 'date' | 'hour'>('date');
  const [date, setDate] = useState(null);
  const [hours, setHours] = useState({ min: 8, max: 20 });
  const [allDay, setAllDay] = useState(false);
  const [scheduleVisit, setScheduleVisit] = useState<ScheduleVisitSlotType[]>([]);

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

  useEffect(() => {
    setHours({ min: 8, max: 20 });
  }, [allDay]);


  const onClickBtn = () => {
    const newScheduleVisit = [...formValue.scheduleVisit || []];
    if (initalValue?.scheduleVisit && initalValue?.scheduleVisit.length > 0) {
      history.push(`/buyer/${activeSingleProperty.id}/home`)
    } else if (pageStage === 'hour' && date) {
      history.push({search: ''});
      const startHour = hours.min;
      const formattedDate = DateTime.fromMillis(date).toFormat('d LLL yyyy');

      const startMinutes = startHour % 1 != 0 ? '30' : '00';
      const startObjDate = DateTime.fromFormat(`${formattedDate}, ${Math.floor(startHour)}:${startMinutes}`, 'd LLL yyyy, H:mm', {setZone: true});
      const startTimestamp = startObjDate.toMillis();

      const endHour = hours.max;
      const endMinutes = endHour % 1 != 0 ? '30' : '00';
      const endObjDate = DateTime.fromFormat(`${formattedDate}, ${ Math.floor(endHour)}:${endMinutes}`, 'd LLL yyyy, H:mm', {setZone: true});
      const endTimestamp = endObjDate.toMillis();

      const objDate = {
        end: endTimestamp,
        start: startTimestamp,
        isAllDay: allDay,
        timezone: startObjDate.zoneName,
      };
      newScheduleVisit.push(objDate);
      changeFieldValue('scheduleVisit', newScheduleVisit);
      setPageStage(null);
    } else {
      onClick();
    }
  }

  const buttonLabel = () => {
    if ((pageStage === null || pageStage === 'date') && activeScheduleVisit.length > 0 && !formValue?.scheduleVisit) return 'Close';
    return 'Continue';
  }

  const SingleDateComponent = (customProps) => {
    const {
      index,
      val,
    } = customProps;
    return (
      <div
        className="date-schedule dis-fl-row bgText50 py-small-4 px-2 mb-1"
        key={`vst_${index.toString()}`}
      >
        <div className="dis-fl-row a-c">
          {
            val.start && (
              <span className="day pr-1 fsize-300">
                {DateTime.fromMillis(val.start, { locale: lang }).toFormat('dd LLLL yyyy')},
              </span>
            )
          }
          <div className="time fsize-300">
            {
              val.isAllDay ? (
                <span>
                  {translateTo('All day', lang)}
                </span>
              ) : (
                <>
                  <span>
                    {DateTime.fromMillis(val.start).toFormat('HH:mm')}
                  </span>
                  <span className="mx-small-4">-</span>
                  <span>
                    {DateTime.fromMillis(val.end).toFormat('HH:mm')}
                  </span>
                </>
              )
            }
          </div>
        </div>
        {
          !val.deal && (
            <div
              className="remove cur-poi a-c ml-1"
              onClick={() => removeEl(index)}
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
    )
  }

  const dateList = activeScheduleVisit.concat(formValue?.scheduleVisit || []);

  return (
    <>
      <div className="formWrapper bgWhite brdRadius w-perc-100 shadow-1dp p-3 p-sm-5">
        <div className="dis-fl-col a-c scheduleVisit">
          {
            (dateList.length > 0) && (
              <div id="recap-date-screen" className="dis-fl-col a-c jc-b">
                <h6>Selected date</h6>
                {
                  activeScheduleVisit.map((val, i) => (
                    <SingleDateComponent
                      key={`dateCard${i.toString()}`}
                      index={i}
                      val={val}
                    />
                  ))
                }
                {
                  (formValue?.scheduleVisit || []).map((val, i) => (
                    <React.Fragment key={`dateCard${i.toString()}`}>
                      <h6 className="mt-3">Booking date</h6>
                      <SingleDateComponent
                        index={i}
                        val={val}
                      />
                    </React.Fragment>
                  ))
                }
                {
                  (pageStage === null && formValue?.scheduleVisit && formValue.scheduleVisit.length < 3) && (
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
                        onChange: (val) => setAllDay(val),
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
        (activeScheduleVisit.length > 0 || pageStage !== 'date') && (
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
    activeScheduleVisit: get(state, 'deal.scheduleVisit', []),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    formValue: get(state, 'brixelForm.ScheduleVisit.values', {}),
    initalValue: get(state, 'brixelForm.ScheduleVisit.initalValues', {}),
    lang: get(state, 'common.language', 'en'),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('ScheduleVisit', field, value));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ScheduleVisitComponent);
