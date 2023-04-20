import React, { useEffect, useState } from 'react';
import { AddToCalendar } from '@brixel/brixel-components'
import {ScheduleVisitRequestType} from '@brixel/brixel-components/dist/@types/Model';
import { get } from 'lodash';
import { connect } from 'react-redux';
import translateTo from '../utils/translation';
import type { ModalAddToCalendarType } from '../@types/components/ModalAddToCalendar';
import { DateTime } from 'luxon';
import PageHeader from './Header/PageHeader';
import PageFooter from './Footer/PageFooter';
import scheduleAcceptedSvg from '../images/dashboard/scheduleAccepted.svg';
import {bindActionCreators} from 'redux';
import {setModal} from '../actions/CommonActions';

const ModalAddToCalendar = (props: ModalAddToCalendarType) => {
  const {
    activeSingleDeal,
    activeSingleProperty,
    handleSetModal,
    lang,
    scheduleVisit,
  } = props;
  // STATE
  const [visitAccepted, setVisitAccepted] = useState<ScheduleVisitRequestType>();

  useEffect(() => {
    if (activeSingleDeal?.visit && !isNaN(+get(activeSingleDeal, 'visit', 0))) {
      const acceptedVisits = scheduleVisit.find((vst) => vst.sellerStatus === 'accepted' && vst.buyerStatus === 'accepted' && vst.visit.date);
      setVisitAccepted(acceptedVisits);
    }
  }, [activeSingleDeal]);

  const formatCalendar = (type) => {
    switch (type) {
      case 'location': {
        if (activeSingleProperty.location) {
          return `${activeSingleProperty.location.name}, ${activeSingleProperty.location.streetNumber} ${activeSingleProperty.location.zip} ${activeSingleProperty.location.city}`;
        }
        break;
      }
      case 'start': {
        if (visitAccepted?.visit?.date) {
          const date = DateTime.fromMillis(visitAccepted?.visit?.date).toFormat('yyyy-LL-dd', {locale: lang});
          const start = DateTime.fromMillis(visitAccepted?.visit?.date).toFormat('HH:mm', {locale: lang});
          return `${date}T${start}`;
        }
        break;
      }
      case 'end': {
        if (visitAccepted?.visit?.date) {
          const date = DateTime.fromMillis(visitAccepted?.visit?.date).toFormat('yyyy-LL-dd', {locale: lang});
          const end = DateTime.fromMillis(visitAccepted?.visit?.date).plus({minutes: 24*60}).toFormat('HH:mm', {locale: lang});
          return `${date}T${end}`;
        }
        break;
      }
    }
  }

  return (
    <>
      <PageHeader
        showFooter
        isFlow
        onClose={() => handleSetModal({})}
      />
      <div className="bgGreen100 flex-1 dis-fl-col jc-c">
        {
          visitAccepted?.visit?.date && (
            <div className="dis-fl-col a-c">
              <img className="mb-2" src={scheduleAcceptedSvg} width={160} />
              <h3 className="fsize-500 fsize-sm-600 ta-c px-2">
                {translateTo('Your visit is confirmed', lang)}
              </h3>
              <div className="dis-f a-c max-w-perc-80 mt-1">
                <h5 className="pr-2 txtGreen400 fweight-500 mb-3">
                  {DateTime.fromMillis(visitAccepted.visit.date).toFormat('dd LLL yyyy, hh:mm', { locale: lang})}
                </h5>
              </div>

              {
                visitAccepted?.visit?.date && (
                  <AddToCalendar
                    lang={lang}
                    timestamp={visitAccepted.visit.date}
                    title={translateTo(`Visit ${activeSingleProperty.title}`, lang)}
                    location={formatCalendar('location')}
                  />
                )
              }
            </div>
          )
        }
      </div>
      <PageFooter />
    </>
  )
}

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  lang: get(state, 'common.language', 'en'),
  scheduleVisit: get(state, 'deal.scheduleVisit', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddToCalendar);
