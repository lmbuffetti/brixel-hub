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

const ScheduleVisit = (props: ScheduleVisitType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    activeScheduleVisit,
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

  const lastPart = history.location.pathname.split('/').filter(e => e).slice(-1);
  const isNewDate = lastPart[0] === 'addDate';

  useEffect(() => {
    if (!isEmpty(lastPart[0]) && lastPart[0] !== 'scheduleVisit' && lastPart[0] !== 'addDate') {
      history.push('../scheduleVisit');
    }
  }, [lastPart]);


  const closeModalDate = () => {
    history.push('../scheduleVisit');
    handleSetModal({});
  };

  const storeDate = () => {
    const schuduleVisits: ScheduleVisitSlotType[] = get(formValue, 'scheduleVisits', []);
    schuduleVisits.push(formValue.scheduleVisit)
    changeFieldValue('scheduleVisits', schuduleVisits);
    handleSetModal({});
    setHideModal(true);
  }
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

  const openModalDate = () => {
    history.push('../scheduleVisit/addDate');
    setHideModal(false);
    handleSetModal({
      state: true,
      small: true,
      component: <ScheduleVisitComponent onClick={() => ''} />,
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

  useEffect(() => {
    if (activeSingleProperty.id && activeSingleDeal.id) {
      initForm(initialValues);
    }
  }, [activeSingleProperty.id, loggedInUser.id, activeSingleDeal.id]);

  useEffect(() => {
    if (isNewDate) {
      openModalDate();
    }
  }, [isNewDate]);


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

  const removeVisit = (index: number) => {
    const schuduleVisits: ScheduleVisitSlotType[] = get(formValue, 'scheduleVisits', []);
    schuduleVisits.splice(index, 1);
    changeFieldValue('scheduleVisits', schuduleVisits);
  };

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
        <h4 className="mb-3 hide dis-b-lg fweight-600">
          Visit
        </h4>
      </div>

      {
        (activeScheduleVisit?.visit?.date) ? (
          <>
            <div className="bgGreen100 brdRadius px-4 pt-4">
              <div className="dis-f jc-b a-b">
                <div className="mb-4">
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
        ) : (
          <>
            {/* IF NOT EXIST ANY CONFIRMATION DATE */}
            {
              activeScheduleVisit?.buyerAvailability ? (
                <div className="brdRadius bgWhite p-4">
                  {/* IF EXIST BUYER AVAILABILITY DATE */}
                  {
                    activeScheduleVisit.buyerAvailability.map((visit, i) => (
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
                  <div>
                    <h6>
                      {translateTo('Your message for the seller', lang)}
                    </h6>
                    <p>
                      {activeScheduleVisit.buyerMessage}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* ADD NEW DATE */}
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
                    formValue?.scheduleVisits && formValue.scheduleVisits.length > 0 ? (
                      <>
                        <div className="brdRadius bgWhite p-4">
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


                        <div className="brdRadius bgWhite p-4 mt-4">
                          <BrixelTextArea
                            input={{
                              name: 'message',
                              value: formValue.message,
                              onChange: (val) => changeFieldValue('message', val),
                            }}
                            label="Leave a message for the seller"
                          />
                        </div>

                        <div className="dis-f jc-fe">
                          <BrixelButtonPrimary
                            rounded
                            className="mr-0 mt-4"
                            label="Send request"
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
                          <h5>{translateTo('No availability dates added.', lang)}</h5>
                          <p className="max-width-440 mx-a">
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

                        <BrixelButtonPrimary
                          className="mt-3 mr-0"
                          rounded
                          label="Save"
                          rightIcon="arrow-right"
                          onClick={() => saveData()}
                          isLoading={isSmallLoading.sendData === true}
                        />
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
    ...get(state, 'deal.scheduleVisitData', []),
    deal: get(state, 'deal.activeSingleDeal.id', null),
    scheduleVisits: [
      {
        'end': 1685300400000,
        'start': 1685257200000,
        'isAllDay': false,
        'timezone': 'Europe/Lisbon',
      },
      {
        'end': 1685559600000,
        'start': 1685516400000,
        'isAllDay': false,
        'timezone': 'Europe/Lisbon',
      },
    ],
  };
  return ({
    activeScheduleVisit: get(state, 'deal.scheduleVisitData[0]', {}),
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
