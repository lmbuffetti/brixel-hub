import React, { useEffect, useState } from 'react';
import { change, destroy, initializeForm, reset } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { spinnerOff, spinnerSmallOff } from '../../actions/CommonActions';
import { getActiveSingleProperty, saveActiveSingleProperty, } from '../../actions/PropertyActions';
import { QuestionsList } from '../../resources/Deals/visitFeedback';
import { titleSearchProfile } from '../../utils/titleCreationSearchProfile';
import FlowScreen from '../../components/FlowScreen';
import set from 'lodash/set';
import { sendVisitFeedback } from '../../actions/DealActions';
import { createUser, doLogin } from '../../actions/UserActions';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
export const initVal = {};
const VisitFeedback = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleCompany, activeSingleProperty, changeFieldValue, destroyForm, formValue, handleCreateUser, handleDoLogin, handleGetActiveSingleProperty, handleGetActiveSingleCompany, handleSendVisitFeedback, handleSetIsSmallLoading, lang = 'en', loggedInUser, translations, } = props;
    const urlLocation = get(history, 'location.search', null);
    const urlParams = {};
    if (urlLocation) {
        const urlParamsSplitted = urlLocation.replace('?', '').split('&');
        urlParamsSplitted.forEach((param) => {
            const splitted = param.split('=');
            urlParams[splitted[0]] = splitted[1];
        });
    }
    const pageID = get(match, 'pageID', null);
    const dealID = get(match, 'dealID', null);
    const visitID = get(match, 'visitID', null);
    // STATE
    // SET THE QUESTIONS IN BASE OF THE COUNTRY
    const [questions, setQuestions] = useState(QuestionsList(lang, formValue));
    const [currentIndex, setCurrentIndex] = useState(0);
    // SET QUEST TO FIRST QUESTION OF QuestionsList()
    const [newCurrentIndex, setNewCurrentIndex] = useState(0);
    const [isEnableSave, setIsEnableSave] = useState(false);
    const status = urlParams.status === 'true';
    const { email } = urlParams;
    useEffect(() => {
        if (email) {
            changeFieldValue('register.email', email.toString());
        }
        if (typeof urlParams.status !== 'undefined') {
            changeFieldValue('status', urlParams.status === 'true');
            const data = {
                id: dealID,
                visitID: visitID,
                smallLoader: 'sendVisit',
                sendSlack: false,
                isInterested: status,
            };
            handleSendVisitFeedback(data);
        }
    }, [status]);
    useEffect(() => {
        if (activeSingleProperty.id) {
            handleGetActiveSingleCompany({ id: activeSingleProperty.company });
        }
    }, [activeSingleProperty.id]);
    // DESTROY FORM ON EXIT
    useEffect(() => {
        handleSetIsSmallLoading({});
        if (!activeSingleProperty.id || activeSingleProperty.id !== pageID) {
            const data = {
                fullVersion: false,
                smallLoader: 'property',
                id: pageID,
            };
            handleGetActiveSingleProperty(data);
        }
        return () => destroyForm();
    }, [pageID]);
    // FUNCTION TO SAVE DATA
    const saveData = () => {
        if (questions[newCurrentIndex].history === 'createProfile') {
            const { register } = formValue;
            const { login } = formValue;
            if (formValue.signupScreen === 'login') {
                const user = {
                    user: {
                        username: login.email.toLowerCase(),
                        password: login.password,
                    },
                    forceRedirect: formValue.redirectLink,
                };
                handleDoLogin(user);
            }
            else {
                const user = {
                    user: {
                        email: (register?.email || '').toLowerCase(),
                        acceptTerms: get(register, 'privacy[0]', true),
                        acceptMarketing: get(register, 'acceptMarketing[0]', false),
                        name: get(formValue, 'register.name', ''),
                        userType: 'seller',
                        signupAccept: true,
                        signupChannel: get(formValue, 'channel', 'default'),
                        signupProduct: null,
                        language: lang,
                        createUser: true,
                        company: activeSingleCompany.stub,
                        ignoreEmail: false,
                        seller: true,
                        forceRedirect: formValue.redirectLink,
                    },
                    forceRedirect: formValue.redirectLink,
                };
                handleCreateUser(user);
            }
        }
        else {
            const defFormValue = { ...formValue };
            delete defFormValue.owner;
            const data = {
                ...formValue,
                id: dealID,
                visitID: visitID,
                smallLoader: 'sendVisit',
                sendSlack: true,
                isInterested: status,
            };
            if (formValue.status)
                set(data, 'link', `/buyer/${activeSingleProperty.id}/offerFlow/MakeOffer/makeOffer`);
            setNewCurrentIndex(newCurrentIndex + 1);
            handleSendVisitFeedback(data);
        }
    };
    useEffect(() => {
        let isEnable = false;
        Object.keys(formValue).forEach((key) => {
            if (typeof formValue[key] === 'string' && formValue[key]) {
                isEnable = true;
            }
            if (typeof formValue[key] === 'object' && formValue[key].length > 0) {
                isEnable = true;
            }
        });
        setIsEnableSave(isEnable);
    }, [formValue]);
    // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
    useEffect(() => {
        setQuestions(QuestionsList(lang, formValue));
        setNewCurrentIndex(currentIndex);
    }, [lang, translations, formValue, currentIndex]);
    // GET THE NEXT DATA IN BASE OF CURRENT ANSWER
    useEffect(() => {
        const rooms = get(formValue, 'characteristics.bedrooms', {});
        const propertyType = get(formValue, 'characteristics.propertyType', []);
        const locations = get(formValue, 'locations', []);
        const searchProfileName = get(formValue, 'name', null);
        if (propertyType.length > 0 && locations.length > 0 && rooms.max && !searchProfileName) {
            changeFieldValue('name', titleSearchProfile(formValue, lang));
        }
    }, [get(formValue, get(questions, `[${currentIndex}].inputs[0].name`, ''), null)]);
    const onClickSuccessButton = (redirecLink) => {
        if (!loggedInUser.id) {
            changeFieldValue('redirectLink', redirecLink);
            setNewCurrentIndex(newCurrentIndex + 1);
        }
        else {
            history.push(redirecLink);
        }
    };
    const buttons = () => {
        const btn = [];
        if (!status) {
            btn.push({
                className: 'mx-a',
                type: 'primary',
                label: 'Create Search Profile',
                func: () => onClickSuccessButton(`/packageFlow/getStartedBuyer/${activeSingleCompany.stub}/propertyType`),
            });
        }
        else {
            btn.push({
                className: 'mx-a',
                type: 'primary',
                label: 'Add offer',
                func: () => onClickSuccessButton(`/buyer/${activeSingleProperty.id}/offerFlow/MakeOffer/makeOffer`),
            });
        }
        btn.push({
            type: 'text',
            className: 'mt-2 mx-a',
            func: () => onClickSuccessButton('/buy'),
            label: 'Or go back Home',
        });
        return btn;
    };
    return (React.createElement(React.Fragment, null, activeSingleCompany.id && (React.createElement("div", { className: "customFlow" },
        React.createElement(FlowScreen, { disableEmailRegister: true, isSaveEnable: isEnableSave, closeLink: `/buyer/${pageID}/home`, closeButton: newCurrentIndex === 0, closeLabelFlow: "Cancel", baseURL: `/visitFeedback/${dealID}/${pageID}/${dealID}`, onChangeCurrentIndex: (index) => setCurrentIndex(index), newCurrentIndex: newCurrentIndex, formName: "VisitFeedback", onSaveData: () => saveData(), QuestionsList: questions, successCustomButtons: buttons(), closeLabel: "Back to home", saveLabel: "Send" })))));
};
const mapStateToProps = (state) => {
    return ({
        activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
        activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
        company: get(state, 'companies.activeSingleCompany', {}),
        errorValue: get(state, 'brixelForm.VisitFeedback.syncErrors', {}),
        formValue: get(state, 'brixelForm.VisitFeedback.values', {}),
        isLoading: get(state, 'common.isLoading', 0) > 0,
        lang: get(state, 'common.language', 'en'),
        loggedInUser: get(state, 'user.loggedInUser.user', {}),
        packagesProperty: get(state, 'property.packagesProperty', []),
        startForm: get(state, 'brixelForm.VisitFeedback', null),
        translations: get(state, 'translations', {}),
    });
};
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('VisitFeedback', field, value));
    },
    destroyForm() {
        dispatch(destroy('VisitFeedback'));
    },
    initForm(value) {
        dispatch(initializeForm('VisitFeedback', value));
    },
    handleReset(initialValue) {
        (dispatch(reset('VisitFeedback', initialValue)));
    },
    handleCreateUser: bindActionCreators(createUser, dispatch),
    handleDoLogin: bindActionCreators(doLogin, dispatch),
    handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
    handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
    handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
    handleSendVisitFeedback: bindActionCreators(sendVisitFeedback, dispatch),
    handleSetIsSmallLoading: bindActionCreators(spinnerSmallOff, dispatch),
    handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(VisitFeedback);
