import React, { useEffect, useState } from 'react';
import { change, initializeForm, BrixelTextArea, destroy, } from '@brixel-io/brixel-components/dist/form';
import { Helpers, AddToCalendar, BrixelButtonPrimary, BrixelIcon, } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setModal, spinnerSmall } from '../../../../actions/CommonActions';
import { saveScheduleVisit, setScheduleVisit } from '../../../../actions/PropertyActions';
import ScheduleVisitComponent from './ScheduleVisitDateModal';
import translateTo from '../../../../utils/translation';
import Calendar from '../../../../images/dashboard/calendarState.svg';
import { DateTime } from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import PropertyPendingImg from '../../../../images/dashboard/PropertyPendingVisit.svg';
import PropertyconfirmedVisit2Img from '../../../../images/dashboard/PropertyConfimedVisit2.svg';
import PropertyVisitedImg from '../../../../images/dashboard/propertyVisited.svg';
import PropertyCanceledImg from '../../../../images/dashboard/scheduleCanceled.svg';
import BrixelSingleTag from '@brixel-io/brixel-components/dist/components/BrixelSingleTag';
import SectionMobileTitle from '../../../../components/SectionMobileTitle';
const ScheduleVisit = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { activeScheduleVisit, activeScheduleVisits, activeSingleDeal, activeSingleProperty, changeFieldValue, destroyForm, formValue, handleSetModal, handleSetSpinner, hanldeSaveScheduleVisit, initForm, initialValues, isSmallLoading, lang, loggedInUser, modalData, } = props;
    // STATE
    const [hideModale, setHideModal] = useState(false);
    const [SectionPage, setSectionPage] = useState('create');
    const [activeModalID, setActiveModalID] = useState(-1);
    const [openedModal, setOpenedModal] = useState(false);
    const [visitStatus, setVisitStatus] = useState();
    const [isShowCompleteProfile, setIsShowCompleteProfile] = useState(true);
    const lastPart = history.location.pathname.split('/').filter(e => e).slice(-1);
    const isNewDate = lastPart[0] === 'addDate';
    useEffect(() => {
        return () => {
            destroyForm();
        };
    }, []);
    const closeModalDate = () => {
        history.push('../scheduleVisit');
        handleSetModal({});
    };
    // STORE CURRENT VISIT TO REDUX
    const storeDate = () => {
        setSectionPage('create');
        const schuduleVisits = get(formValue, 'scheduleVisits', []);
        if (activeModalID > -1) {
            schuduleVisits[activeModalID] = formValue.scheduleVisit;
        }
        else {
            schuduleVisits.push(formValue.scheduleVisit);
        }
        changeFieldValue('scheduleVisits', schuduleVisits);
        handleSetModal({});
        setHideModal(true);
    };
    // UPDATE MODAL ACTIONS (SAVE AND DISABLE BUTTONS
    useEffect(() => {
        if (modalData.multiActions && modalData.multiActions?.length > 0 && !hideModale) {
            handleSetModal({
                ...modalData,
                multiActions: [
                    { ...modalData.multiActions[0] },
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
        if (activeScheduleVisit?.buyerAvailability)
            setSectionPage('buyerRequest');
        if (activeScheduleVisit?.visit?.date && activeScheduleVisit?.sellerStatus === 'accepted' && activeScheduleVisit?.buyerStatus === 'accepted')
            setSectionPage('confirmed');
        if (activeScheduleVisit?.sellerStatus === 'rejected' || activeScheduleVisit?.buyerStatus === 'rejected')
            setSectionPage('rejected');
        setVisitStatus(Helpers.getDataByStatus(activeScheduleVisit));
        let isEnable = true;
        if (activeScheduleVisit?.buyerQualificationData) {
            Object.keys(activeScheduleVisit?.buyerQualificationData).forEach((key) => {
                if (typeof activeScheduleVisit?.buyerQualificationData[key] === 'string' && activeScheduleVisit?.buyerQualificationData[key]) {
                    isEnable = false;
                }
                if (typeof activeScheduleVisit?.buyerQualificationData[key] === 'object' && activeScheduleVisit?.buyerQualificationData[key].length > 0) {
                    isEnable = false;
                }
            });
        }
        setIsShowCompleteProfile(isEnable);
    }, [activeScheduleVisit?.id]);
    // OPEN MODAL FOR ADD DATE
    const openModalDate = (index = -1) => {
        setActiveModalID(index);
        history.push('../scheduleVisit/addDate');
        setHideModal(false);
        handleSetModal({
            state: true,
            small: true,
            layout: 'large',
            component: React.createElement(ScheduleVisitComponent, { formValue: formValue?.scheduleVisits ? formValue?.scheduleVisits[index] : undefined }),
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
    useEffect(() => {
        if (isSmallLoading.sendData === 'saved') {
            handleSetModal({
                state: true,
                small: true,
                layout: 'large',
                titleTopClass: 'fweight-600 fsize-600 p-0 px-sm-4 py-sm-4 px-2 py-2 a-bl',
                titleTop: true,
                classHeight: 'min-h-fix-sm-272',
                bodyClassColor: 'p-0 px-sm-4 px-2 pb-6',
                title: translateTo('Be the first to visit 🏡', lang),
                body: `<p>${translateTo('Take a moment to provide us with more details, and get ahead of other buyers. By completing your profile now, your visit will be scheduled faster.', lang)}</p>`,
                multiActions: [
                    {
                        round: true,
                        clr: 'Text',
                        sat: 800,
                        btnType: 'Tertiary',
                        name: translateTo('I\'ll do it later', lang),
                        className: 'mr-1',
                        func: () => handleSetModal({}),
                    },
                    {
                        round: true,
                        clr: 'text',
                        className: 'mr-2',
                        btnType: 'Primary',
                        name: translateTo('Let\'s start', lang),
                        func: () => {
                            handleSetModal({});
                            history.push(`/buyer/${activeSingleProperty.id}/scheduleVisit/${activeScheduleVisit?.id}/completeProfileFlow`);
                        },
                    },
                ],
            });
            handleSetSpinner({ sendData: false });
        }
    }, [isSmallLoading]);
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
    const removeVisit = (index) => {
        const schuduleVisits = get(formValue, 'scheduleVisits', []);
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
                    const date = DateTime.fromMillis(activeScheduleVisit?.visit?.date).toFormat('yyyy-LL-dd', { locale: lang });
                    const start = DateTime.fromMillis(activeScheduleVisit?.visit?.date).toFormat('HH:mm', { locale: lang });
                    return `${date}T${start}`;
                }
                break;
            }
            case 'end': {
                if (activeScheduleVisit?.visit?.date) {
                    const date = DateTime.fromMillis(activeScheduleVisit?.visit?.date).toFormat('yyyy-LL-dd', { locale: lang });
                    const end = DateTime.fromMillis(activeScheduleVisit?.visit?.date).plus({ minutes: 24 * 60 }).toFormat('HH:mm', { locale: lang });
                    return `${date}T${end}`;
                }
                break;
            }
        }
    };
    return (React.createElement("div", { className: "rewards-container max-w-fix-1280", id: "rewardsDashboard" },
        React.createElement("div", null,
            React.createElement("h3", { className: "hide dis-b-lg fweight-600 mb-1" }, translateTo('Visit', lang)),
            React.createElement(SectionMobileTitle, { title: "Visit" })),
        !activeScheduleVisits ? (React.createElement("div", { className: "bgWhite brdRadius shadow-1dp py-3 py-sm-5 px-2 px-sm-4" },
            React.createElement("div", { className: "skeletonh4" }),
            React.createElement("div", { className: "skeletonSmall mt-2" }),
            React.createElement("div", { className: "skeletonSmall mt-2" }))) : (React.createElement(React.Fragment, null,
            visitStatus?.status === 'pending' && activeScheduleVisit?.buyerAvailability && activeScheduleVisit?.buyerAvailability.length > 0 && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "bgWhite brdRadius shadow-1dp mb-4 a-t a-c-sm py-3 py-sm-5 px-2 px-sm-4 dis-fl-col-rev dis-fl-row-sm pos-r pos-r" },
                    React.createElement("div", { className: "mb-2 mb-sm-4" },
                        React.createElement(BrixelSingleTag, { className: "mb-2 flotingTag", lang: lang, message: {
                                lang: lang,
                                pending: translateTo('Pending', lang),
                            }, status: "pending", text: translateTo('Pending', lang) }),
                        React.createElement("h5", { className: "fweight-600 mb-1 mb-sm-2" }, translateTo('Thank you for your request!', lang)),
                        React.createElement("p", { className: 'txtText600 max-w-perc-sm-80' }, translateTo('Our team will contact you shortly to clarify any questions and to proceed with the next steps.', lang))),
                    React.createElement("img", { className: "ml-a-sm h-fix-64 h-fix-sm-160 mb-1 mb-sm-0", src: PropertyPendingImg, alt: "Visit Requested" })),
                isShowCompleteProfile && (React.createElement("div", { className: "bgGreen50 brdRadius shadow-1dp mb-4 a-t a-c-sm py-3 py-sm-5 px-2 px-sm-4 dis-fl-col dis-fl-row-sm jc-b" },
                    React.createElement("div", { className: "w-perc-100" },
                        React.createElement("h5", { className: "fweight-600 mb-1" }, translateTo('Be the first to visit 🏡', lang)),
                        React.createElement("p", { className: "txtText600 max-w-perc-sm-80" }, translateTo('Take a moment to provide us with more details, and get ahead of other buyers.', lang)),
                        React.createElement("p", { className: "txtText600 max-w-perc-sm-80" }, translateTo('By completing your profile now, your visit will be scheduled faster.', lang))),
                    React.createElement(BrixelButtonPrimary, { rounded: true, className: "ws-nw px-4 mt-2 mt-sm-0 w-perc-100 w-auto-sm", label: translateTo('Let\'s start', lang), onClick: () => history.push(`/buyer/${activeSingleProperty.id}/scheduleVisit/${activeScheduleVisit.id}/completeProfileFlow`) }))))),
            visitStatus?.status === 'cancelled' && (!formValue?.scheduleVisits || (formValue?.scheduleVisits && formValue.scheduleVisits.length === 0)) && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "bgRed50 brdRadius shadow-1dp mb-4 a-t a-c-sm py-3 py-sm-5 px-2 px-sm-4 dis-fl-col-rev dis-fl-row-sm pos-r" },
                    React.createElement("div", { className: "mb-2 mb-sm-4" },
                        React.createElement(BrixelSingleTag, { className: "mb-2 flotingTag", lang: lang, message: {
                                lang: lang,
                                rejected: translateTo('Cancelled', lang),
                            }, status: "rejected", text: translateTo('Pending', lang) }),
                        React.createElement("h5", { className: "fweight-600 mb-1 mb-sm-2" }, translateTo('Your visit has been cancelled', lang)),
                        React.createElement("p", { className: 'txtText600 max-w-perc-sm-80' }, translateTo('Please contact our team for more details. If you are still interested, you can request another visit.', lang))),
                    React.createElement("img", { className: "ml-a-sm h-fix-64 h-fix-sm-160 mb-1 mb-sm-0", src: PropertyCanceledImg, alt: "Visit Requested" })),
                React.createElement("div", { className: "mt-4 dis-f jc-fe" },
                    React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Request new visit', lang), leftIcon: "plus", onClick: () => openModalDate() })))),
            (visitStatus?.status === 'accepted' || visitStatus?.status === 'visited') && activeScheduleVisit && (React.createElement(React.Fragment, null, 
            // CONFIRMED VISIT IN THE FUTURE
            activeScheduleVisit?.visit?.date > new Date().valueOf() ? (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "bgGreen50 brdRadius shadow-1dp mb-4 a-t a-c-sm py-3 py-sm-5 px-2 px-sm-4 dis-fl-col-rev dis-fl-row-sm pos-r pos-r" },
                    React.createElement("div", { className: "mb-2 mb-sm-4" },
                        React.createElement(BrixelSingleTag, { className: "mb-2 flotingTag", lang: lang, message: {
                                lang: lang,
                                accepted: translateTo('Visit confirmed', lang),
                            }, status: "accepted", text: translateTo('Visit confirmed', lang) }),
                        React.createElement("h4", { className: "fweight-600 mb-1 mb-sm-2 txtPrimary400" },
                            React.createElement("span", null, DateTime.fromMillis(activeScheduleVisit?.visit?.date).toFormat('dd MMM yyyy', { locale: lang })),
                            React.createElement("span", { className: "mr-small-4" }, ","),
                            React.createElement("span", null, DateTime.fromMillis(activeScheduleVisit?.visit?.date, { locale: lang }).toFormat('HH:mm'))),
                        React.createElement("p", { className: 'txtText700' }, translateTo('Great news! Your visit has been confirmed.', lang))),
                    React.createElement("img", { src: PropertyconfirmedVisit2Img, alt: "Confirmed Visit", className: "ml-a-sm h-fix-64 h-fix-sm-160 mb-1 mb-sm-0" })),
                React.createElement("div", { className: "mt-4 dis-f jc-fe" },
                    React.createElement(AddToCalendar, { lang: lang, timestamp: activeScheduleVisit?.visit?.date, title: translateTo(`Visit ${activeSingleProperty.title}`, lang), location: formatCalendar('location') })))) : (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "bgBlue50 bbrdRadius shadow-1dp mb-4 a-t a-c-sm py-3 py-sm-5 px-2 px-sm-4 dis-fl-col-rev dis-fl-row-sm pos-r pos-r" },
                    React.createElement("div", { className: "mb-2 mb-sm-4" },
                        React.createElement(BrixelSingleTag, { className: "mb-2 flotingTag", lang: lang, message: {
                                lang: lang,
                                visited: translateTo('Visited', lang),
                            }, status: "visited", text: translateTo('Visited', lang) }),
                        React.createElement("h4", { className: "fweight-600 mb-1 mb-sm-2" },
                            React.createElement("span", null, translateTo('You visited the property', lang))),
                        React.createElement("p", { className: 'txtText700' }, translateTo('We hope you had a great experience.', lang))),
                    React.createElement("img", { src: PropertyVisitedImg, alt: "Property Visited", className: "ml-a-sm h-fix-64 h-fix-sm-160 mb-1 mb-sm-0" })),
                React.createElement("div", { className: "mt-4 dis-f jc-fe" },
                    React.createElement(BrixelButtonSecondary, { rounded: true, bgTransparent: true, label: translateTo('Add new dates', lang), leftIcon: "plus", onClick: () => openModalDate() })))))),
            (SectionPage === 'create') && (React.createElement(React.Fragment, null, formValue?.scheduleVisits && formValue.scheduleVisits.length > 0 ? (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "dis-fl-col dis-fl-row-md jc-b" },
                    React.createElement("div", { className: "w-perc-md-50 mr-sm-1" },
                        React.createElement("h6", { className: "mb-2 fweight-600" }, translateTo('Your suggested dates', lang)),
                        React.createElement("div", { className: "brdRadius shadow-1dp bgWhite p-2 p-sm-4 h-perc-90" },
                            formValue.scheduleVisits.map((visit, i) => (React.createElement("div", { key: `visit${i.toString()}`, className: "dis-f jc-b brdSmallBottom brdText100 pb-2 a-c mb-2" },
                                React.createElement("div", { className: 'dis-f a-c' },
                                    React.createElement("span", { className: "bgBlue50 txtBlue700 fweight-600 py-1 px-2 brdRadius mr-2 dis-ib" }, DateTime.fromMillis(visit.start).toFormat('dd MMM yyyy', { locale: lang })),
                                    visit.isAllDay ? (React.createElement("div", { className: "txtBlue700" },
                                        React.createElement("p", { className: 'txtBlue700' }, translateTo('All day', lang)))) : (React.createElement("div", { className: "txtBlue700" },
                                        React.createElement("span", null, DateTime.fromMillis(visit.start, { locale: lang }).toFormat('HH:mm')),
                                        React.createElement("span", { className: "mx-1" }, "-"),
                                        React.createElement("span", null, DateTime.fromMillis(visit.end, { locale: lang }).toFormat('HH:mm'))))),
                                React.createElement("div", null,
                                    React.createElement(BrixelIcon, { className: "mr-2", color: "green", icon: "edit", onClick: () => openModalDate(i) }),
                                    React.createElement(BrixelIcon, { color: "red", icon: "bin", onClick: () => removeVisit(i) }))))),
                            React.createElement(BrixelButtonSecondary, { rounded: true, disabled: formValue.scheduleVisits.length >= 3, bgTransparent: true, label: translateTo('Add new date', lang), leftIcon: "plus", className: 'mt-4', onClick: () => openModalDate() }))),
                    React.createElement("div", { className: "w-perc-md-50 ml-sm-1" },
                        React.createElement("h6", { className: "mb-2 mt-3 mt-sm-0 fweight-600" }, translateTo('Leave a message for the seller', lang)),
                        React.createElement("div", { className: "brdRadius bgWhite shadow-1dp p-2 p-sm-4 h-perc-90" },
                            React.createElement(BrixelTextArea, { className: "h-perc-100", large: true, input: {
                                    name: 'message',
                                    value: formValue.message,
                                    onChange: (val) => changeFieldValue('message', val),
                                } })))),
                React.createElement("div", { className: "dis-f jc-fe" },
                    React.createElement(BrixelButtonPrimary, { rounded: true, className: "mr-0 mt-4", label: translateTo('Send request', lang), isLoading: isSmallLoading.sendData === true, rightIcon: "send", onClick: () => saveData() })))) : (React.createElement("div", null,
                React.createElement("div", { className: "ta-c shadow-1dp bgWhite brdRadius p-4" },
                    React.createElement("img", { src: Calendar, alt: "Calendar" }),
                    React.createElement("h5", { className: "mb-2 fweight-600" }, translateTo('No dates yet', lang)),
                    React.createElement("p", { className: "max-w-fix-440 mx-a txtText600" }, translateTo('Add your availability to visit the property.', lang)),
                    React.createElement("p", { className: "max-w-fix-440 mx-a txtText600 mt-1" }, translateTo('You can add up to 3 dates. The property owner will be informed in real time of your request.', lang)),
                    React.createElement(BrixelButtonPrimary, { className: "mt-3 mx-a", rounded: true, label: translateTo('Add dates', lang), leftIcon: "plus", onClick: () => openModalDate() }))))))))));
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
    handleSetSpinner: bindActionCreators(spinnerSmall, dispatch),
    handleSetModal: bindActionCreators(setModal, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(ScheduleVisit);
