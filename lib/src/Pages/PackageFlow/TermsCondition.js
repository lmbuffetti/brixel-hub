import React, { useEffect, useState } from 'react';
import { change, destroy, initializeForm, reset } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import set from 'lodash/set';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { spinnerOff, spinnerOn } from '../../actions/CommonActions';
import { getActiveSingleCompany } from '../../actions/CompanyActions';
import { createActiveSingleProperty, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { doLogin, saveActiveSingleUser, validateUser } from '../../actions/UserActions';
import { QuestionsList } from '../../resources/Companies/TermsCondition/TermsCondition';
import { setCookie } from '../../utils/helpers';
import FlowScreen from '../../components/FlowScreen';
const TermsCondition = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleCompany, changeFieldValue, company, destroyForm, formValue, handleGetActiveSingleCompany, handleSaveActiveSingleUser, handleSpinnerOff, initForm, initialValues, isSmallLoading, lang = 'en', loggedInUser, translations, } = props;
    // GET URL PARAMS
    const companyStub = get(match, 'companyStub', null);
    const userType = get(match, 'userType', null);
    // STATE
    const isBuyer = userType === 'buyer';
    // SET THE QUESTIONS IN BASE OF THE COUNTRY
    const [questions, setQuestions] = useState(QuestionsList(lang, activeSingleCompany, isBuyer));
    const [redirectURL, setRedirectURL] = useState('');
    // DESTROY FORM ON EXIT
    useEffect(() => {
        handleSpinnerOff();
        const parmsURL = queryString.parse(get(history, 'location.search', ''));
        const redURL = (get(parmsURL, 'url', '') || '').toString();
        setRedirectURL(redURL);
        localStorage.setItem('backUrl', redURL);
        history.push(`/termsConditionFlow/${companyStub}/${userType}`);
        return () => destroyForm();
    }, []);
    useEffect(() => {
        if (get(isSmallLoading, 'sentData', null) || get(isSmallLoading, 'sendData', null)) {
            const defaultRedirect = isBuyer ? '/buy' : '/sell';
            if (redirectURL && redirectURL.includes('https://'))
                window.location.assign(redirectURL || defaultRedirect);
            else
                history.push(redirectURL || defaultRedirect);
        }
    }, [get(isSmallLoading, 'sentData', null), get(isSmallLoading, 'sendData', null)]);
    // FUNCTION TO SAVE DATA
    const saveData = async (action = '') => {
        const data = {
            smallLoader: 'sendData',
            id: loggedInUser.id,
        };
        if (action === 'accept' && activeSingleCompany.stub === 'ubs') {
            set(data, 'termsUBS', true);
        }
        if (action === 'accept' && activeSingleCompany.stub === 'baloise') {
            set(data, 'termsBaloiseInsurance', true);
            set(data, 'termsBaloiseBank', true);
        }
        handleSaveActiveSingleUser(data);
    };
    // ON DID MOUNT I GET THE COMPANY DATA
    useEffect(() => {
        // GET THE COMPANY BY URL OR COOKIE
        handleGetActiveSingleCompany({ stub: companyStub });
    }, []);
    // ON CHANGE LANGUAGE RELOAD THE QUESTIONS TRANSLATED
    useEffect(() => {
        if (company.stub) {
            setQuestions(QuestionsList(lang, activeSingleCompany, isBuyer));
        }
    }, [lang, company.stub, translations, formValue]);
    // SET DATA BY COMPANY
    useEffect(() => {
        if (get(company, 'stub', null)) {
            setCookie('brixelStubCompany', company.stub);
            changeFieldValue('company', company.stub);
        }
        if (get(formValue, 'properties.propertyType', null) === null)
            initForm(initialValues);
    }, [get(company, 'id', null)]);
    return (React.createElement(FlowScreen, { baseURL: `/termsConditionFlow/${activeSingleCompany.stub}/${userType}`, formName: "TermsCondition", onSaveData: (action) => saveData(action), QuestionsList: questions }));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    company: get(state, 'companies.activeSingleCompany', {}),
    errorValue: get(state, 'brixelForm.TermsCondition.syncErrors', {}),
    formValue: get(state, 'brixelForm.TermsCondition.values', {}),
    initialValues: get(state, 'brixelForm.TermsCondition.initialValues', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    isLoading: get(state, 'common.isLoading', 0) > 0,
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
    handleDoLogin: bindActionCreators(doLogin, dispatch),
    handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
    handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
    handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
    handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
    handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
    handleValidateUser: bindActionCreators(validateUser, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(TermsCondition);
