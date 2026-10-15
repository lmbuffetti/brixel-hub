import React, { useEffect, useRef, useState } from 'react';
import { BrixelTooltip, BrixelButtonText, BrixelButtonIcon, BrixelButtonPrimary, BrixelProgressBar } from '@brixel-io/brixel-components';
import { destroy, MultiFileldsReduxForm, reset } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import has from 'lodash/has';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { spinnerOff, spinnerOn, spinnerSmallOff } from '../actions/CommonActions';
import { checkBrowser, redirectUrl } from '../utils/helpers';
import translateTo from '../utils/translation';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
const FlowScreen = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { autoFocus = true, baseURL, disableEmailRegister, closeButton = false, closeLabelFlow, closeLabel, saveLabel, closeLink, company, destroyForm, errorValue, formName, formValue, handleReset, handleSpinnerOff, handleSetIsSmallLoading, initialValues, isSaveEnable = true, isSmallLoading, successCustomButtons, lang = 'en', newCurrentIndex, onChangeCurrentIndex = () => '', onSaveData, QuestionsList, smallMargin, className, } = props;
    // STATE
    // SET THE QUESTIONS IN BASE OF THE COUNTRY
    const [questions, setQuestions] = useState(QuestionsList);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [oldIndex, setOldIndex] = useState(0);
    const [showError, setShowError] = useState(false);
    const [action, setAction] = useState('next');
    // SET QUEST TO FIRST QUESTION OF QuestionsList()
    const [quest, setQuest] = useState(QuestionsList[0]);
    // const [roomValue, setRoomValue] = useState('');
    // GET URL PARAMS
    const propID = get(match, 'propID', null);
    const singleStepRef = useRef(null);
    const multiStepSlidesRef = useRef(null);
    // DESTROY FORM ON EXIT
    useEffect(() => {
        handleSpinnerOff();
        handleSetIsSmallLoading({});
        return () => destroyForm(formName);
    }, []);
    // FUNCTION TO SHOW/HIDE BLOCK IN BASE OF JSON CONDITION
    const checkCondition = (id, act) => {
        let newIndex = id;
        if (questions[newIndex] && questions[newIndex].conditions) {
            let checkCond = true;
            const { conditions } = questions[newIndex];
            if (conditions) {
                conditions.forEach((cond) => {
                    if (cond.name) {
                        const val = get(formValue, cond.name, null);
                        if (has(cond, 'value') && val !== cond.value && checkCond) {
                            if (act === 'back')
                                newIndex -= 1;
                            else
                                newIndex += 1;
                            checkCond = false;
                        }
                    }
                });
            }
        }
        return newIndex;
    };
    // CHECK IF FIELDS IS VALID TO ENABLE NEXT BUTTON
    const checkValidateField = (act = '') => {
        let isValid = true;
        let isNotEmpty = false;
        if (quest?.inputs) {
            quest.inputs.forEach((input) => {
                if (input.name) {
                    const err = get(errorValue, input.name, null);
                    const noEmpty = get(formValue, input.name, 'ayc');
                    if (noEmpty !== 'ayc')
                        isNotEmpty = true;
                    if (input.condition) {
                        input.condition.forEach((item) => {
                            if (item.value && get(formValue, item.name, null) === item.value) {
                                if (err !== true && err !== false && isValid)
                                    isValid = false;
                            }
                            if (item.noValue && get(formValue, item.name, null) !== item.noValue) {
                                if (err !== true && err !== false && isValid)
                                    isValid = false;
                            }
                        });
                    }
                    else if (input.validation) {
                        // const getRegField = get(registeredFields
                        let field;
                        if (input.name === 'profile') {
                            const page = get(formValue, 'signupScreen', null);
                            field = ['register.email', 'register.firstName', 'register.lastName', 'register.password', 'register.privacy'];
                            if (page === 'login') {
                                field = ['login.email', 'login.password'];
                            }
                            field.forEach((item) => {
                                const errCurr = get(errorValue, item, true);
                                if (errCurr !== true && errCurr !== false && isValid)
                                    isValid = false;
                            });
                        }
                        if (input.name === 'register.ownerType') {
                            if (!has(formValue, 'register.ownerType') || get(formValue, 'register.ownerType', '') === null)
                                isValid = false;
                        }
                        if (input.name === 'register.whenToSell') {
                            if (!has(formValue, 'register.whenToSell') || get(formValue, 'register.whenToSell', '') === null)
                                isValid = false;
                        }
                        else if (err !== true && err !== false && err !== null && isValid)
                            isValid = false;
                    }
                }
            });
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
        const newQuestions = questions;
        let newIndex = currentIndex;
        setOldIndex(currentIndex);
        setShowError(false);
        setAction(act);
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
        if (newIndex === -1 && history.location.pathname.includes('packageFlow')) {
            history.push(`/packageFlow/${company.stub}`);
        }
        else {
            let defId = checkCondition(newIndex, act);
            if (defId !== newIndex)
                defId = checkCondition(defId, act);
            if (newQuestions[defId]) {
                if (newQuestions[defId].toSave) {
                    const actTerms = history.location.pathname.includes('termsConditionFlow') ? 'accept' : '';
                    onSaveData(actTerms);
                }
                else {
                    const newQuest = {
                        ...newQuestions[defId],
                    };
                    setCurrentIndex(defId);
                    if (newQuest.history !== 'createProfile') {
                        if (newQuest.inputs && !newQuest.inputs[0].options && !newQuest.inputs[0].startFrom) {
                            const fakeInput = document.createElement('input');
                            fakeInput.setAttribute('type', 'text');
                            fakeInput.setAttribute('id', 'fakeInput');
                            fakeInput.style.position = 'absolute';
                            fakeInput.style.opacity = '0';
                            fakeInput.style.height = '0';
                            fakeInput.style.fontSize = '16px'; // disable auto zoom
                            // zoom/scroll behavior
                            document.body.prepend(fakeInput);
                            fakeInput.focus();
                        }
                        setTimeout(() => {
                            const fakeInput = document.getElementById('fakeInput');
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
                            else if (getCurStep && getCurStep.querySelector('input[type="search"]')) {
                                const inputSearch = getCurStep.querySelector('input[type="search"]');
                                if (inputSearch)
                                    inputSearch.focus();
                            }
                            // cleanup
                            if (fakeInput)
                                fakeInput.remove();
                        }, 500);
                    }
                    if (checkBrowser() > 0) {
                        //@ts-ignore
                        if (singleStepEl && singleStepEl.scrollTop)
                            singleStepEl.scrollTop = 0;
                        //@ts-ignore
                        if (multiStepSlidesEl && multiStepSlidesEl.scrollTop)
                            multiStepSlidesEl.scrollTop = 0;
                    }
                    else {
                        //@ts-ignore
                        if (singleStepEl && typeof singleStepEl.scrollTo === 'function')
                            singleStepEl.scrollTo({ top: 0, behavior: 'smooth' });
                        //@ts-ignore
                        if (multiStepSlidesEl && typeof multiStepSlidesEl.scrollTo === 'function')
                            multiStepSlidesEl.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            }
        }
        return null;
    };
    // ON CHANGE VALUE RE-CALC THE PERCENTAGE OF FACTS
    useEffect(() => {
        setOldIndex(currentIndex);
        if (company.stub) {
            const newQuest = questions;
            if ((newQuest[currentIndex]?.inputs || []).length === 1 &&
                get(newQuest[currentIndex], 'inputs[0].options', []).length > 0 &&
                get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), null) &&
                typeof get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), '') === 'string' &&
                !get(formValue, get(newQuest[currentIndex], 'inputs[0].name', ''), '').toLowerCase().includes('other') && oldIndex <= currentIndex) {
                changeStep('next', null, 1, true);
            }
        }
    }, [get(formValue, get(questions, `[${currentIndex}].inputs[0].name`, ''), null)]);
    useEffect(() => {
        setQuest(questions[currentIndex]);
        onChangeCurrentIndex(currentIndex);
        if (typeof newCurrentIndex === 'undefined') {
            history.push(`${baseURL}/${questions[currentIndex].history}`, { state: get(history, 'location.state', {}) });
        }
    }, [currentIndex, questions, lang]);
    useEffect(() => {
        if (typeof newCurrentIndex !== 'undefined' && newCurrentIndex > currentIndex) {
            setCurrentIndex(newCurrentIndex);
        }
    }, [newCurrentIndex]);
    // MOVE STEP FORWARD AFTER SAVING
    useEffect(() => {
        if ((isSmallLoading.sendData === true && questions[currentIndex + 1] && !questions[currentIndex + 1].skipResume) || (isSmallLoading.savedData === true && questions[currentIndex + 1])) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setQuest(questions[newIndex]);
        }
    }, [isSmallLoading]);
    // FUNCTION TO CLOSE
    const closeWindow = () => {
        handleReset(formName, initialValues);
        const linkToRedirect = closeLink || redirectUrl(history.location.pathname, { propID: propID || '' });
        history.push(linkToRedirect);
    };
    // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
    useEffect(() => {
        const newQuest = [];
        QuestionsList.forEach((qst) => {
            if (qst.condition) {
                let isValid = true;
                qst.condition.forEach((item) => {
                    if (item.name && get(formValue, item.name, null) !== item.value) {
                        isValid = false;
                    }
                });
                if (isValid && !qst.hideOnFlow)
                    newQuest.push(qst);
            }
            else {
                if (!qst.hideOnFlow)
                    newQuest.push(qst);
            }
        });
        setQuestions(newQuest);
    }, [formValue, QuestionsList, lang]);
    // DYNAMIC LABEL NEXT BUTTON
    const buttonLabel = () => {
        let label;
        const inputName = get(quest, 'inputs[0].name', null);
        if (get(questions, `[${currentIndex}].btnLabel`, null))
            label = get(questions, `[${currentIndex}].btnLabel`, null);
        else if (get(questions, `[${currentIndex + 1}].toSave`, null))
            label = 'Save';
        else if (inputName && get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null)
            label = 'Skip';
        else
            label = 'Next';
        return label;
    };
    const progressBarCalc = () => {
        let num = 0;
        questions.forEach((item) => {
            if (get(item, 'hideProgress', false) !== true) {
                if (item.conditions) {
                    item.conditions.forEach((cond) => {
                        if (cond.name) {
                            const val = get(formValue, cond.name, null);
                            if (has(cond, 'value') && val === cond.value) {
                                num += 1;
                            }
                            else if (cond.noValue && val !== cond.noValue) {
                                num += 1;
                            }
                        }
                    });
                }
                else {
                    num += 1;
                }
            }
        });
        return (currentIndex * 100) / (num - 1);
    };
    // REMOVE FADEIN CLASS TO INITIATE ANIMATION FOR EVERY STEP
    useEffect(() => {
        const getStartedEl = document.querySelector('.getStarted');
        setTimeout(() => {
            if (getStartedEl && getStartedEl.classList)
                getStartedEl.classList.remove('slideUpTrans');
        }, 350);
    }, [quest]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "bodyModalWrapper", className: `withHeader getStarted slideUpTrans ${get(quest, 'background', '')} ${className} ${get(quest, 'history', '')} ${get(quest, 'classNameWrapper', '')}` },
            get(quest, 'inputs', null) && get(quest, 'history', '') !== 'createProfile' && get(quest, 'history', null) !== 'resume' && (React.createElement("div", { className: "pos-r" },
                React.createElement(BrixelProgressBar, { large: true, classProgressBar: "container", className: "brdRadius", saturation: 500, color: "green", barBackground: "text", backgroundSaturation: 100, progressValue: progressBarCalc() }))),
            React.createElement("div", { id: `step-${quest?.history || 'default'}`, className: `bodyModal container ${get(quest, 'history', '')}` },
                React.createElement("form", { noValidate: true, id: "multiStepForm", autoComplete: "off", className: "dis-fl-col jc-b interactive", onSubmit: () => changeStep() },
                    React.createElement("div", { id: `step-${currentIndex}`, ref: multiStepSlidesRef, className: "multiStepSlides" },
                        React.createElement("div", { ref: singleStepRef, className: "singleStep pt-5 jc-c " },
                            React.createElement("div", { className: "subcontainer m-a" },
                                quest && get(quest, 'cardType', null) !== 'card' && (React.createElement(React.Fragment, null,
                                    quest.titleIcon && (React.createElement("div", { className: "ta-c mb-3" },
                                        React.createElement("img", { src: quest.titleIcon, alt: "Title Icon" }))),
                                    quest.titleGreen && (React.createElement("h3", { className: "txtGreen400 w-perc-100 boutiqueFont" }, quest.titleGreen)),
                                    quest.title && (React.createElement("h3", { className: `boutiqueFont fweight-600 max-w-fix-640 ta-c fsize-600 fsize-sm-800 m-a ${quest.subtitle ? 'mb-1' : 'mb-5'}`, dangerouslySetInnerHTML: { __html: quest.title } })),
                                    quest.subtitle && (React.createElement("p", { className: "mb-5 ta-c txtText600 w-perc-100 px-3 px-sm-2 max-w-fix-504 ml-a mr-a", dangerouslySetInnerHTML: { __html: quest.subtitle } })))),
                                get(quest, 'inputs', null) && (React.createElement("div", { className: "dis-fl-col a-c flex-wrap" },
                                    React.createElement("div", { className: `w-perc-100 ${quest.className}` },
                                        get(quest, 'cardType', null) === 'loadComponentBeforeInput' && (React.createElement(quest.component, {
                                            formName,
                                            initialValue: formValue,
                                            ...quest,
                                            onClick: () => (questions[currentIndex + 1] ? changeStep() : closeWindow()),
                                            onSaveData: (val) => onSaveData(val),
                                        })),
                                        React.createElement(MultiFileldsReduxForm, { autofocus: autoFocus, disableEmailRegister: disableEmailRegister, baseByData: baseByData, onSaveData: () => onSaveData(), form: formName, disableNextBtn: false, formValue: formValue, smallMargin: smallMargin, inputs: quest.inputs, onClick: () => changeStep(), onCloseGoBack: () => changeStep('back'), onClickDisabled: !checkValidateField(), onSubmit: () => changeStep(), showSendButton: quest.showSendButton, showErrors: showError, disableDelay: quest?.history !== 'createProfile', skipPhone: true })))),
                                get(quest, 'cardType', null) === 'loadComponent' && (React.createElement(quest.component, {
                                    formName,
                                    initialValue: formValue,
                                    ...quest,
                                    onClick: () => (questions[currentIndex + 1] ? changeStep() : closeWindow()),
                                    onSaveData: (val) => onSaveData(val),
                                })),
                                (get(quest, 'cardType', null) === 'card') && (React.createElement("div", { className: `scaleAnim ta-c ${quest.cardClass}` },
                                    quest.img && (React.createElement("img", { loading: "lazy", src: quest.img, alt: quest.title, className: ` mb-5 ${quest.imgMaxWidth ? quest.imgMaxWidth : 'max-w-fix-240'}` })),
                                    quest.title && (React.createElement("h2", { className: "fweight-600 ta-c boutiqueFont", dangerouslySetInnerHTML: { __html: quest.title } })),
                                    quest.subtitle && (React.createElement("div", { className: "mt-2 max-w-fix-432 ml-a mr-a pos-r" },
                                        React.createElement("span", { className: `ta-c ${quest.subtitleClass ? quest.subtitleClass : ''} ${quest.subtitleTooltip ? 'dis-in' : ''}`, dangerouslySetInnerHTML: { __html: quest.subtitle } }),
                                        quest.subtitleTooltip && (React.createElement(BrixelTooltip, { descClass: "pos-a-fix x-t-3", className: "dis-in ml-1 mobileCenter", classNameIconWrap: "dis-in", description: quest.subtitleTooltip, iconColor: 'green', theme: 'blue', width: "320" })))))),
                                (quest?.bulletPoints || quest?.text) && (React.createElement(React.Fragment, null,
                                    quest.bulletPoints && (React.createElement("div", { className: "brdRadius bgWhite ml-a mr-a px-2 px-sm-6 max-w-fix-752 pt-3 pb-6 mb-3 bulletPointsStep" },
                                        React.createElement("div", { className: "brdText50" },
                                            React.createElement("span", { className: "fweight-600 my-3 dis-b" }, quest.bulletPoints.title),
                                            React.createElement("ul", null, get(quest, 'bulletPoints.description', []).map((bullet, k) => (React.createElement("li", { className: "mb-2", key: k.toString() }, bullet))))))),
                                    React.createElement("div", { className: "brdRadius bgWhite ml-a mr-a px-2 px-sm-6 max-w-fix-752 pt-3 pb-6" }, get(quest, 'text', []).map((text, i) => (React.createElement("div", { key: i.toString() },
                                        text.title && (React.createElement("span", { className: "fweight-600 my-3 dis-b" }, text.title)),
                                        text.subtitle && (React.createElement("p", { className: "fsize-300 fweight-500 mb-1 dis-b" }, text.subtitle)),
                                        React.createElement("p", { className: "fsize-300 mb-2 dis-b", dangerouslySetInnerHTML: { __html: text.description } })))))))))),
                    get(quest, 'history', null) !== 'createProfile' && get(quest, 'hideFooter', null) !== true && (React.createElement("div", { className: `footerAction flowFooter ${get(quest, 'footerWidth', '')} ${get(quest, 'history', null) === 'resume' ? 'hide' : ''} ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}` },
                        React.createElement("div", { className: "pos-r" },
                            React.createElement("div", { className: "w-perc-100 a-c dis-fl-row m-a flex-wrap jc-c" },
                                closeButton ? (React.createElement(BrixelButtonText, { theme: "text", themeSat: 200, label: translateTo(closeLabelFlow || 'Close', lang), onClick: () => closeWindow() })) : (React.createElement(React.Fragment, null, ((currentIndex !== questions.length - 2 &&
                                    get(quest, 'history', '') !== 'baloiseInfo' &&
                                    quest?.history !== 'success' &&
                                    !get(quest, 'hideBackArrow', false) || quest?.showBackButton)) && (React.createElement(BrixelButtonIcon, { className: "backBtn pos-a x-l", icon: "arrow-left-small", onClick: () => changeStep('back'), theme: "text", themeSat: 300, ghost: true })))),
                                (get(quest, 'history', null) !== 'resume' && (get(quest, 'inputs', []).length > 0 || action === 'back') || quest.showSendButton) ? (React.createElement(BrixelButtonPrimary, { className: `mr-a ml-a noWrap ${get(quest, 'history', null)}`, rounded: true, theme: "green", disabled: !isSaveEnable, label: saveLabel ? translateTo(saveLabel, lang) : translateTo(buttonLabel(), lang), isLoading: isSmallLoading.sendData || isSmallLoading.savingData, rightIcon: "arrow-right-small", onClick: () => (questions[currentIndex + 1] ? changeStep() : closeWindow()), onShowError: () => setShowError(true), type: "submit" })) : (React.createElement("div", null, quest?.history === 'success' && (successCustomButtons ? (successCustomButtons.map((btn) => (React.createElement(React.Fragment, null,
                                    btn.type === 'primary' && (React.createElement(BrixelButtonPrimary, { className: btn.className, rounded: true, key: "btn1", onClick: () => btn.func(), label: translateTo(btn.label, lang), isLoading: isSmallLoading.sendData || isSmallLoading.savingData })),
                                    btn.type === 'secondary' && (React.createElement(BrixelButtonPrimary, { className: btn.className, rounded: true, key: "btn1", onClick: () => btn.func(), label: translateTo(btn.label, lang), isLoading: isSmallLoading.sendData || isSmallLoading.savingData })),
                                    btn.type === 'text' && (React.createElement(BrixelButtonText, { className: btn.className, rounded: true, key: "btn1", onClick: () => btn.func(), label: translateTo(btn.label, lang) })))))) : (React.createElement(React.Fragment, null, quest.btnType === 'secondary' ? (React.createElement(BrixelButtonSecondary, { bgTransparent: true, className: `mr-a ml-a w-perc-100 w-auto-sm noWrap ${get(quest, 'history', null)}`, rounded: true, theme: "green", label: closeLabel ? translateTo(closeLabel, lang) : translateTo('Close', lang), isLoading: isSmallLoading.sendData || isSmallLoading.savingData, onClick: () => closeWindow(), onShowError: () => setShowError(true), type: "submit" })) : (React.createElement(BrixelButtonPrimary, { className: `mr-a ml-a w-perc-100 w-auto-sm noWrap ${get(quest, 'history', null)}`, rounded: true, theme: "green", label: closeLabel ? translateTo(closeLabel, lang) : translateTo('Close', lang), isLoading: isSmallLoading.sendData || isSmallLoading.savingData, onClick: () => closeWindow(), onShowError: () => setShowError(true), type: "submit" }))))))))))))))));
};
const mapStateToProps = (state, ownProps) => {
    const formName = get(ownProps, 'formName', '');
    return ({
        activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
        activeSingleProperty: get(state, 'property.activeSingleProperty', null),
        company: get(state, 'companies.activeSingleCompany', {}),
        errorValue: get(state, `brixelForm.${formName}.syncErrors`, {}),
        formValue: get(state, `brixelForm.${formName}.values`, {}),
        initialValues: get(state, `brixelForm.${formName}.values`, {}),
        isLoading: get(state, 'common.isLoading', 0) > 0,
        isSmallLoading: get(state, 'common.isSmallLoading', {}),
        lang: get(state, 'common.language', 'en'),
        loggedInUser: get(state, 'user.loggedInUser.user', {}),
        packagesProperty: get(state, 'property.packagesProperty', []),
        startForm: get(state, `brixelForm.${formName}`, null),
        translations: get(state, 'translations', {}),
    });
};
const mapDispatchToProps = (dispatch) => ({
    destroyForm(formName) {
        dispatch(destroy(formName));
    },
    handleReset(formName, initialValue) {
        (dispatch(reset(formName, initialValue)));
    },
    handleSetIsSmallLoading: bindActionCreators(spinnerSmallOff, dispatch),
    handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
    handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(FlowScreen);
