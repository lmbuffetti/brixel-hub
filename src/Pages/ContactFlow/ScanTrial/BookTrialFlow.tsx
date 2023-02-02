import React, {useEffect, useRef, useState} from 'react';
import {BrixelButtonPrimary, BrixelIcon, Helpers, useOutsideAlerter} from '@brixel/brixel-components';
import {
  BrixelInputDatePicker,
  BrixelInputText,
  change,
  ReduxField,
  Validation,
} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import {DateTime} from 'luxon';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Accordion from '../../../components/Accordion';
import PhoneImg from '../../../images/TestDrive/phoneTrial.svg';
import VidelCallImg from '../../../images/TestDrive/VideoCall.svg';
import translateTo from '../../../utils/translation';
import type {BookTrialFlowType} from '../../../@types/Pages/ContactFlow/ScanTrial/BookTrialFlow';

const BookTrialFlow = (props: BookTrialFlowType) => {
  const {
    activeSingleCompany,
    changeFieldValue,
    formValue,
    lang,
    loggedInUser,
    onClick,
    showError,
    syncErrors,
  } = props;
  // STATE
  const [, setDate] = useState('');
  const [datePickerModal, setDatePickerModal] = useState(false);
  // REF
  const calendarRef = useRef(null);
  const datePicker = useRef(null);
  // COMPANY DATA
  const phone = get(activeSingleCompany, 'contact.phone', null);
  // const whatsapp = get(activeSingleCompany, 'contact.whatsapp', null);
  const whereby = get(activeSingleCompany, 'contact.whereby', null);

  const [openAccordion, setOpenAccordion] = useState('online');

  useEffect(() => {
    if (get(formValue, 'analysis', '') === 'on-site') setOpenAccordion('online');
    else setOpenAccordion('whereby');
  }, [get(formValue, 'analysis', '')]);

  const handleChangeDate = (day) => {
    setDate(day);
    changeFieldValue('dateBook', DateTime.fromMillis(day, {
      locale: lang,
    }).toFormat('dd-LL-yyyy'));
    changeFieldValue('fullDate', DateTime.fromMillis(day, {
      locale: lang,
    }).toISO());
  };

  useEffect(() => {
    let hourBook = get(formValue, 'hourBook', '');
    if (get(formValue, 'hourBook', null)) hourBook = get(formValue, 'hourBook', '').replace(':', '');
    if (get(formValue, 'fullDate', null) && get(formValue, 'hourBook', null) && +hourBook > 100) {
      const splitDate = (get(formValue, 'fullDate', '')).toString().split(' ');
      splitDate[4] = `${get(formValue, 'hourBook', null)}`;
      const calendarDate = DateTime.fromISO(splitDate[0]).valueOf();
      let dateHour = DateTime.fromFormat(splitDate[4], 'H:mm').get('hour');
      let dateMinutes = DateTime.fromFormat(splitDate[4], 'H:mm').get('minute');
      dateHour *= 3600000;
      dateMinutes *= 60000;
      const defDate = calendarDate + dateHour + dateMinutes;
      changeFieldValue('date', defDate);
    }
  }, [get(formValue, 'fullDate', null), get(formValue, 'hourBook', null)]);

  const closeModal = () => {
    setDatePickerModal(!datePickerModal);
  };

  const openWhereByVideoCall = () => {
    if (whereby) window.open(whereby, '_blank');
    onClick();
  };

  useOutsideAlerter(datePicker, {
    action: 'function',
    func: () => closeModal(),
  });

  return (
    <main id="rewards" className="BookTrialFlow pb-4 h-perc-100 txtText900">
      {
        get(formValue, 'analysis', '') === 'on-site' ? (
          <>
            <h2 className="ta-c fweight-600 fsize-600 fsize-sm-800">{translateTo('We are ready 🚀.', lang)}</h2>
            <h2 className="mb-3 mb-sm-6 ta-c fweight-600 fsize-600 fsize-sm-800">{translateTo('When do you want us to visit?', lang)}</h2>
            <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText100">
              <Accordion
                color="dark"
                saturationTxt={400}
                title={translateTo('Book online', lang)}
                titleClass="fsize-500 w-perc-100 jc-b py-3 px-2 px-sm-5"
                contentClass="pb-3"
                paddingContent="px-2 px-sm-5"
                singleItem
                onExpand={(val) => setOpenAccordion(val === true ? 'online' : '')}
                isExpanded={openAccordion === 'online'}
              >
                {`${DateTime.now().year}-12-${DateTime.now().day + 1}`}
                <div className="dis-f a-t w-perc-100">
                  <div className="pos-r pr-1 w-perc-100 max-w-perc-50">
                    <ReduxField
                      form="scanFlow"
                      ReduxFieldClass="inputDate"
                      ref1={datePicker}
                      ref2={calendarRef}
                      lang={get(lang, 'value', lang)}
                      component={BrixelInputDatePicker}
                      design={{
                        showIconValidation: false,
                        large: true,
                      }}
                      input={{
                        name: 'dateBook',
                        type: 'date',
                        maxDate: new Date(`${DateTime.now().year + 1}-12-31`),
                        minDate: new Date(`${DateTime.now().year}-12-${DateTime.now().day + 1}`),
                        onChange: (val) => handleChangeDate(val),
                        validate: [Validation.required],
                      }}
                      meta={{
                        invalid: get(syncErrors, 'dateBook', null) !== true,
                        dirty: get(syncErrors, 'dateBook', null) !== true,
                        showErrors: showError,
                        message: {
                          error: translateTo('Please select a date', lang),
                        },
                      }}
                    />
                  </div>
                  <div className="pos-r pl-1 w-perc-100 max-w-perc-50">
                    <ReduxField
                      form="scanFlow"
                      ReduxFieldClass="inputDate"
                      component={BrixelInputText}
                      input={{
                        name: 'hourBook',
                        placeholder: '08:00',
                        type: 'time',
                        validate: [Validation.required],
                      }}
                      design={{
                        large: true,
                      }}
                      inputFormat={{
                        formatType: 'date-hh:mm',
                      }}
                      labels={{
                        label: '',
                      }}
                      meta={{
                        invalid: get(syncErrors, 'hourBook', null) !== true,
                        dirty: get(syncErrors, 'hourBook', null) !== true,
                        showErrors: showError,
                        message: {
                          error: translateTo('Please insert an hour', lang),
                        },
                      }}
                    />
                    <BrixelIcon
                      className="pos-a-fix x-r-1 hour-book x-t-1"
                      icon="clock"
                      color="dark"
                    />
                  </div>
                </div>
                {
                  loggedInUser.id && (
                    <div>
                      <ReduxField
                        form="scanFlow"
                        component={BrixelInputText}
                        ReduxFieldClass="inputPhone"
                        design={{
                          className: 'mt-3',
                          large: true,
                        }}
                        input={{
                          name: 'phone',
                          type: 'text',
                          placeholder: '',
                          validate: [Validation.required],
                        }}
                        inputFormat={{
                          formatType: 'tel',
                        }}
                        labels={{
                          label: '',
                        }}
                        meta={{
                          invalid: get(syncErrors, 'phone', null) !== true,
                          dirty: get(syncErrors, 'phone', null) !== true,
                          showErrors: showError,
                          message: {
                            error: translateTo('Please insert a valid phone', lang),
                          },
                        }}
                      />
                    </div>
                  )
                }
                <p className="mt-2">
                  <span>{translateTo('Alternatively you can call us on', lang)}</span>
                  {
                    phone && (
                      <a href={`tel:${Helpers.telephoneFormat(phone)}`} className="ml-1 txtText700 cur-poi td-u">{Helpers.telephoneFormat(phone)}</a>
                    )
                  }
                </p>
                <p>{translateTo('We are reachable Mo - Fr, 09:00 to 18:00.', lang)}</p>
              </Accordion>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-1 ta-c fsize-600 fsize-sm-800 fweight-600">{translateTo('We are ready from', lang)}</h2>
            <h2 className="mb-3 mb-sm-6 ta-c fsize-600 fsize-sm-800 fweight-600">{translateTo('Mo - Fr, 09:00 to 18:00.', lang)}</h2>
            <div>
              <div className="max-w-fix-600 dis-fl-col dis-fl-row-sm ml-a mr-a dis-f a-t jc-b">
                <div className="w-perc-100 w-perc-sm-50 max-w-fix-sm-304 ta-c">
                  <img loading="lazy" className="max-w-fix-120 max-w-fix-sm-144" src={PhoneImg} alt="Phone" />
                  <h4 className="mb-1 mb-1 fsize-500 fsize-sm-600">Phone</h4>
                  <p>{translateTo('You can call us on', lang)}</p>
                  <p>
                    <a className="txtText900 td-u" href={`tel:${phone}`}>{Helpers.telephoneFormat(phone)}</a>
                  </p>
                </div>
                <div className="w-perc-100 w-perc-sm-50 max-w-fix-sm-304 ta-c">
                  <img loading="lazy" className="max-w-fix-120 max-w-fix-sm-144" src={VidelCallImg} alt="Phone" />
                  <h4 className="mb-1 mb-1 fsize-500 fsize-sm-600">{translateTo('Video call', lang)}</h4>
                  <p>{translateTo('We use Whereby – a safe and easy tool. No installation needed.', lang)}</p>
                  {
                    whereby && (
                      <BrixelButtonPrimary
                        className="mx-a mt-3"
                        rounded
                        label={translateTo('Start video call', lang)}
                        onClick={() => openWhereByVideoCall()}
                        rightIcon="arrow-right-small"
                      />
                    )
                  }
                </div>
              </div>
            </div>
          </>
        )
      }

    </main>
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  formValue: get(state, 'brixelForm.scanFlow.values', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  syncErrors: get(state, 'brixelForm.scanFlow.syncErrors', {}),
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('scanFlow', field, value));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(BookTrialFlow);
