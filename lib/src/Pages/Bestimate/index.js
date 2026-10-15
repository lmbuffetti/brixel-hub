import React, { useEffect, useState } from 'react';
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonText, BrixelProgressLineDots, Helpers, } from '@brixel-io/brixel-components';
import translateTo from '../../utils/translation';
import { change, initializeForm, MultiFileldsReduxForm, reset } from '@brixel-io/brixel-components/dist/form';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import queryString from 'query-string';
import { BestimateQuestions } from '../../resources/Flows/Bestimate';
import { getActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
const Bestimate = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleProperty, changeFieldValue, errorValue, formValue, hanldeGetActiveSingleProperty, handleSaveActiveSingleProperty, initForm, initialValues, initialValuesPage, handleReset, lang, } = props;
    // STATE
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isEnter, setIsEnter] = useState(true);
    const [numberQuestions, setNumberQuestions] = useState(0);
    const [quest, setQuest] = useState(BestimateQuestions('en', get(formValue, 'properties.propertyType', ''), lang)[0]);
    const [questions, setQuestions] = useState(BestimateQuestions(null, get(formValue, 'properties.propertyType', ''), lang));
    // GET URL PARAMS
    const getAchievement = () => history.location.pathname.split('/')[4];
    const urlData = queryString.parse(get(history, 'location.search', ''));
    const propID = get(match, 'propID', null);
    // INITIALIZE FORM
    useEffect(() => {
        initForm(cloneDeep(initialValues));
        if (activeSingleProperty.id && get(initialValues, 'id', null)) {
            if (get(initialValues, 'parking.garage', 0) === 0) {
                changeFieldValue('properties.parking.garage', 0);
            }
            if (get(initialValues, 'parking.outside', 0) === 0) {
                changeFieldValue('properties.parking.outside', 0);
            }
        }
    }, [activeSingleProperty]);
    useEffect(() => {
        if (!activeSingleProperty.id) {
            hanldeGetActiveSingleProperty({ fullVersion: true, id: propID, multiLoader: !formValue.id });
        }
    }, []);
    useEffect(() => {
        const redirectURL = get(urlData, 'url', null);
        if (redirectURL)
            localStorage.setItem('backUrl', redirectURL.toString());
    }, []);
    // ON CHANGE STEP LOAD THE ENTER EFFECT AND IF HAS TO REDO
    useEffect(() => {
        setIsEnter(true);
        if (questions[currentIndex].history) {
            const redo = get(history, 'location.state.redo', false);
            if (getAchievement()) {
                history.push(`/${propID}/singleFlow/achievement/${getAchievement()}/${questions[currentIndex].history}`, { state: { redo } });
            }
        }
    }, [currentIndex]);
    // ON CLOSE WINDOW TWO DIFFERENT ACTION BY SCREEN RESOLUTION
    const closeWindow = () => {
        const redirectURL = localStorage.getItem('backUrl');
        if (redirectURL)
            history.push(redirectURL);
        else
            history.push(`/${propID}/home`);
        localStorage.removeItem('backUrl');
    };
    // FUNCTION TO SAVE DATA
    const saveData = () => {
        const data = {
            id: propID,
            properties: get(formValue, 'properties', {}),
        };
        handleSaveActiveSingleProperty(data);
        history.push(`/${propID}/home`);
        handleReset('Property', initialValuesPage);
    };
    // FUNCTION TO CHANGE STEP - BACK-FORWARD
    const changeStep = (act = 'next') => {
        setIsEnter(false);
        let newIndex = currentIndex;
        if (act === 'back') {
            newIndex -= 1;
        }
        else {
            newIndex += 1;
        }
        if (questions[newIndex].toSave) {
            saveData();
        }
        setCurrentIndex(newIndex);
        setQuest(questions[newIndex]);
    };
    // ON CHANGE FORM VALUE CALC THE CONDITION TO SHOW/HIDE QUESTIONS AND STEP
    const analizeQuestions = () => {
        const newQuest = [];
        let numQuest = 0;
        BestimateQuestions(null, get(formValue, 'properties.propertyType', ''), lang).forEach((questData) => {
            if (questData.condition) {
                let isValid = true;
                questData.condition.forEach((item) => {
                    if (item.name && get(formValue, item.name, null) !== item.value) {
                        isValid = false;
                    }
                });
                if (isValid) {
                    numQuest += 1;
                    newQuest.push(questData);
                }
            }
            else {
                if (questData.inputs)
                    numQuest += 1;
                newQuest.push(questData);
            }
        });
        return {
            num: numQuest,
            quest: newQuest,
        };
    };
    useEffect(() => {
        if (formValue.id) {
            const resQuest = analizeQuestions();
            setNumberQuestions(resQuest.num);
            setQuestions(resQuest.quest);
        }
    }, [formValue]);
    // CHECK IF FIELD IS VALID
    const checkCondition = (input, valid, err) => {
        let isValid = valid;
        if (input.condition) {
            input.condition.forEach((item) => {
                if (item?.name && get(formValue, item.name, null) === item.value) {
                    if (err !== true && err !== false && isValid)
                        isValid = false;
                }
            });
        }
        else if (input.validation) {
            if (err !== true && err !== false && isValid)
                isValid = false;
        }
        return isValid;
    };
    const checkValidateField = (act = null) => {
        let isValid = true;
        let isNotEmpty = false;
        if (quest?.inputs) {
            quest.inputs.forEach((input) => {
                if (input?.name) {
                    const err = get(errorValue, input.name, null);
                    const noEmpty = get(formValue, input.name, 'ayc');
                    isNotEmpty = noEmpty !== 'ayc';
                    isValid = checkCondition(input, isValid, err);
                }
            });
        }
        if (act === 'value')
            return isValid && isNotEmpty;
        return isValid;
    };
    // FUNCTION TO LOAD DIFFERENT BUTTON LABEL BY STEP
    const buttonLabel = () => {
        let label;
        const inputName = get(quest, 'inputs[0].name', null);
        if (currentIndex === questions.length - 1)
            label = 'Back to Hub';
        else if (inputName && get(quest, 'inputs[0].validation', null) === null && get(formValue, inputName, null) === null)
            label = 'Skip';
        else if (currentIndex === 0)
            label = 'Next';
        else
            label = 'Next';
        return label;
    };
    const singleStepClasses = () => {
        let classes = quest.background || '';
        if (isEnter)
            classes += ' fade-enter-active';
        else
            classes += ' fade-enter';
        return classes;
    };
    if (!formValue.id) {
        return (React.createElement("div", null));
    }
    return (React.createElement("div", { id: "bodyModalWrapper", className: "achievementFlow" },
        React.createElement("div", { className: "bodyModal" },
            React.createElement("form", { id: "multiStepForm", onSubmit: (e) => e.preventDefault(), autoComplete: "off", className: "dis-fl-col jc-b" },
                React.createElement("div", { className: "dis-f jc-fe a-c mx-a max-w-fix-736 w-perc-100 mb-2 mt-2" },
                    React.createElement(BrixelButtonIcon, { icon: "close-small", onClick: () => closeWindow() })),
                React.createElement("div", { className: "multiStepSlides" },
                    React.createElement("div", { className: `singleStep jc-c ${singleStepClasses()}` },
                        React.createElement("div", { className: "subcontainer mt-0 m-a h-perc-100" }, quest.inputs && (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "mt-2 mb-5" },
                                React.createElement(BrixelProgressLineDots, { color: "Primary", backgroundSaturation: 100, saturation: 600, activeStep: currentIndex, steps: numberQuestions })),
                            React.createElement("div", null,
                                React.createElement("h3", { className: `${quest.subtitle ? 'mb-1' : 'mb-5'}` }, quest.title),
                                quest.subtitle && (React.createElement("p", { className: "mb-5 txtText600", dangerouslySetInnerHTML: { __html: Helpers.sanitizeText(quest.subtitle) } })),
                                React.createElement(MultiFileldsReduxForm, { disableNextBtn: false, formValue: formValue, form: "GamingFlow", inputs: quest.inputs, onClick: () => '' }))))))),
                React.createElement("div", { className: `footerAction p-1 p-lg-2 shadow-1dp-top ${!checkValidateField() ? 'disabledNext' : 'normStep'} ${checkValidateField('value') ? 'successNext' : ''}` },
                    React.createElement("div", { className: "container pos-r" },
                        React.createElement("div", { className: `w-perc-100 a-c dis-fl-row jc-b m-a ${currentIndex === questions.length - 1 ? 'jc-c' : 'jc-b'}` },
                            questions[currentIndex] && questions[currentIndex].inputs && (React.createElement(BrixelButtonIcon, { className: `backBtn ${currentIndex === 0 ? 'hide' : ''}`, icon: "arrow-simple-left", onClick: () => changeStep('back'), bgTransparent: true })),
                            buttonLabel().toLowerCase() === 'skip' ? (React.createElement(BrixelButtonText, { className: `noWrap ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''} ${currentIndex === 0 ? 'ml-a' : ''}`, disabled: !checkValidateField(), theme: "text", themeSat: 300, label: translateTo(buttonLabel(), lang), rightIcon: "arrow-right-small", onClick: () => (questions[currentIndex + 1] ? changeStep() : closeWindow()) })) : (React.createElement(BrixelButtonPrimary, { className: `noWrap ${buttonLabel().toLowerCase() === 'skip' ? 'skip' : ''} ${currentIndex === 0 ? 'ml-a' : ''}`, disabled: !checkValidateField(), rounded: true, label: translateTo(buttonLabel(), lang), rightIcon: "arrow-right-small", onClick: () => (questions[currentIndex + 1] ? changeStep() : closeWindow()) })))))))));
};
const mapStateToProps = (state) => {
    const formValue = get(state, 'property.activeSingleProperty', {});
    const defaultStatusCondition = get(formValue, 'location.countryCode', '').toLowerCase() !== 'ch' ? 'used' : '';
    return ({
        activeSingleProperty: get(state, 'property.activeSingleProperty', null),
        errorValue: get(state, 'brixelForm.GamingFlow.syncErrors', {}),
        formValue: get(state, 'brixelForm.GamingFlow.values', {}),
        initialValuesPage: get(state, 'brixelForm.Property.initialValues', {}),
        packagesProperty: get(state, 'property.packagesProperty', []),
        lang: get(state, 'common.language', 'en'),
        initialValues: {
            id: get(state, 'property.activeSingleProperty.id', null),
            properties: {
                ...get(state, 'property.activeSingleProperty.properties', null),
                building: {
                    ...get(state, 'property.activeSingleProperty.properties.building', null),
                    conditionStatus: get(state, 'property.activeSingleProperty.properties.building.conditionStatus', defaultStatusCondition),
                },
                parking: {
                    ...get(state, 'property.activeSingleProperty.properties.parking', null),
                    garage: get(formValue, 'properties.parking.garage', 0),
                    outside: get(formValue, 'properties.parking.outside', 0),
                },
                typology: {
                    ...get(state, 'property.activeSingleProperty.properties.typology', null),
                    bedrooms: get(formValue, 'properties.typology.bedrooms', 3),
                    bathrooms: get(formValue, 'properties.typology.bathrooms', 1),
                },
            },
        },
    });
};
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('GamingFlow', field, value));
    },
    handleReset(form, data) {
        (dispatch(reset(form, data)));
    },
    initForm(value) {
        dispatch(initializeForm('GamingFlow', value));
    },
    hanldeGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
    handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Bestimate);
