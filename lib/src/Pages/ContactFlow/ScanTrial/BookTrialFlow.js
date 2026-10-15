import React, { useEffect, useRef, useState } from 'react';
import { BrixelIcon, Helpers, useOutsideAlerter } from '@brixel-io/brixel-components';
import { BrixelInputDatePicker, BrixelInputPhone, BrixelInputText, change, ReduxField, Validation, } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Accordion from '../../../components/Accordion';
import PhoneIcon from '../../../images/Boutique/phoneIcon.svg';
import MessageIcon from '../../../images/Boutique/messageIcon.svg';
import MailIcon from '../../../images/Boutique/mailIcon.svg';
import translateTo from '../../../utils/translation';
const BookTrialFlow = (props) => {
    const { activeSingleCompany, changeFieldValue, formValue, lang, loggedInUser, showError, syncErrors, } = props;
    // STATE
    const [, setDate] = useState('');
    const [datePickerModal, setDatePickerModal] = useState(false);
    // REF
    const calendarRef = useRef(null);
    const datePicker = useRef(null);
    // COMPANY DATA
    const phone = get(activeSingleCompany, 'contact.phone', null);
    const [openAccordion, setOpenAccordion] = useState('online');
    useEffect(() => {
        if (get(formValue, 'analysis', '') === 'on-site')
            setOpenAccordion('online');
        else
            setOpenAccordion('whereby');
    }, [get(formValue, 'analysis', '')]);
    const handleChangeDate = (day) => {
        setDate(day);
        changeFieldValue('dateBook', DateTime.fromMillis(day, {
            locale: lang,
        }).toFormat('dd-LL-yyyy'));
        changeFieldValue('fullDate', DateTime.fromMillis(day, {
            locale: lang,
        }).toISO() || '');
    };
    useEffect(() => {
        let hourBook = get(formValue, 'hourBook', '');
        if (get(formValue, 'hourBook', null))
            hourBook = get(formValue, 'hourBook', '').replace(':', '');
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
    return (React.createElement("main", { id: "rewards", className: "BookTrialFlow pb-4 h-perc-100 txtText900" }, get(formValue, 'analysis', '') === 'on-site' ? (React.createElement(React.Fragment, null,
        React.createElement("h2", { className: "ta-c fweight-600 fsize-600 fsize-sm-800" }, translateTo('We are ready 🚀.', lang)),
        React.createElement("h2", { className: "mb-3 mb-sm-6 ta-c fweight-600 fsize-600 fsize-sm-800" }, translateTo('When do you want us to visit?', lang)),
        React.createElement("div", { className: "max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50" },
            React.createElement(Accordion, { color: "text", saturationTxt: 400, title: translateTo('Book online', lang), titleClass: "fsize-500 w-perc-100 jc-b py-3 px-2 px-sm-5", contentClass: "pb-3", paddingContent: "px-2 px-sm-5", singleItem: true, onExpand: (val) => setOpenAccordion(val === true ? 'online' : ''), isExpanded: openAccordion === 'online' },
                React.createElement("div", { className: "dis-f a-t w-perc-100" },
                    React.createElement("div", { className: "pos-r pr-1 w-perc-100 max-w-perc-50" },
                        React.createElement(ReduxField, { form: "scanFlow", ReduxFieldClass: "inputDate", ref1: datePicker, ref2: calendarRef, lang: get(lang, 'value', lang), component: BrixelInputDatePicker, design: {
                                showIconValidation: false,
                                large: true,
                            }, input: {
                                name: 'dateBook',
                                type: 'date',
                                maxDate: new Date(`${DateTime.now().year + 1}-12-31`),
                                minDate: new Date(`${DateTime.now().year}-${DateTime.now().month}-${DateTime.now().day + 1}`),
                                onChange: (val) => handleChangeDate(val),
                                validate: [Validation.required],
                            }, meta: {
                                invalid: get(syncErrors, 'dateBook', null) !== true,
                                dirty: get(syncErrors, 'dateBook', null) !== true,
                                showErrors: showError,
                                message: {
                                    error: translateTo('Please select a date', lang),
                                },
                            } })),
                    React.createElement("div", { className: "pos-r pl-1 w-perc-100 max-w-perc-50" },
                        React.createElement(ReduxField, { form: "scanFlow", ReduxFieldClass: "inputDate", component: BrixelInputText, input: {
                                name: 'hourBook',
                                placeholder: '08:00',
                                type: 'time',
                                validate: [Validation.required],
                            }, design: {
                                large: true,
                            }, inputFormat: {
                                formatType: 'date-hh:mm',
                            }, labels: {
                                label: '',
                            }, meta: {
                                invalid: get(syncErrors, 'hourBook', null) !== true,
                                dirty: get(syncErrors, 'hourBook', null) !== true,
                                showErrors: showError,
                                message: {
                                    error: translateTo('Please insert an hour', lang),
                                },
                            } }),
                        React.createElement(BrixelIcon, { className: "pos-a-fix x-r-1 hour-book x-t-1", icon: "clock", color: "text" }))),
                loggedInUser.id && (React.createElement("div", null,
                    React.createElement(ReduxField, { form: "scanFlow", component: BrixelInputPhone, ReduxFieldClass: "inputPhone", design: {
                            className: 'mt-3',
                            large: true,
                        }, input: {
                            name: 'phone',
                            type: 'text',
                            placeholder: '',
                            validate: [Validation.required],
                        }, labels: {
                            label: '',
                        }, meta: {
                            invalid: get(syncErrors, 'phone', null) !== true,
                            dirty: get(syncErrors, 'phone', null) !== true,
                            showErrors: showError,
                            message: {
                                error: translateTo('Please insert a valid phone', lang),
                            },
                        } }))),
                React.createElement("p", { className: "mt-2" },
                    React.createElement("span", null, translateTo('Alternatively you can call us on', lang)),
                    phone && (React.createElement("a", { href: `tel:${Helpers.telephoneFormat(phone)}`, className: "ml-1 txtText700 cur-poi td-u" }, Helpers.telephoneFormat(phone)))),
                React.createElement("p", null, translateTo('We are reachable Mo - Fr, 09:00 to 17:00.', lang)))))) : (React.createElement(React.Fragment, null,
        React.createElement("h2", { className: "mb-1 ta-c fsize-600 fsize-sm-800 fweight-600" }, translateTo('We are ready from', lang)),
        React.createElement("h2", { className: "mb-3 mb-sm-6 ta-c fsize-600 fsize-sm-800 fweight-600" }, translateTo('Mo - Fr, 09:00 to 17:00.', lang)),
        React.createElement("div", null,
            React.createElement("div", { className: "dis-fl-col dis-fl-row-md a-c jc-c mx-a mt-6 mt-sm-10 contactSection" },
                React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-md as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-md-auto w-perc-100" },
                    React.createElement("div", { className: " brdCircle p-1" },
                        React.createElement("img", { loading: "lazy", className: "w-fix-40 w-fix-md-80", src: PhoneIcon, alt: "Call Us" })),
                    React.createElement("div", { className: "dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-md-3" },
                        React.createElement("h6", null, translateTo('Call us', lang)),
                        React.createElement("span", { className: 'dis-b cur-poi txtGreen400 td-u', onClick: () => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true)) }, Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))))),
                React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-md as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-md-auto w-perc-100 mx-md-2" },
                    React.createElement("div", { className: " brdCircle p-1" },
                        React.createElement("img", { loading: "lazy", className: "w-fix-40 w-fix-md-80", src: MessageIcon, alt: "Call Us" })),
                    React.createElement("div", { className: "dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-md-3" },
                        React.createElement("h6", null, translateTo('Text us via WhatsApp', lang)),
                        React.createElement("span", { className: 'dis-b cur-poi txtGreen400 td-u', onClick: () => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''), false, false, true)) }, Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''))))),
                React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-md as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-md-auto w-perc-100" },
                    React.createElement("div", { className: " brdCircle p-1" },
                        React.createElement("img", { loading: "lazy", className: "w-fix-40 w-fix-md-80", src: MailIcon, alt: "Call Us" })),
                    React.createElement("div", { className: "dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-md-3" },
                        React.createElement("h6", null, translateTo('Write us', lang)),
                        React.createElement("span", { className: 'dis-b cur-poi txtGreen400 td-u', onClick: () => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`) }, get(activeSingleCompany, 'contact.email', ''))))))))));
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
export default compose(connect(mapStateToProps, mapDispatchToProps))(BookTrialFlow);
