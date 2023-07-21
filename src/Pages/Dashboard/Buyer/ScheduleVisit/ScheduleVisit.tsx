import React, {useEffect, useState} from 'react';
import {
  change,
  initializeForm,
  BrixelTextArea, destroy,
} from '@brixel-io/brixel-components/dist/form';
import {
  Helpers,
  AddToCalendar,
  BrixelButtonPrimary,
  BrixelIcon,
} from '@brixel-io/brixel-components';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {setModal} from '../../../../actions/CommonActions';
import {saveScheduleVisit, setScheduleVisit} from '../../../../actions/PropertyActions';
import ScheduleVisitComponent from './ScheduleVisitDateModal';
import translateTo from '../../../../utils/translation';
import Calendar from '../../../../images/dashboard/calendarState.svg';
import type {ScheduleVisitType} from '../../../../@types/Pages/Dashboard/Buyer/ScheduleVisit';
import {ScheduleVisitSlotType} from '@brixel-io/brixel-components/dist/@types/Model';
import {DateTime} from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import PropertyPendingImg from '../../../../images/dashboard/PropertyPendingVisit.svg';
import PropertyconfirmedVisit2Img from '../../../../images/dashboard/PropertyConfimedVisit2.svg';
import PropertyVisitedImg from '../../../../images/dashboard/propertyVisited.svg';
import PropertyCanceledImg from '../../../../images/dashboard/scheduleCanceled.svg';
import isEmpty from 'lodash/isEmpty';
import BrixelSingleTag from '@brixel-io/brixel-components/dist/components/BrixelSingleTag';
import SectionMobileTitle from '../../../../components/SectionMobileTitle';

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
    destroyForm,
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
  const [SectionPage, setSectionPage] = useState<'confirmed' | 'buyerRequest' | 'create' | 'rejected'>('create');
  const [activeModalID, setActiveModalID] = useState(-1);
  const [openedModal, setOpenedModal] = useState(false);
  const [visitStatus, setVisitStatus] = useState<{status: string; text: string; color: string;bg: string;}>();

  const lastPart = history.location.pathname.split('/').filter(e => e).slice(-1);
  const isNewDate = lastPart[0] === 'addDate';

  useEffect(() => {
    return () => {
      destroyForm();
    }
  }, []);


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
    setSectionPage('create');
    const schuduleVisits: ScheduleVisitSlotType[] = get(formValue, 'scheduleVisits', []);
    if (activeModalID > -1) {
      schuduleVisits[activeModalID] = formValue.scheduleVisit
    } else {
      schuduleVisits.push(formValue.scheduleVisit)
    }
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
    if (activeScheduleVisit?.visit?.date && activeScheduleVisit?.sellerStatus === 'accepted' && activeScheduleVisit?.buyerStatus === 'accepted') setSectionPage('confirmed');
    if (activeScheduleVisit?.sellerStatus === 'rejected' || activeScheduleVisit?.buyerStatus === 'rejected') setSectionPage('rejected');
    setVisitStatus(Helpers.visitDateStatus(activeScheduleVisit))
  }, [activeScheduleVisit]);


  // OPEN MODAL FOR ADD DATE
  const openModalDate = (index = -1) => {
    setActiveModalID(index);
    history.push('../scheduleVisit/addDate');
    setHideModal(false);
    handleSetModal({
      state: true,
      small: true,
      layout: 'large',
      component: <ScheduleVisitComponent formValue={formValue?.scheduleVisits ? formValue?.scheduleVisits[index] : undefined} />,
      title: translateTo(index > -1 ? 'Edit date' : 'Add date', lang),
      titleTop: true,
      titleTopClass: 'py-1 py-sm-2 fweight-600 fsize-500 fsize-md-600 brdSmallBottom brdText100 ta-c',
      hideClose: true,
      onClose: () => closeModalDate(),
      className: 'schedule-visit-modal',
      multiActions: [
        {
          round: true,
          clr: 'Text',
          sat: 800,
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
          name: translateTo('Save', lang),
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
    if (isNewDate && activeScheduleVisits && !openedModal) {
      if ((!activeScheduleVisit?.buyerAvailability && !activeScheduleVisit?.visit?.date && !activeModalID && activeModalID !== 0) || (activeScheduleVisit?.visit?.date && activeScheduleVisit?.visit?.date < new Date().valueOf()) || (activeScheduleVisit?.sellerStatus === 'rejected' || activeScheduleVisit?.buyerStatus === 'rejected')) {
        openModalDate();
        setOpenedModal(true);
      }
    }
  }, [isNewDate, activeScheduleVisits]);

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
    <div className="rewards-container max-w-fix-1280" id="rewardsDashboard">

      <div>
        <h3 className="hide dis-b-lg fweight-600 mb-1">
          {translateTo('Visit', lang)}
        </h3>
        <SectionMobileTitle
          title="Visit"
        />
      </div>
      {/* CONDITION TO SHOW DATA ONLY AFTER API CALL */}
      {
        !activeScheduleVisits ? (
          <div className="bgWhite brdRadius shadow-1dp py-3 py-sm-5 px-2 px-sm-4">
            <div className="skeletonh4" />
            <div className="skeletonSmall mt-2" />
            <div className="skeletonSmall mt-2" />
          </div>
        ) : (
          <>
            {/* SAVED SUCCESS MESSAGE */}

            {
              visitStatus?.status === 'pending' && activeScheduleVisit?.buyerAvailability && activeScheduleVisit?.buyerAvailability.length > 0 && (
                <div className="bgWhite brdRadius shadow-1dp mb-4 a-c py-3 py-sm-5 px-2 px-sm-4 dis-fl-col-rev dis-fl-row-sm">

                  <div className="mb-4">
                    <BrixelSingleTag
                      className="mb-2"
                      lang={lang}
                      message={{
                        lang: lang,
                        pending: translateTo('Pending', lang),
                      }}
                      status="pending"
                      text={translateTo('Pending', lang)}
                    />
                    <h5 className="fweight-600 mb-2">
                      {translateTo('Thank you for your request!', lang)}
                    </h5>
                    <p className='txtText600 max-w-perc-sm-80'>
                      {translateTo('Your suggested dates have been sent. Our team will contact you shortly to clarify any questions and to proceed with the next steps.', lang)}
                    </p>
                  </div>
                  <img
                    className="ml-a h-fix-120 h-fix-sm-160"
                    src={PropertyPendingImg}
                    alt="Visit Requested"
                  />
                </div>
              )
            }

            {
              visitStatus?.status === 'cancelled' && (!formValue?.scheduleVisits || (formValue?.scheduleVisits && formValue.scheduleVisits.length === 0)) && (
                <>
                  <div className="bgRed50 brdRadius shadow-1dp mb-4 a-c py-3 py-sm-5 px-2 px-sm-4 dis-fl-col-rev dis-fl-row-sm">

                    <div className="mb-4">
                      <BrixelSingleTag
                        className="mb-2"
                        lang={lang}
                        message={{
                          lang: lang,
                          rejected: translateTo('Cancelled', lang),
                        }}
                        status="rejected"
                        text={translateTo('Pending', lang)}
                      />
                      <h5 className="fweight-600 mb-2">
                        {translateTo('Your visit has been cancelled', lang)}
                      </h5>
                      <p className='txtText600 max-w-perc-sm-80'>
                        {translateTo('Please contact our team for more details. If you are still interested, you can request another visit.', lang)}
                      </p>
                    </div>
                    <img
                      className="ml-a h-fix-120 h-fix-sm-160"
                      src={PropertyCanceledImg}
                      alt="Visit Requested"
                    />
                  </div>
                  <div className="mt-4 dis-f jc-fe">
                    <BrixelButtonPrimary
                      rounded
                      label={translateTo('Request new visit', lang)}
                      leftIcon="plus"
                      onClick={() => openModalDate()}
                    />
                  </div>
                </>
              )
            }

            {
              visitStatus?.status === 'accepted' && activeScheduleVisit && (
                <>
                  {
                    // CONFIRMED VISIT IN THE FUTURE
                    activeScheduleVisit.visit.date > new Date().valueOf() ? (
                      <>
                        <div className="bgGreen50 brdRadius shadow-1dp mb-4 a-c py-3 py-sm-5 px-2 px-sm-4">
                          <div className="dis-fl-col-rev dis-fl-row-sm">
                            <div className="">
                              <BrixelSingleTag
                                className="mb-2"
                                lang={lang}
                                message={{
                                  lang: lang,
                                  accepted: translateTo('Visit confirmed', lang),
                                }}
                                status="accepted"
                                text={translateTo('Visit confirmed', lang)}
                              />
                              <h4 className="fweight-600 mb-2 txtPrimary400">
                                <span>
                                  {DateTime.fromMillis(activeScheduleVisit.visit.date).toFormat('dd MMM yyyy', {locale: lang})}
                                </span>
                                <span className="mr-small-4">,</span>
                                <span>
                                  {DateTime.fromMillis(activeScheduleVisit.visit.date, { locale: lang }).toFormat('HH:mm')}
                                </span>
                              </h4>
                              <p className='txtText700'>
                                {translateTo('Great news! Your visit has been confirmed.', lang)}
                              </p>
                            </div>

                            <img
                              src={PropertyconfirmedVisit2Img}
                              alt="Confirmed Visit"
                              className="ml-a h-fix-96 h-fix-sm-140"
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
                        {/* CONFIRMED VISIT IN THE PAST */}
                        <div className="bgBlue50 brdRadius shadow-1dp mb-4 a-c py-3 py-sm-5 px-2 px-sm-4">
                          <div className="dis-fl-col-rev dis-fl-row-sm">
                            <div className="">
                              <BrixelSingleTag
                                className="mb-2"
                                lang={lang}
                                message={{
                                  lang: lang,
                                  visited: translateTo('Visited', lang),
                                }}
                                status="visited"
                                text={translateTo('Visited', lang)}
                              />
                              <h4 className="fweight-600 mb-2">
                                <span>
                                  {translateTo('You visited the property', lang)}
                                </span>
                              </h4>
                              <p className='txtText700'>
                                {translateTo('We hope you had a great experience.', lang)}
                              </p>
                            </div>

                            <img
                              src={PropertyVisitedImg}
                              alt="Property Visited"
                              className="ml-a h-fix-120"
                            />
                          </div>
                        </div>

                        <div className="mt-4 dis-f jc-fe">
                          <BrixelButtonSecondary
                            rounded
                            bgTransparent
                            label={translateTo('Add new dates', lang)}
                            leftIcon="plus"
                            onClick={() => openModalDate()}
                          />
                        </div>
                      </>
                    )
                  }

                </>

              )
            }

            {
              SectionPage === 'buyerRequest' && (
                <div className="dis-fl-col dis-fl-row-md jc-b mt-1">
                  {
                    activeScheduleVisit && activeScheduleVisit?.buyerAvailability.length > 0 && (
                      <div className="w-perc-md-50 mr-sm-1">
                        <h6 className="mb-2 fweight-600">
                          {translateTo('Your suggested dates', lang)}
                        </h6>
                        <div className="brdRadius bgWhite p-2 p-sm-4 shadow-1dp h-perc-90">
                          {/* IF EXIST BUYER AVAILABILITY DATE */}
                          {
                            activeScheduleVisit.buyerAvailability.map((visit, i, arr) => (
                              <div
                                key={`visit${i.toString()}`}
                                className={`dis-f jc-b a-c  ${i === arr.length - 1 ? '' : 'brdSmallBottom brdText100 pb-2 mb-2'}`}
                              >
                                <div className='dis-f a-c'>
                                  <span
                                    className="bgBlue50 txtBlue700 fweight-600 py-1 px-2 brdRadius mr-2 dis-ib"
                                  >
                                    {DateTime.fromMillis(visit.start).toFormat('dd MMM yyyy', {locale: lang})}
                                  </span>
                                  {
                                    visit.isAllDay ? (
                                      <div className="txtBlue700">
                                        <p className='txtBlue700'>
                                          {translateTo('All day', lang)}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="txtBlue700">
                                        <span>
                                          {DateTime.fromMillis(visit.start, { locale: lang }).toFormat('HH:mm')}
                                        </span>
                                        <span className="mx-1">-</span>
                                        <span>
                                          {DateTime.fromMillis(visit.end, { locale: lang }).toFormat('HH:mm')}
                                        </span>
                                      </div>
                                    )
                                  }
                                </div>
                              </div>
                            ))
                          }

                        </div>
                      </div>
                    )
                  }
                  {
                    activeScheduleVisit?.buyerMessage && (
                      <div className="w-perc-md-50 ml-sm-1">
                        <h6 className="mt-3 mt-sm-0 mb-2 fweight-600">
                          {translateTo('Your message for the seller', lang)}
                        </h6>
                        <div className="brdRadius bgWhite p-2 p-sm-4 shadow-1dp h-perc-90">

                          <div>
                            <p className="fs-i fsize-500 txtText700">
                              {activeScheduleVisit.buyerMessage}
                            </p>
                          </div>

                        </div>
                      </div>
                    )
                  }
                </div>
              )
            }


            {
              (SectionPage === 'create') && (
                <>
                  {/* ADD NEW DATE */}
                  {
                    formValue?.scheduleVisits && formValue.scheduleVisits.length > 0 ? (
                      <>
                        <div className="dis-fl-col dis-fl-row-md jc-b">
                          <div className="w-perc-md-50 mr-sm-1">
                            <h6 className="mb-2 fweight-600">
                              {translateTo('Your suggested dates', lang)}
                            </h6>
                            <div className="brdRadius shadow-1dp bgWhite p-2 p-sm-4 h-perc-90">
                              {
                                formValue.scheduleVisits.map((visit, i) => (
                                  <div
                                    key={`visit${i.toString()}`}
                                    className="dis-f jc-b brdSmallBottom brdText100 pb-2 a-c mb-2"
                                  >
                                    <div className='dis-f a-c'>
                                      <span
                                        className="bgBlue50 txtBlue700 fweight-600 py-1 px-2 brdRadius mr-2 dis-ib"
                                      >

                                        {DateTime.fromMillis(visit.start).toFormat('dd MMM yyyy', {locale: lang})}
                                      </span>
                                      {
                                        visit.isAllDay ? (
                                          <div className="txtBlue700">
                                            <p className='txtBlue700'>
                                              {translateTo('All day', lang)}
                                            </p>
                                          </div>
                                        ) : (
                                          <div className="txtBlue700">
                                            <span>
                                              {DateTime.fromMillis(visit.start, { locale: lang }).toFormat('HH:mm')}
                                            </span>
                                            <span className="mx-1">-</span>
                                            <span>
                                              {DateTime.fromMillis(visit.end, { locale: lang }).toFormat('HH:mm')}
                                            </span>
                                          </div>
                                        )
                                      }
                                    </div>
                                    <div>
                                      <BrixelIcon
                                        className="mr-2"
                                        color="green"
                                        icon="edit"
                                        onClick={() => openModalDate(i)}
                                      />
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
                                label={translateTo('Add new date', lang)}
                                leftIcon="plus"
                                className='mt-4'
                                onClick={() => openModalDate()}
                              />
                            </div>
                          </div>
                          <div className="w-perc-md-50 ml-sm-1">
                            <h6 className="mb-2 mt-3 mt-sm-0 fweight-600">
                              {translateTo('Leave a message for the seller', lang)}
                            </h6>
                            <div className="brdRadius bgWhite shadow-1dp p-2 p-sm-4 h-perc-90">
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
                            label={translateTo('Send request', lang)}
                            isLoading={isSmallLoading.sendData === true}
                            rightIcon="send"
                            onClick={() => saveData()}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        {/* EMPTY STATE*/}

                        <div className="ta-c shadow-1dp bgWhite brdRadius p-4">
                          <img src={Calendar} alt="Calendar" />
                          <h5 className="mb-2 fweight-600">
                            {translateTo('No dates yet', lang)}
                          </h5>
                          <p className="max-w-fix-440 mx-a txtText600">
                            {translateTo('Add your availability to visit the property.', lang)}
                          </p>
                          <p className="max-w-fix-440 mx-a txtText600 mt-1">
                            {translateTo('You can add up to 3 dates. The property owner will be informed in real time of your request.', lang)}
                          </p>
                          <BrixelButtonPrimary
                            className="mt-3 mx-a"
                            rounded
                            label={translateTo('Add dates', lang)}
                            leftIcon="plus"
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
  destroyForm() {
    dispatch(destroy('ScheduleVisit'));
  },
  hanldeSaveScheduleVisit: bindActionCreators(saveScheduleVisit, dispatch),
  hanldeSetScheduleVisit: bindActionCreators(setScheduleVisit, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ScheduleVisit);
