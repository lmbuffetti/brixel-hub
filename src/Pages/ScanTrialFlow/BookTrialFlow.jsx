/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelIcon,
  BrixelInputText,
  BrixelInputDatePicker,
  change,
  Helpers,
  changeSyncError,
  ReduxField,
  useOutsideAlerter,
} from '@brixel/brixel-components';
import { DateTime } from 'luxon';
import Accordion from '../../components/Accordion';

const BookTrialFlow = (props) => {
  const {
    activeSingleCompany,
    changeFieldValue,
    formValue,
    lang,
    loggedInUser,
    onClick,
    showError,
    syncErrors,
    updateError,
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

  useEffect(() => {
    if (openAccordion) changeFieldValue('bookType', openAccordion);
    if (openAccordion === 'online' || openAccordion === 'schedule') {
      updateError('dateBook', 'Required');
      updateError('hourBook', 'Required');
      if (loggedInUser.id) updateError('phone', 'Required');
    }
  }, [openAccordion]);

  useEffect(() => {
    if (get(formValue, 'dateBook', null)) updateError('dateBook', true);
    else updateError('dateBook', 'Required');
    if (get(formValue, 'hourBook', null)) updateError('hourBook', true);
    else updateError('hourBook', 'Required');
    if (loggedInUser.id) {
      if (get(formValue, 'phone', {}).number) updateError('phone', true);
      else updateError('phone', 'Required');
    }
  }, [formValue]);

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

  useOutsideAlerter(datePicker, {
    action: 'function',
    func: () => closeModal(),
  });

  return (
    <main id="rewards" className="BookTrialFlow pb-4 h-perc-100 txtDark700">
      <h2 className="ta-c fweight-600 fsize-600 fsize-sm-800">We are ready 🚀.</h2>

      {
        get(formValue, 'analysis', '') === 'on-site' ? (
          <>
            <h2 className="mb-3 mb-sm-6 ta-c fweight-600 fsize-600 fsize-sm-800">When do you want us to visit?</h2>
            <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite">
              <Accordion
                color="dark"
                saturationTxt={400}
                title="Book online"
                titleClass="fsize-500 w-perc-100 jc-b py-3 px-2 px-sm-5"
                contentClass="pb-3"
                paddingContent="px-2 px-sm-5"
                singleItem
                onExpand={(val) => setOpenAccordion(val === true ? 'online' : '')}
                isExpanded={openAccordion === 'online'}
              >
                <div className="dis-f a-t w-perc-100">
                  <div className="pos-r pr-1 w-perc-100 max-w-fix-200">
                    <ReduxField
                      form="scanFlow"
                      ReduxFieldClass="inputDate"
                      ref1={datePicker}
                      ref2={calendarRef}
                      lang={lang.value || lang}
                      component={BrixelInputDatePicker}
                      design={{
                        showIconValidation: false,
                        large: true,
                      }}
                      input={{
                        name: 'dateBook',
                        type: 'date',
                        maxDate: `${DateTime.now().year + 1}-12-31`,
                        minDate: DateTime.now().toFormat('yyyy-LL-dd'),
                        onChange: (val) => handleChangeDate(val, 'new'),
                      }}
                      meta={{
                        invalid: get(syncErrors, 'dateBook', '') !== true,
                        dirty: get(syncErrors, 'dateBook', '') !== true,
                        showErrors: showError,
                        message: {
                          error: 'Please select a date',
                        },
                      }}
                    />
                  </div>
                  <div className="pos-r pl-1 w-perc-100 max-w-fix-144">
                    <ReduxField
                      form="scanFlow"
                      ReduxFieldClass="inputDate"
                      component={BrixelInputText}
                      input={{
                        name: 'hourBook',
                        placeholder: '08:00',
                        type: 'time',
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
                        invalid: get(syncErrors, 'hourBook', '') !== true,
                        dirty: get(syncErrors, 'hourBook', '') !== true,
                        showErrors: showError,
                        message: {
                          error: 'Please insert an hour',
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
                        }}
                        inputFormat={{
                          formatType: 'tel',
                        }}
                        labels={{
                          label: '',
                        }}
                        meta={{
                          invalid: get(syncErrors, 'phone', '') !== true,
                          dirty: get(syncErrors, 'phone', '') !== true,
                          showErrors: showError,
                          message: {
                            error: 'Please insert a valid phone',
                          },
                        }}
                      />
                    </div>
                  )
                }
                <p className="mt-2">
                  <span>Alternatively you can call us on</span>
                  {
                    phone && (
                      <a href={`tel:${Helpers.telephoneFormat(phone)}`} className="ml-1 txtDark400 cur-poi td-u">{Helpers.telephoneFormat(phone)}</a>
                    )
                  }
                </p>
                <p>We are reachable Mo - Fr, 09:00 to 18:00.</p>
              </Accordion>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-3 mb-sm-6 ta-c fweight-600">Let&apos;s talk now or later?</h2>
            <div>
              <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite">
                <Accordion
                  color="dark"
                  saturationTxt={400}
                  title="Speak to us now"
                  titleClass="fsize-500 w-perc-100 jc-b py-3 px-2 px-sm-5"
                  contentClass="pb-5"
                  paddingContent="px-2 px-sm-5"
                  onExpand={(val) => setOpenAccordion(val === true ? 'whereby' : '')}
                  smallRightIcon
                  isExpanded={openAccordion === 'whereby'}
                >
                  {
                    whereby && (
                      <button
                        type="button"
                        className="dis-f a-c mb-3"
                        onClick={() => onClick()}
                      >
                        <BrixelIcon
                          color="white"
                          saturation={0}
                          icon="monitor"
                          iconWidth="w-fix-24"
                        />
                        <p className="ml-2 td-u">Start a video call</p>
                      </button>
                    )
                  }
                  <p className="">We are reachable Mo - Fr, 09:00 to 18:00.</p>
                  <p>
                    <span>Alternatively you can call us on</span>
                    {
                      phone && (
                        <a href={`tel:${Helpers.telephoneFormat(phone)}`} className="ml-1 txtDark400 cur-poi td-u">{Helpers.telephoneFormat(phone)}</a>
                      )
                    }
                  </p>
                </Accordion>
                <hr className="lighter" />
                <Accordion
                  color="dark"
                  saturationTxt={400}
                  title="Schedule for later"
                  titleClass="fsize-500 w-perc-100 jc-b py-3 px-2 px-sm-5"
                  contentClass="pb-5"
                  paddingContent="px-2 px-sm-5"
                  onExpand={(val) => setOpenAccordion(val === true ? 'schedule' : '')}
                  smallRightIcon
                  isExpanded={openAccordion === 'schedule'}
                >
                  <div className="dis-f a-t jc-b w-perc-100">
                    <div className="pos-r pr-1 w-perc-50">
                      <ReduxField
                        form="scanFlow"
                        ReduxFieldClass="inputDate"
                        ref1={datePicker}
                        ref2={calendarRef}
                        lang={lang.value || lang}
                        component={BrixelInputDatePicker}
                        design={{
                          showIconValidation: false,
                          large: true,
                        }}
                        input={{
                          name: 'dateBook',
                          type: 'date',
                          maxDate: `${DateTime.now().year + 1}-12-31`,
                          minDate: DateTime.now().toFormat('yyyy-LL-dd'),
                          onChange: (val) => handleChangeDate(val, 'new'),
                        }}
                        meta={{
                          invalid: get(syncErrors, 'dateBook', '') !== true,
                          dirty: get(syncErrors, 'dateBook', '') !== true,
                          showErrors: showError,
                          message: {
                            error: 'Please select a date',
                          },
                        }}
                      />
                    </div>
                    <div className="pos-r pl-1 max-w-fix-152 w-perc-100">
                      <ReduxField
                        form="scanFlow"
                        ReduxFieldClass="inputTime"
                        component={BrixelInputText}
                        input={{
                          name: 'hourBook',
                          placeholder: '08:00',
                          type: 'time',
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
                          invalid: get(syncErrors, 'hourBook', '') !== true,
                          dirty: get(syncErrors, 'hourBook', '') !== true,
                          showErrors: showError,
                          message: {
                            error: 'Please insert an hour',
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
                          ReduxFieldClass="inputPhone"
                          form="scanFlow"
                          component={BrixelInputText}
                          design={{
                            className: 'mb-1 mt-1',
                            large: true,
                          }}
                          input={{
                            name: 'phone',
                            type: 'text',
                            placeholder: '',
                          }}
                          inputFormat={{
                            formatType: 'tel',
                          }}
                          meta={{
                            invalid: get(syncErrors, 'phone', '') !== true,
                            dirty: get(syncErrors, 'phone', '') !== true,
                            showErrors: showError,
                            message: {
                              error: 'Please insert a valid phone',
                            },
                          }}
                        />
                      </div>
                    )
                  }

                </Accordion>
              </div>
            </div>
          </>
        )
      }

    </main>
  );
};

BookTrialFlow.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  syncErrors: PropTypes.object.isRequired,
  updateError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  formValue: get(state, 'brixelForm.scanFlow.values', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  syncErrors: get(state, 'brixelForm.scanFlow.syncErrors', {}),
  lang: get(state, 'user.loggedInUser.user.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('scanFlow', field, value));
  },
  updateError(field, value) {
    dispatch(changeSyncError('scanFlow', field, value));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(BookTrialFlow);
