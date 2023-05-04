import React, {useEffect, useState} from 'react';
import {
  change,
  initializeForm,
  BrixelTextArea,
} from '@brixel/brixel-components/dist/form';
import {
  AddToCalendar,
  BrixelButtonPrimary,
  BrixelIcon,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {setModal} from '../../../../actions/CommonActions';
import {saveScheduleVisit} from '../../../../actions/PropertyActions';
import ScheduleVisitComponent from './ScheduleVisitDateModal';
import translateTo from '../../../../utils/translation';
import Calendar from '../../../../images/dashboard/calendarState.svg';
import type {ScheduleVisitType} from '../../../../@types/Pages/Dashboard/Buyer/ScheduleVisit';
import {ScheduleVisitSlotType} from '@brixel/brixel-components/dist/@types/Model';
import {DateTime} from 'luxon';
import BrixelButtonSecondary from '@brixel/brixel-components/dist/components/BrixelButtonSecondary';
import PropertyVisitImg from '../../../../images/dashboard/PropertyVisit.svg';
import PropertyconfirmedVisitImg from '../../../../images/dashboard/PropertyConfimedVisit.svg';
import isEmpty from 'lodash/isEmpty';
import BrixelSingleTag from '@brixel/brixel-components/dist/components/BrixelSingleTag';

const ScheduleVisit = (props: ScheduleVisitType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeScheduleVisit,
    activeScheduleVisits,
    activeSingleDeal,
    activeSingleProperty,
    changeFieldValue,
    formValue,
    handleSetModal,
    hanldeSaveScheduleVisit,
    initForm,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
    modalData,
  } = props;
  // STATE
  const [hideModale, setHideModal] = useState(false);
  const [SectionPage, setSectionPage] = useState<'confirmed' | 'buyerRequest' | 'create'>('create');

  const lastPart = history.location.pathname.split('/').filter(e => e).slice(-1);
  const isNewDate = lastPart[0] === 'addDate';

  // REDIRECT TO SHCEDULE VISIT PAGE FOR SUB ROUTE
  useEffect(() => {
    if (!isEmpty(lastPart[0]) && lastPart[0] !== 'scheduleVisit' && lastPart[0] !== 'addDate') {
      history.push('../scheduleVisit');
    }
  }, [lastPart]);


  const closeModalDate = () => {
    history.push('../scheduleVisit');
    handleSetModal({});
  };

  // STORE CURRENT VISIT TO REDUX
  const storeDate = () => {
    const schuduleVisits: ScheduleVisitSlotType[] = get(formValue, 'scheduleVisits', []);
    schuduleVisits.push(formValue.scheduleVisit)
    changeFieldValue('scheduleVisits', schuduleVisits);
    handleSetModal({});
    setHideModal(true);
  }

  // UPDATE MODAL ACTIONS (SAVE AND DISABLE BUTTONS
  useEffect(() => {
    if (modalData.multiActions && modalData.multiActions?.length > 0 && !hideModale) {
      handleSetModal({
        ...modalData,
        multiActions: [
          {...modalData.multiActions[0]},
          {
            ...modalData.multiActions[1],
            func: () => storeDate(),
            disabled: !formValue?.scheduleVisit?.start,
          },
        ],
      });
    }
  }, [formValue.scheduleVisit]);

  useEffect(() => {
    if (activeScheduleVisit?.buyerAvailability) setSectionPage('buyerRequest');
    if (activeScheduleVisit?.visit?.date) setSectionPage('confirmed');
  }, [activeScheduleVisit]);


  // OPEN MODAL FOR ADD DATE
  const openModalDate = () => {
    history.push('../scheduleVisit/addDate');
    setHideModal(false);
    handleSetModal({
      state: true,
      small: true,
      component: <ScheduleVisitComponent />,
      title: 'Add date',
      titleTop: true,
      hideClose: true,
      onClose: () => closeModalDate(),
      className: 'schedule-visit-modal',
      multiActions: [
        {
          round: true,
          clr: 'primary',
          btnType: 'Tertiary',
          name: translateTo('Cancel', lang),
          className: 'ml-0',
          func: () => closeModalDate(),
        },
        {
          round: true,
          clr: 'text',
          className: 'mr-2',
          btnType: 'Primary',
          name: translateTo('Add date', lang),
          rightIcon: 'calendar',
          disabled: true,
          func: () => storeDate(),
        },
      ],
    });
  };

  // INIT FORM
  useEffect(() => {
    if (activeSingleProperty.id && activeSingleDeal.id) {
      initForm(initialValues);
    }
  }, [activeSingleProperty.id, loggedInUser.id, activeSingleDeal.id]);

  // OPEN MODAL FOR ADD DATE BY ROUTE
  useEffect(() => {
    if (isNewDate) {
      openModalDate();
    }
  }, [isNewDate]);

  // SAVE FUNCTION
  const saveData = () => {
    const data = {
      data: {
        deal: formValue.deal,
        buyerAvailability: formValue.scheduleVisits,
        buyerMessage: formValue.message,
      },
      smallLoader: 'sendData',
    };
    hanldeSaveScheduleVisit(data);
  };

  // REMOVE VISIT ON CREATEION MODE
  const removeVisit = (index: number) => {
    const schuduleVisits: ScheduleVisitSlotType[] = get(formValue, 'scheduleVisits', []);
    schuduleVisits.splice(index, 1);
    changeFieldValue('scheduleVisits', schuduleVisits);
  };

  // FUNCTION TO FORMAT DATA FOR ADD TO CALENDAR
  const formatCalendar = (type) => {
    switch (type) {
      case 'location': {
        if (activeSingleProperty.location) {
          return `${activeSingleProperty.location.name}, ${activeSingleProperty.location.streetNumber} ${activeSingleProperty.location.zip} ${activeSingleProperty.location.city}`;
        }
        break;
      }
      case 'start': {
        if (activeScheduleVisit?.visit?.date) {
          const date = DateTime.fromMillis(activeScheduleVisit?.visit?.date).toFormat('yyyy-LL-dd', {locale: lang});
          const start = DateTime.fromMillis(activeScheduleVisit?.visit?.date).toFormat('HH:mm', {locale: lang});
          return `${date}T${start}`;
        }
        break;
      }
      case 'end': {
        if (activeScheduleVisit?.visit?.date) {
          const date = DateTime.fromMillis(activeScheduleVisit?.visit?.date).toFormat('yyyy-LL-dd', {locale: lang});
          const end = DateTime.fromMillis(activeScheduleVisit?.visit?.date).plus({minutes: 24*60}).toFormat('HH:mm', {locale: lang});
          return `${date}T${end}`;
        }
        break;
      }
    }
  }

  return (
    <div className="rewards-container" id="rewardsDashboard">

      <div>
        <h4 className="mb-1 hide dis-b-lg fweight-600">
          {translateTo('Visit', lang)}
        </h4>
        <p className="max-w-fix-416 mb-3">
          {translateTo('You can add up to 3 availability dates to let the property owner know when you\'re available to visit.', lang)}
        </p>
      </div>
      {/* CONDITION TO SHOW DATA ONLY AFTER API CALL */}
      {
        !activeScheduleVisits ? (
          <div>
            Loading...
          </div>
        ) : (
          <>
            {/* SAVED SUCCESS MESSAGE */}
            {
              isSmallLoading.sendData === 'saved' && (
                <div className="bgGreen100 brdRadius px-4 pt-4 mb-4 dis-f a-b jc-b ov-h">
                  <div className="mb-4">
                    <h4 className="txtGreen400 mb-2">
                      {translateTo('Thank you for your request!', lang)}
                    </h4>
                    <p>
                      {translateTo('We will contact you shortly to confirm your visit.', lang)}
                    </p>
                  </div>
                  <img
                    className=""
                    src={PropertyVisitImg}
                    alt="Visit Requested"
                  />
                </div>
              )
            }

            {
              (activeScheduleVisit?.buyerAvailability && !activeScheduleVisit?.visit?.date) && (
                <div className="bgWhite brdRadius px-4 pt-4 mb-4 dis-f a-b jc-b ov-h">
                  <div className="mb-4">
                    <BrixelSingleTag
                      className="mb-2"
                      lang={lang}
                      message={{
                        lang: lang,
                        pending: 'Pending',
                      }}
                      status="pending"
                      text="Pending"
                    />
                    <h4 className="mb-2">
                      {translateTo('Thank you for your request!', lang)}
                    </h4>
                    <p className="max-w-fix-520">
                      {translateTo('Your availability dates have been sent to the property owner.\n' +
                        'They will be notified in real-time and the visit date will be confirmed soon.', lang)}
                    </p>
                  </div>
                  <img
                    className=""
                    src={PropertyVisitImg}
                    alt="Visit Requested"
                  />
                </div>
              )
            }

            {
              SectionPage === 'confirmed' && activeScheduleVisit && (
                <>
                  <div className="bgGreen50 brdRadius px-4 pt-4">
                    <div className="dis-f jc-b a-b">
                      <div className="mb-4">
                        <BrixelSingleTag
                          className="mb-2"
                          lang={lang}
                          message={{
                            lang: lang,
                            accepted: 'Visit confirmed',
                          }}
                          status="accepted"
                          text="Visit confirmed"
                        />


                        <h5 className="mb-1">Your visit is confirmed!</h5>

                        <h4 className="txtGreen400">
                          <span>
                            {DateTime.fromMillis(activeScheduleVisit.visit.date).toFormat('dd MMM yyyy', {locale: lang})}
                          </span>
                          <span className="mr-small-4">,</span>
                          <span>
                            {DateTime.fromMillis(activeScheduleVisit.visit.date, { locale: lang }).toFormat('HH:mm')}
                          </span>
                        </h4>
                      </div>

                      <img
                        src={PropertyconfirmedVisitImg}
                        alt="Confirmed Visit"
                      />
                    </div>
                  </div>

                  <div className="mt-4 dis-f jc-fe">
                    <AddToCalendar
                      lang={lang}
                      timestamp={activeScheduleVisit.visit.date}
                      title={translateTo(`Visit ${activeSingleProperty.title}`, lang)}
                      location={formatCalendar('location')}
                    />
                  </div>
                </>
              )
            }

            {
              SectionPage === 'buyerRequest' && (
                <div className="dis-f jc-b">
                  <div className="w-perc-49">
                    <h6 className="mb-2">
                      {translateTo('Your suggested dates', lang)}
                    </h6>
                    <div className="brdRadius bgWhite p-4 h-perc-90">
                      {/* IF EXIST BUYER AVAILABILITY DATE */}
                      {
                        activeScheduleVisit?.buyerAvailability && activeScheduleVisit.buyerAvailability.map((visit, i) => (
                          <div
                            key={`visit${i.toString()}`}
                            className="mb-4 dis-f jc-b brdSmallBottom brdText100 pb-4"
                          >
                            <div>
                              <span
                                className="bgBlue50 txtBlue700 p-1 brdRadius mr-2"
                              >
                                {DateTime.fromMillis(visit.start).toFormat('dd MMM yyyy', {locale: lang})}
                              </span>
                              <span>
                                {DateTime.fromMillis(visit.start, { locale: lang }).toFormat('HH:mm')}
                              </span>
                              <span className="mx-1">-</span>
                              <span>
                                {DateTime.fromMillis(visit.end, { locale: lang }).toFormat('HH:mm')}
                              </span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div className="w-perc-49">
                    <h6 className="mb-2">
                      {translateTo('Leave a message for the seller', lang)}
                    </h6>
                    <div className="brdRadius bgWhite p-4 h-perc-90">
                      {
                        activeScheduleVisit?.buyerMessage && (
                          <div>
                            <h6>
                              {translateTo('Your message for the seller', lang)}
                            </h6>
                            <p className="tt">
                              {activeScheduleVisit.buyerMessage}
                            </p>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              )
            }


            {
              SectionPage === 'create' && (
                <>
                  {/* ADD NEW DATE */}
                  {
                    formValue?.scheduleVisits && formValue.scheduleVisits.length > 0 ? (
                      <>
                        <div className="dis-f jc-b">
                          <div className="w-perc-49">
                            <h6 className="mb-2">
                              {translateTo('Your suggested dates', lang)}
                            </h6>
                            <div className="brdRadius bgWhite p-4 p-4 h-perc-90">
                              {
                                formValue.scheduleVisits.map((visit, i) => (
                                  <div
                                    key={`visit${i.toString()}`}
                                    className="mb-4 dis-f jc-b brdSmallBottom brdText100 pb-4"
                                  >
                                    <div>
                                      <span
                                        className="bgBlue50 txtBlue700 p-1 brdRadius mr-2"
                                      >
                                        {DateTime.fromMillis(visit.start).toFormat('dd MMM yyyy', {locale: lang})}
                                      </span>
                                      <span>
                                        {DateTime.fromMillis(visit.start, { locale: lang }).toFormat('HH:mm')}
                                      </span>
                                      <span className="mx-1">-</span>
                                      <span>
                                        {DateTime.fromMillis(visit.end, { locale: lang }).toFormat('HH:mm')}
                                      </span>
                                    </div>
                                    <div>
                                      <BrixelIcon
                                        color="red"
                                        icon="bin"
                                        onClick={() => removeVisit(i)}
                                      />
                                    </div>
                                  </div>
                                ))
                              }
                              <BrixelButtonSecondary
                                rounded
                                disabled={formValue.scheduleVisits.length >= 3}
                                bgTransparent
                                label="Add new date"
                                leftIcon="plus"
                                onClick={() => openModalDate()}
                              />
                            </div>
                          </div>
                          <div className="w-perc-49">
                            <h6 className="mb-2">
                              {translateTo('Leave a message for the seller', lang)}
                            </h6>
                            <div className="brdRadius bgWhite p-4 h-perc-90">
                              <BrixelTextArea
                                className="h-perc-100"
                                large
                                input={{
                                  name: 'message',
                                  value: formValue.message,
                                  onChange: (val) => changeFieldValue('message', val),
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="dis-f jc-fe">
                          <BrixelButtonPrimary
                            rounded
                            className="mr-0 mt-4"
                            label="Send request"
                            isLoading={isSmallLoading.sendData === true}
                            rightIcon="send"
                            onClick={() => saveData()}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        {/* EMPTY STATE*/}

                        <div className="ta-c bgWhite brdRadius p-4">
                          <img src={Calendar} alt="Calendar" />
                          <h5 className="mb-2">
                            {translateTo('No availability dates added.', lang)}
                          </h5>
                          <p className="max-w-fix-440 mx-a">
                            {translateTo('Tell us when you would be available to visit your favorite property. The property owner will be informed in real time of your request.', lang)}
                          </p>
                          <BrixelButtonPrimary
                            className="mt-3 mx-a"
                            rounded
                            label="Add dates"
                            rightIcon="plus"
                            onClick={() => openModalDate()}
                          />

                        </div>
                      </div>
                    )
                  }
                </>
              )
            }

          </>
        )
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  const initialValues = {
    ...get(state, 'deal.scheduleVisit[0]', []),
    scheduleVisits: [
      {
        'end': 1685041200000,
        'start': 1684998000000,
        'isAllDay': false,
        'timezone': 'Europe/Lisbon',
      },
    ],
    deal: get(state, 'deal.activeSingleDeal.id', null),
  };
  return ({
    activeScheduleVisit: get(state, 'deal.scheduleVisit[0]', {}),
    activeScheduleVisits: get(state, 'deal.scheduleVisit', null),
    activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    errorValue: get(state, 'brixelForm.ScheduleVisit.syncErrors', {}),
    formValue: get(state, 'brixelForm.ScheduleVisit.values', {}),
    initialValues,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    modalData: get(state, 'common.modal', {}),
    translations: get(state, 'common.translation', {}),
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('ScheduleVisit', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('ScheduleVisit', value));
  },
  hanldeSaveScheduleVisit: bindActionCreators(saveScheduleVisit, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ScheduleVisit);
