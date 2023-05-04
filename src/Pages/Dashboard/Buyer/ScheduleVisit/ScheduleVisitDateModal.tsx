import React, {useEffect, useRef, useState} from 'react';
import {DateTime} from 'luxon';
import get from 'lodash/get';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {
  BrixelDatePicker,
  BrixelInputMultiRange,
  BrixelSwitchButton,
  change,
} from '@brixel/brixel-components/dist/form';
import translateTo from '../../../../utils/translation';
import type {ScheduleVisitComponentType} from '../../../../@types/Pages/Dashboard/Buyer/ScheduleVisitComponent';

const ScheduleVisitDateModal = (props: ScheduleVisitComponentType) => {
  const {
    changeFieldValue,
    formValue,
    lang,
  } = props;

  const calendarRef = useRef(null);
  const datePicker = useRef(null);

  const [date, setDate] = useState<number>();
  const [hours, setHours] = useState({ min: 8, max: 20 });
  const [allDay, setAllDay] = useState(false);

  useEffect(() => {
    setHours({ min: 8, max: 20 });
  }, [allDay]);

  useEffect(() => {
    let start = hours.min;
    let end = hours.max;
    if (formValue?.start) {
      setDate(formValue.start);
      start = +DateTime.fromMillis(formValue.start, { locale: lang }).toFormat('H')
    }
    if (formValue?.end) {
      end = +DateTime.fromMillis(formValue.end, { locale: lang }).toFormat('H')
    }
    if (formValue?.isAllDay) {
      setAllDay(formValue.isAllDay);
    }
    setHours({ min: start, max: end });
  }, [formValue]);

  useEffect(() => {
    if (date) {
      const startHour = hours.min;
      const formattedDate = DateTime.fromMillis(date).toFormat('d LLL yyyy');

      const startMinutes = startHour % 1 != 0 ? '30' : '00';
      const startObjDate = DateTime.fromFormat(`${formattedDate}, ${Math.floor(startHour)}:${startMinutes}`, 'd LLL yyyy, H:mm', {setZone: true});
      const startTimestamp = startObjDate.toMillis();

      const endHour = hours.max;
      const endMinutes = endHour % 1 != 0 ? '30' : '00';
      const endObjDate = DateTime.fromFormat(`${formattedDate}, ${Math.floor(endHour)}:${endMinutes}`, 'd LLL yyyy, H:mm', {setZone: true});
      const endTimestamp = endObjDate.toMillis();

      const objDate = {
        end: endTimestamp,
        start: startTimestamp,
        isAllDay: allDay,
        timezone: startObjDate.zoneName || '',
      };
      changeFieldValue('scheduleVisit', objDate);
    }
  }, [hours, date]);

  const onToggleAllDay = (e) => {
    setAllDay(e);
    setHours({ min: 8, max: 20 });
  };

  return (
    <div className="modalScheduleVisit">

      <div className="h-fix-280">
        <BrixelDatePicker
          hideInput
          ref1={datePicker}
          ref2={calendarRef}
          inline
          selected={date}
          onChange={(day) => setDate(day)}
          minDate={new Date()}
          lang={get(lang, 'value', lang)}
          startOpen
        />
      </div>

      <div>

        <div className="dis-f a-c mt-4 mb-lg-0">
          <BrixelSwitchButton
            label={translateTo('I\'m available all day', lang)}
            input={{
              name: 'allDay',
              onChange: (e) => onToggleAllDay(e),
            }}
          />
        </div>

        {
          !allDay && (
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
          )
        }

      </div>

    </div>
  )
}

const mapStateToProps = (state) => {
  return ({
    activeScheduleVisit: get(state, 'deal.scheduleVisit', []),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
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
)(ScheduleVisitDateModal);
