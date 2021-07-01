/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import {
  BrixelDatePicker,
  BrixelIcon,
  BrixelInputText,
  BrixelSelect,
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
    onClick,
    showError,
    syncErrors,
    updateError,
  } = props;
  // STATE
  const [date, setDate] = useState('');
  const [datePickerModal, setDatePickerModal] = useState(false);
  const [optionHours, setOptionHours] = useState([]);
  // REF
  const calendarRef = useRef(null);
  const datePicker = useRef(null);
  // COMAPNY DATA
  const phone = get(activeSingleCompany, 'contact.phone', null);
  const whatsapp = get(activeSingleCompany, 'contact.whatsapp', null);
  const whereby = get(activeSingleCompany, 'contact.whereby', null);

  const [openAccordion, setOpenAccordion] = useState('online');

  useEffect(() => {
    const hours = [];
    for (let $i = 0; $i < 12; $i += 1) {
      hours.push({ value: `${8 + $i < 10 ? '0' : ''}${8 + $i}:00`, label: `${8 + $i < 10 ? '0' : ''}${8 + $i}.00` });
    }
    setOptionHours(hours);
  }, []);

  useEffect(() => {
    if (get(formValue, 'analysis', '') === 'on-site') setOpenAccordion('online');
    else setOpenAccordion('whereby');
  }, [get(formValue, 'analysis', '')]);

  useEffect(() => {
    if (openAccordion) changeFieldValue('bookType', openAccordion);
    if (openAccordion === 'online' || openAccordion === 'schedule') {
      updateError('dateBook', 'Required');
      updateError('hourBook', 'Required');
      updateError('phone', 'Required');
    }
  }, [openAccordion]);

  useEffect(() => {
    if (get(formValue, 'dateBook', null)) updateError('dateBook', true);
    if (get(formValue, 'hourBook', null)) updateError('hourBook', true);
    if (get(formValue, 'phone', { }).number) updateError('phone', true);
  }, [formValue]);

  const handleChangeDate = (day) => {
    setDate(day);
    changeFieldValue('dateBook', DateTime.fromJSDate(day).toFormat('dd-LL-yyyy'));
    changeFieldValue('fullDate', day);
  };

  useEffect(() => {
    if (get(formValue, 'fullDate', null) && get(formValue, 'hourBook', null)) {
      const splitDate = (get(formValue, 'fullDate', '')).toString().split(' ');
      splitDate[4] = `${get(formValue, 'hourBook', null)}:00`;
      const defDate = new Date(splitDate.join(' '));
      changeFieldValue('date', (DateTime.fromJSDate(defDate).toMillis()));
    }
  }, [get(formValue, 'fullDate', null), get(formValue, 'hourBook', null)]);

  const closeModal = () => {
    setDatePickerModal(!datePickerModal);
  };

  const openVideoCall = () => {
    changeFieldValue('step', 'skip');
    onClick(2);
  };

  useOutsideAlerter(datePicker, {
    action: 'function',
    func: () => closeModal(),
  });

  return (
    <main id="rewards" className="BookTrialFlow pb-4 h-perc-100 txtDark700">
      <h2 className="ta-c fweight-600">We are ready 🚀.</h2>

      {
        get(formValue, 'analysis', '') === 'on-site' ? (
          <>
            <h2 className="mb-6 ta-c fweight-600">When do you want us to visit?</h2>
            <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite">
              <Accordion
                color="dark"
                saturationTxt={400}
                title="Book online"
                titleClass="fsize-500 w-perc-100 jc-b py-3 px-2 px-sm-5"
                contentClass="pb-5"
                paddingContent="px-2 px-sm-5"
                onExpand={(val) => setOpenAccordion(val === true ? 'online' : '')}
                smallRightIcon
                isExpanded={openAccordion === 'online'}
              >
                <div className="dis-f a-t jc-b w-perc-100">
                  <div className="pos-r pr-1 w-perc-50">
                    <ReduxField
                      form="scanFlow"
                      ReduxFieldClass="inputDate"
                      component={BrixelInputText}
                      design={{
                        showIconValidation: false,
                      }}
                      input={{
                        disabled: datePickerModal,
                        placeholder: 'DD-MM-YYYY',
                        name: 'dateBook',
                        onChange: (val) => setDate(val),
                        onFocus: () => setDatePickerModal(!datePickerModal),
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
                    <BrixelIcon
                      className="pos-a-fix x-r-2 activity-calendar cur-poi x-t-1"
                      icon="calendar"
                      color="dark"
                      onClick={() => setDatePickerModal(!datePickerModal)}
                    />
                    {
                      datePickerModal && (
                        <BrixelDatePicker
                          ref1={datePicker}
                          ref2={calendarRef}
                          inline
                          className="afterInput"
                          selected={date}
                          onChange={(day) => {
                            handleChangeDate(day, 'new');
                            closeModal();
                          }}
                          lang={lang}
                        />
                      )
                    }
                  </div>
                  <div className="pos-r pl-1 w-perc-50">
                    <ReduxField
                      form="scanFlow"
                      component={BrixelSelect}
                      input={{
                        name: 'hourBook',
                        options: optionHours,
                      }}
                      meta={{
                        invalid: get(syncErrors, 'hourBook', '') !== true,
                        dirty: get(syncErrors, 'hourBook', '') !== true,
                        showErrors: showError,
                        message: {
                          error: 'Please select an hour',
                        },
                      }}
                    />
                  </div>
                </div>
                <div>
                  <ReduxField
                    form="scanFlow"
                    component={BrixelInputText}
                    ReduxFieldClass="inputPhone"
                    design={{
                      className: 'mt-3',
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
              </Accordion>
              <hr className="lighter" />
              <Accordion
                color="dark"
                saturationTxt={400}
                title="Book via phone"
                titleClass="fsize-500 w-perc-100 jc-b py-3 px-2 px-sm-5"
                contentClass="pb-5"
                paddingContent="px-2 px-sm-5"
                onExpand={(val) => setOpenAccordion(val === true ? 'phone' : '')}
                smallRightIcon
                isExpanded={openAccordion === 'phone'}
              >
                {
                  phone && (
                    <a href={`tel:${Helpers.telephoneFormat(phone)}`} className="dis-f a-c mb-small-12">
                      <BrixelIcon
                        color="white"
                        saturation={0}
                        icon="phone"
                        iconWidth="w-fix-24"
                      />
                      <p className="ml-2">{Helpers.telephoneFormat(phone)}</p>
                    </a>
                  )
                }
                {
                  whatsapp && (
                    <a
                      href={`https://wa.me/${Helpers.telephoneFormat(whatsapp, false, false, false, true)}`}
                      className="dis-f a-c"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BrixelIcon
                        color="white"
                        saturation={0}
                        icon="whatsapp"
                        iconWidth="w-fix-24"
                      />
                      <p className="ml-2">{Helpers.telephoneFormat(whatsapp)}</p>
                    </a>
                  )
                }
                <p className="mt-3 txtDark100">You can reach us Monday to Friday, 9:00 to 18:00.</p>
              </Accordion>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-6 ta-c fweight-600">Let&apos;s talk now or later?</h2>
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
                      <a
                        href={whereby}
                        target="_blank"
                        className="dis-f a-c mb-3"
                        rel="noreferrer"
                        onClick={() => openVideoCall()}
                      >
                        <BrixelIcon
                          color="white"
                          saturation={0}
                          icon="monitor"
                          iconWidth="w-fix-24"
                        />
                        <p className="ml-2 td-u">Start a video call</p>
                      </a>
                    )
                  }
                  <p className="">We are reachable Mo - Fr, 09:00 to 18:00.</p>
                  <p>
                    <span>Alternatively you can call us on</span>
                    {
                      phone && (
                        <a href={`tel:${Helpers.telephoneFormat(phone)}`} className="ml-1 txtDark400 cur-poi">{Helpers.telephoneFormat(phone)}</a>
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
                        component={BrixelInputText}
                        design={{
                          showIconValidation: false,
                        }}
                        input={{
                          disabled: datePickerModal,
                          placeholder: 'DD-MM-YYYY',
                          name: 'dateBook',
                          onChange: (val) => setDate(val),
                          onFocus: () => setDatePickerModal(!datePickerModal),
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
                      <BrixelIcon
                        className="pos-a-fix x-r-2 activity-calendar cur-poi x-t-1"
                        icon="calendar"
                        color="dark"
                        onClick={() => setDatePickerModal(!datePickerModal)}
                      />
                      {
                        datePickerModal && (
                          <BrixelDatePicker
                            ref1={datePicker}
                            ref2={calendarRef}
                            inline
                            className="afterInput"
                            selected={date}
                            onChange={(day) => {
                              handleChangeDate(day, 'new');
                              closeModal();
                            }}
                            lang={lang}
                          />
                        )
                      }
                    </div>
                    <div className="pos-r pl-1 w-perc-50">
                      <ReduxField
                        form="scanFlow"
                        component={BrixelSelect}
                        input={{
                          name: 'hourBook',
                          options: optionHours,
                        }}
                        meta={{
                          invalid: get(syncErrors, 'hourBook', '') !== true,
                          dirty: get(syncErrors, 'hourBook', '') !== true,
                          showErrors: showError,
                          message: {
                            error: 'Please select an hour',
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <ReduxField
                      ReduxFieldClass="inputPhone"
                      form="scanFlow"
                      component={BrixelInputText}
                      design={{
                        className: 'mb-1 mt-1',
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
  lang: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  syncErrors: PropTypes.object.isRequired,
  updateError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  formValue: get(state, 'brixelForm.scanFlow.values', {}),
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(BookTrialFlow);
