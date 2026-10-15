import React, { useEffect, useRef, useState } from 'react';
import { BrixelButtonPrimary } from '@brixel-io/brixel-components';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import { phonecode } from '@brixel-io/brixel-components/dist/constants/CountryCodePhone';
import { change, destroy, initializeForm, MultiFileldsReduxForm, reset } from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import { DateTime } from 'luxon';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { getHistoryListings, setPropertyHistoryListings } from '../../../actions/HistoryActions';
import { sendScanTrialRequest } from '../../../actions/PropertyActions';
import ScantTrailBookedImg from '../../../images/TestDrive/reviewScanTrial.svg';
import { ScanTrialQuestions } from '../../../resources/Flows/ScanTrialRequest';
import { checkBrowser } from '../../../utils/helpers';
import translateTo from '../../../utils/translation';
const ScanTrialFlow = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const urlParams = queryString.parse(get(history, 'location.search', ''));
    // PROPS
    const { activeSingleProperty, activeSingleScanTrial, changeFieldValue, destroyForm, errorValue, formValue, handleGetHistoryFeed, handleSetPropertyHistory, handleReset, handleSendScanTrial, initForm, initialValues, isSmallLoading, lang, loggedInUser, } = props;
    // STATE
    const [questions, setQuestions] = useState(ScanTrialQuestions(lang));
    // const [position, setPosition] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(formValue.analysis === 'remote' || urlParams.action === 'on-site' ? 3 : 0);
    const [quest, setQuest] = useState(ScanTrialQuestions(lang)[0]);
    const [isEnter, setIsEnter] = useState(true);
    const [showError, setShowError] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showBookedTrial, setShowBookedTrial] = useState(false);
    // GET URL PARAMS
    const propID = get(match, 'propID', null);
    // REF
    const singleStepRef = useRef(null);
    const multiStepSlidesRef = useRef(null);
    useEffect(() => {
        localStorage.setItem('brixelRegField', JSON.stringify({}));
        return () => {
            handleSetPropertyHistory({});
            destroyForm();
        };
    }, []);
    // ON CHANGE STEP LOAD THE ENTER EFFECT
    useEffect(() => {
        setIsEnter(true);
        if (questions[currentIndex].history && !get(urlParams, 'url', null)) {
            // history.push(`/${propID}/trialRequest/${questions[currentIndex].history}`);
        }
    }, [currentIndex]);
    useEffect(() => {
        if (!isSmallLoading.sendData && (questions[currentIndex + 1] && questions[currentIndex + 1].history === 'success')) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setQuest(questions[newIndex]);
        }
    }, [isSmallLoading]);
    // ON CLOSE WINDOW GO BACK TO ORIGIN URL
    const closeWindow = () => {
        handleReset(initialValues);
        const url = localStorage.getItem('backUrl');
        localStorage.removeItem('backUrl');
        history.push(url || `/${propID}/home`);
    };
    const goToFacts = () => {
        handleReset(initialValues);
        history.push(`/${propID}/property/facts/propertyType`);
    };
    // FUNCTION TO SAVE DATA
    const saveData = () => {
        if (!saved) {
            setSaved(true);
            const obj = cloneDeep(formValue);
            delete obj.hourBook;
            delete obj.dateBook;
            delete obj.fullDate;
            delete obj.name;
            delete obj.phone;
            delete obj.email;
            if (obj.bookType === 'phone' || obj.bookType === 'whereby') {
                delete obj.date;
                delete formValue.hourBook;
                delete formValue.dateBook;
                delete formValue.fullDate;
                delete formValue.date;
            }
            const data = {
                page: propID,
                smallLoader: 'sendData',
                data: {
                    user: loggedInUser.id,
                    meta: {
                        ...obj,
                        analysis: obj.analysis || 'on-site',
                        bookType: obj.bookType || 'online',
                        answers: formValue,
                    },
                    userName: get(formValue, 'name', ''),
                    userEmail: get(formValue, 'email', ''),
                    userPhone: get(formValue, 'phone', { prefix: '', number: '' }),
                },
            };
            handleSendScanTrial(data);
        }
    };
    // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
    const checkCondition = (id, act = '') => {
        let newIndex = id;
        if (get(questions, `[${newIndex}].conditions`, null)) {
            let checkCond = true;
            get(questions[newIndex], 'conditions', []).map((cond) => {
                let val;
                if (cond?.name) {
                    val = get(formValue, cond.name, null);
                    if (has(cond, 'value') && val !== cond.value && checkCond) {
                        if (act === 'back')
                            newIndex -= 1;
                        else
                            newIndex += 1;
                        checkCond = false;
                    }
                }
                if (cond.noValue && val === cond.noValue && checkCond) {
                    if (act === 'back')
                        newIndex -= 1;
                    else
                        newIndex += 1;
                    checkCond = false;
                }
                return null;
            });
        }
        return newIndex;
    };
    // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
    const checkValidateField = (act = '') => {
        let isValid = true;
        let isNotEmpty = false;
        if (get(quest, 'inputs', null)) {
            get(quest, 'inputs', []).forEach((input) => {
                if (input?.name) {
                    const err = get(errorValue, input.name, null);
                    const noEmpty = get(formValue, input.name, 'ayc');
                    if (noEmpty !== 'ayc')
                        isNotEmpty = true;
                    if (input.condition) {
                        input.condition.forEach((item) => {
                            if (item.name && item.value && get(formValue, item.name, null) === item.value) {
                                if (err !== true && err !== false && err !== null && isValid)
                                    isValid = false;
                            }
                            if (item.name && item.noValue && get(formValue, item.name, null) !== item.noValue) {
                                if (err !== true && err !== false && isValid)
                                    isValid = false;
                            }
                        });
                    }
                    else if (isValid) {
                        isValid = get(errorValue, input.name, null) === true || get(errorValue, input.name, 'ayc') === 'ayc';
                    }
                }
            });
        }
        if (quest.history === 'financeCalculator') {
            if (get(formValue, 'affordabilityCheck', null) === null)
                isValid = false;
        }
        if (act === 'value')
            return isValid && isNotEmpty;
        return isValid;
    };
    const singleStepEl = singleStepRef.current;
    const multiStepSlidesEl = multiStepSlidesRef.current;
    // FUNCTION TO GO TO NEXT STEP
    const changeStep = (act = 'next', e = null, step = 1, skipValidation = false) => {
        if (e)
            e.preventDefault();
        let newIndex = currentIndex;
        setShowError(false);
        if (act === 'back') {
            newIndex -= step;
        }
        else {
            if (!checkValidateField() && !skipValidation) {
                setShowError(true);
                return false;
            }
            newIndex += step;
        }
        if (newIndex === -1) {
            history.push(`/${propID}/trialRequest/`);
        }
        else {
            let defId = checkCondition(newIndex, act);
            if (defId !== newIndex)
                defId = checkCondition(defId, act);
            if (defId !== newIndex)
                defId = checkCondition(defId, act);
            if (defId > -1) {
                if (questions[defId].toSave)
                    saveData();
                const newQuest = {
                    ...questions[defId],
                };
                setQuest(newQuest);
                setCurrentIndex(defId);
                setTimeout(() => {
                    const getCurStep = document.getElementById(`step-${defId}`);
                    if (getCurStep && getCurStep.querySelector('input[type="number"]')) {
                        const inputNumber = getCurStep.querySelector('input[type="number"]');
                        if (inputNumber)
                            inputNumber.focus();
                    }
                    else if (getCurStep && getCurStep.querySelector('input[type="text"]')) {
                        const inputText = getCurStep.querySelector('input[type="text"]');
                        if (inputText)
                            inputText.focus();
                    }
                }, 100);
                if (questions[defId].history) {
                    history.push(`/${propID}/trialRequest/${questions[defId].history}`, { state: get(history, 'location.state', {}) });
                }
                if (checkBrowser() > 0) {
                    // @ts-ignore
                    if (singleStepEl && singleStepEl.scrollTop)
                        singleStepEl.scrollTop = 0;
                    // @ts-ignore
                    if (multiStepSlidesEl && multiStepSlidesEl.scrollTop)
                        multiStepSlidesEl.scrollTop = 0;
                }
                else {
                    // @ts-ignore
                    if (singleStepEl && typeof singleStepEl.scrollTo === 'function')
                        singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
                    // @ts-ignore
                    if (multiStepSlidesEl && typeof multiStepSlidesEl.scrollTo === 'function')
                        multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        }
        return null;
    };
    useEffect(() => {
        let showBookTrial = false;
        if (get(activeSingleScanTrial, 'actionStub', null) && get(formValue, 'analysis', null) === 'on-site') {
            if (DateTime.now().toMillis() < get(activeSingleScanTrial, 'meta.meta.date', 0))
                showBookTrial = true;
        }
        setShowBookedTrial(showBookTrial);
    }, [get(formValue, 'analysis', null), get(activeSingleScanTrial, 'actionStub', null)]);
    useEffect(() => {
        initForm(initialValues);
        const defId = checkCondition(currentIndex);
        if (defId !== currentIndex)
            changeStep();
    }, [activeSingleProperty]);
    useEffect(() => {
        if (loggedInUser.id && activeSingleProperty.id && get(formValue, 'analysis', null) === 'on-site') {
            const payloadPageHistory = {
                actionStubs: ['page-scan-trial'],
                parent: propID,
                resultsPerPage: 1,
                offset: 0,
                order: 'createdAt',
                direction: 'DESC',
                smallLoader: 'getPageHistory',
                type: 'page',
            };
            handleGetHistoryFeed(payloadPageHistory);
        }
    }, [loggedInUser, activeSingleProperty, get(formValue, 'analysis', null)]);
    // ON CHANGE FORM VALUE CALC THE CONDITION TO SHOW/HIDE QUESTIONS AND STEP
    useEffect(() => {
        const newQuest = [];
        if (formValue) {
            ScanTrialQuestions(lang).forEach((quests) => {
                if (quests.condition) {
                    let isValid = true;
                    quests.condition.map((item) => {
                        if (item.name && get(formValue, item.name, null) !== item.value) {
                            isValid = false;
                        }
                    });
                    if (isValid)
                        newQuest.push(quests);
                }
                else {
                    newQuest.push(quests);
                }
            });
            setQuest(newQuest[currentIndex]);
            setQuestions(newQuest);
        }
        if (currentIndex === 0 && formValue.analysis === 'remote')
            changeStep();
    }, [formValue]);
    // FUNCTION TO LOAD DIFFERENT BUTTON LABEL BY STEP
    const buttonLabel = () => {
        let label;
        if (currentIndex === 0)
            label = 'Book your test drive';
        else if (currentIndex === questions.length - 1)
            label = 'Continue';
        else
            label = 'Continue';
        return label;
    };
    return (React.createElement("div", { id: "bodyModalWrapper", className: `withHeader getStarted ${get(quest, 'background', '') ? get(quest, 'background', '') : ''} ${get(quest, 'background', '')} ${get(quest, 'classWrapper', '')} ${showBookedTrial ? 'bgGreen50' : ''}` },
        React.createElement("div", { className: `bodyModal dis-fl-col upgradeModal container ${get(quest, 'history', '')} ${showBookedTrial ? 'dis-f jc-c' : ''} stepNo${currentIndex}` },
            React.createElement("form", { id: "multiStepForm", autoComplete: "off", className: `interactive dis-fl-col jc-b ${get(quest, 'background', null) || ''}`, onSubmit: (e) => changeStep('', e) },
                React.createElement("div", { ref: multiStepSlidesRef, className: "multiStepSlides" },
                    React.createElement("div", { ref: singleStepRef, className: `singleStep zIndex1 pt-5 jc-c ${currentIndex < 5 ? isEnter ? 'fade-enter-active' : 'fade-enter' : ''}` }, showBookedTrial ? (React.createElement("div", { className: "subcontainer m-a" },
                        React.createElement("div", { className: "ta-c mx-a max-w-fix-400" },
                            React.createElement("img", { src: ScantTrailBookedImg, alt: "Scan Trial Booked" }),
                            React.createElement("h4", { className: "txtGreen700 fweight-600 mt-6" },
                                React.createElement("span", null, translateTo('You have requested a test drive for', lang)),
                                !isNaN(+get(activeSingleScanTrial, 'meta.meta.date', '')) && (React.createElement("span", { className: "ml-1 txtGreen400" }, DateTime.fromMillis(get(activeSingleScanTrial, 'meta.meta.date', 0)).toFormat('dd MMM yyyy, HH:mm')))),
                            React.createElement("p", { className: "mt-3 txtText700" }, translateTo(' 💡 Remember to fill out as many facts about your property as possible. The more information we have, the better we can assist you.', lang)),
                            React.createElement(BrixelButtonPrimary, { rounded: true, className: "mt-5 mx-a", onClick: () => {
                                    changeFieldValue('analysis', 'remote');
                                    changeFieldValue('email', loggedInUser.email);
                                    changeFieldValue('phone', loggedInUser.phone);
                                    changeFieldValue('name', loggedInUser.name);
                                    changeFieldValue('userID', loggedInUser.id);
                                    setShowBookedTrial(false);
                                    history.push(`/${activeSingleProperty.id}/trialRequest/BookScanTrial`);
                                }, label: "Contact us" })))) : (React.createElement("div", { className: "subcontainer m-a" },
                        get(quest, 'inputs', null) && !get(quest, 'cardType', null) && (React.createElement("div", { id: `step-${currentIndex}`, className: "dis-fl-col flex-wrap activeQuestBack" },
                            quest.title && (React.createElement("h2", { className: `fsize-600 fsize-sm-800 fweight-600 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`, dangerouslySetInnerHTML: { __html: quest.title } })),
                            React.createElement("div", { className: `${quest.className} w-perc-100` },
                                React.createElement(MultiFileldsReduxForm, { form: "scanFlow", disableNextBtn: false, formValue: formValue, inputs: quest.inputs, onClick: () => changeStep(), onCloseGoBack: () => changeStep('back'), onClickDisabled: !checkValidateField(), onSubmit: () => changeStep(), showSendButton: false, showErrors: showError, disableDelay: true })))),
                        get(quest, 'cardType', null) === 'loadComponent' && (React.createElement(quest.component, {
                            formName: 'scanFlow',
                            initialValue: formValue,
                            ...quest,
                            onClick: (step = 1) => (questions[currentIndex + 1] ? changeStep('next', null, step, true) : closeWindow()),
                            showError,
                        })),
                        (get(quest, 'cardType', null) === 'card') && (React.createElement("div", { className: `scaleAnim ta-c ${quest.cardClass}` },
                            React.createElement("img", { loading: "lazy", src: quest.img, alt: quest.title, className: `${quest.imgMaxWidth ? quest.imgMaxWidth : 'max-w-fix-232'} mb-3` }),
                            quest.title && (React.createElement("h2", { className: "fadeAnim fsize-700 fsize-sm-800 fweight-600 ta-c", dangerouslySetInnerHTML: { __html: quest.title } })),
                            quest.subtitle && (React.createElement("h6", { className: "fadeAnim fsize-500 fsize-sm-600 fweight-400 mt-2 ta-c", dangerouslySetInnerHTML: { __html: quest.subtitle } })))),
                        get(quest, 'history', null) === 'resume' && (React.createElement("div", { className: "max-w-fix-344 m-a" },
                            React.createElement(BrixelButtonPrimary, { className: `mt-3 m-a noWrap ${quest.history}`, rounded: true, theme: "green", themeSat: 500, label: translateTo(buttonLabel(), lang), disabled: !checkValidateField(), rightIcon: "arrow-right-small", onClick: () => (questions[currentIndex + 1] ? changeStep() : closeWindow()) }))))))),
                get(quest, 'history', null) !== 'createProfile' && !showBookedTrial && (React.createElement("div", { className: `footerAction flowFooter ${questions[currentIndex].footerWidth} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}` },
                    React.createElement("div", { className: "pos-r" },
                        React.createElement("div", { className: "w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c mb-3 h-fix-40" }, (get(quest, 'inputs', []).length > 0 || questions[currentIndex].history === 'introScanTrial') && (React.createElement(React.Fragment, null, buttonLabel().toLowerCase() === 'skip' ? (React.createElement(BrixelButtonSecondary, { className: `noWrap mr-a ml-a ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`, disabled: !checkValidateField(), theme: "green", themeSat: 500, rounded: true, label: translateTo(buttonLabel(), lang), rightIcon: "arrow-right-small", onClick: () => (questions[currentIndex + 1] ? changeStep() : closeWindow()) })) : (React.createElement(React.Fragment, null, (questions[currentIndex].history !== 'BookTrialFlow') && (React.createElement(React.Fragment, null,
                            questions[currentIndex].history === 'introScanTrial' && (React.createElement(BrixelButtonSecondary, { label: translateTo('Cancel', lang), rounded: true, bgTransparent: true, className: "ml-sm-a mb-1 mb-sm-0 Delay1sfadeIn", onClick: () => closeWindow() })),
                            React.createElement(BrixelButtonPrimary, { className: `noWrap ${questions[currentIndex].history === 'introScanTrial' ? 'ml-sm-2 mr-sm-a Delay1sfadeIn' : 'ml-a mr-a'} ${get(quest, 'history', null)} ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''}`, disabled: !checkValidateField(), rounded: true, theme: "green", themeSat: 500, label: translateTo(buttonLabel(), lang), rightIcon: "arrow-right-small", onClick: () => (questions[currentIndex + 1] ? changeStep() : goToFacts()), onShowError: () => setShowError(true) })))))))),
                        get(quest, 'showExitText', null) && (React.createElement("div", { className: "w-perc-100 a-c dis-fl-row m-a jc-c mt-2" },
                            React.createElement(BrixelButtonPrimary, { rounded: true, theme: "green", themeSat: 500, label: translateTo('Back to the hub', lang), onClick: () => closeWindow() }))))))))));
};
const mapStateToProps = (state) => {
    const history = {
        location: window.location.href,
    };
    const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
    const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
    let bookType = get(history, 'location', '').replace(/\/$/, '');
    if (bookType) {
        if (bookType.includes('?url='))
            bookType = bookType.split('?')[0];
        bookType = bookType.split('/')[bookType.split('/').length - 1];
    }
    const initVal = {
        ...get(state, 'brixelForm.scanFlow.values', {}),
        name: get(state, 'user.loggedInUser.user.name', undefined),
        phone: {
            prefix: get(state, 'user.loggedInUser.user.phone.prefix', countryPhoneCode?.dial_code) || countryPhoneCode?.dial_code,
            number: get(state, 'user.loggedInUser.user.phone.number', ''),
        },
        email: get(state, 'user.loggedInUser.user.email', undefined),
        userID: get(state, 'user.loggedInUser.user.id', undefined),
    };
    if (!initVal.analysis)
        initVal.analysis = 'on-site';
    if (bookType.includes('on-site'))
        initVal.analysis = 'on-site';
    if (bookType.includes('remote'))
        initVal.analysis = 'remote';
    return ({
        activeSingleScanTrial: get(state, 'history.activeSinglePropertyHistory.data[0]', null),
        activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
        activeSingleProperty: get(state, 'property.activeSingleProperty', null),
        errorValue: get(state, 'brixelForm.scanFlow.syncErrors', {}),
        formValue: get(state, 'brixelForm.scanFlow.values', {}),
        isSmallLoading: get(state, 'common.isSmallLoading', {}),
        lang: get(state, 'common.language', 'en'),
        loggedInUser: get(state, 'user.loggedInUser.user', {}),
        initialValues: initVal,
    });
};
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('scanFlow', field, value));
    },
    initForm(value) {
        dispatch(initializeForm('scanFlow', value));
    },
    destroyForm() {
        (dispatch(destroy('scanFlow')));
    },
    handleReset(data) {
        (dispatch(reset('scanFlow', data)));
    },
    handleSetPropertyHistory: bindActionCreators(setPropertyHistoryListings, dispatch),
    handleSendScanTrial: bindActionCreators(sendScanTrialRequest, dispatch),
    handleGetHistoryFeed: bindActionCreators(getHistoryListings, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(ScanTrialFlow);
