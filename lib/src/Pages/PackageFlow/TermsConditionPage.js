import React, { useEffect, useState } from 'react';
import { change, destroy, initializeForm, reset } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { spinnerOff, spinnerOn, spinnerSmall } from '../../actions/CommonActions';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { createActiveSingleProperty, getActiveSingleProperty, saveActiveSingleProperty, setPageTermsAcceptance, } from '../../actions/PropertyActions';
import { doLogin, saveActiveSingleUser, validateUser } from '../../actions/UserActions';
import { QuestionsList } from '../../resources/Companies/TermsCondition/TermsConditionPage';
import FlowScreen from '../../components/FlowScreen';
import { getHistoryListings } from '../../actions/HistoryActions';
import TimelineStubs from '../../resources/Utilities/timelineActionStubs';
const TermsCondition = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleCompany, activeSingleProperty, destroyForm, formValue, handleAcceptPageTerms, handleGetActiveSingleCompany, handleGetActiveSingleProperty, handleGetHistoryTerms, handleSetSmallLoading, handleSpinnerOff, initForm, initialValues, lang = 'en', translations, } = props;
    // GET URL PARAMS
    const propID = get(match, 'pageID', null);
    // SET THE QUESTIONS IN BASE OF THE COUNTRY
    const [questions, setQuestions] = useState(QuestionsList(lang, activeSingleProperty?.acceptTermsOfContract));
    const [currentIndex, setCurrentIndex] = useState(0);
    // DESTROY FORM ON EXIT
    useEffect(() => {
        handleSpinnerOff();
        history.push(`/${propID}/termsConditionPage`);
        return () => destroyForm();
    }, []);
    // ON DID MOUNT I GET THE COMPANY DATA
    useEffect(() => {
        // GET THE COMPANY BY URL OR COOKIE
        if (activeSingleProperty.company && (!activeSingleCompany.id || activeSingleCompany.id !== activeSingleProperty.company)) {
            handleGetActiveSingleCompany({ id: activeSingleProperty.company });
        }
    }, [activeSingleProperty.id]);
    // ON DID MOUNT I GET THE COMPANY DATA
    useEffect(() => {
        if (!activeSingleProperty.id || activeSingleProperty.id !== propID) {
            handleGetActiveSingleProperty({
                fullVersion: true,
                id: propID,
            });
        }
        handleGetActiveSingleProperty({
            fullVersion: true,
            id: propID,
        });
        const payloadPageHistory = {
            actionStubs: TimelineStubs.TermsAcceptance,
            parent: propID,
            resultsPerPage: 10,
            offset: 0,
            order: 'createdAt',
            direction: 'DESC',
            smallLoader: 'getPageHistory',
            type: 'page',
        };
        handleGetHistoryTerms(payloadPageHistory);
    }, [propID]);
    // FUNCTION TO SAVE DATA
    const saveData = async () => {
        let payload = {
            id: propID || '',
            data: formValue,
        };
        if (handleSetSmallLoading)
            handleSetSmallLoading({ sendData: true });
        payload = {
            ...payload,
            smallLoader: 'sendData',
        };
        handleAcceptPageTerms(payload);
    };
    // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
    useEffect(() => {
        if (activeSingleCompany.stub) {
            setQuestions(QuestionsList(lang, activeSingleProperty?.acceptTermsOfContract));
        }
    }, [lang, activeSingleCompany.stub, translations, formValue]);
    // SET DATA BY COMPANY
    useEffect(() => {
        if (get(formValue, 'properties.propertyType', null) === null)
            initForm(initialValues);
    }, [get(activeSingleCompany, 'id', null)]);
    return (React.createElement(FlowScreen, { QuestionsList: questions, baseURL: `/${propID}/termsConditionPage`, closeLink: `/${propID}/home`, formName: "TermsCondition", newCurrentIndex: currentIndex, onChangeCurrentIndex: (index) => setCurrentIndex(index), onSaveData: () => saveData() }));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    activeSinglePropertyHistory: get(state, 'history.activeSinglePropertyHistory', {}),
    errorValue: get(state, 'brixelForm.TermsCondition.syncErrors', {}),
    formValue: get(state, 'brixelForm.TermsCondition.values', {}),
    initialValues: get(state, 'brixelForm.TermsCondition.initialValues', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    packagesProperty: get(state, 'property.packagesProperty', []),
    startForm: get(state, 'brixelForm.TermsCondition', null),
    translations: get(state, 'translations', null),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('TermsCondition', field, value));
    },
    destroyForm() {
        dispatch(destroy('TermsCondition'));
    },
    initForm(value) {
        dispatch(initializeForm('TermsCondition', value));
    },
    handleReset(val) {
        (dispatch(reset('TermsCondition', val)));
    },
    handleCreateActiveSingleProperty: bindActionCreators(createActiveSingleProperty, dispatch),
    handleAcceptPageTerms: bindActionCreators(setPageTermsAcceptance, dispatch),
    handleDoLogin: bindActionCreators(doLogin, dispatch),
    handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
    handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
    handleGetHistoryTerms: bindActionCreators(getHistoryListings, dispatch),
    handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
    handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
    handleSetSmallLoading: bindActionCreators(spinnerSmall, dispatch),
    handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
    handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
    handleValidateUser: bindActionCreators(validateUser, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(TermsCondition);
