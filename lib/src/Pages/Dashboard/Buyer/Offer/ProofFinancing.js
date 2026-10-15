import React, { useEffect, useState } from 'react';
import { change, destroy, initializeForm, reset } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { spinnerOff, spinnerOn, spinnerSmall } from '../../../../actions/CommonActions';
import { getActiveSingleCompany } from '../../../../actions/CompanyActions';
import { getActiveSingleProperty, saveActiveSingleProperty, } from '../../../../actions/PropertyActions';
import { doLogin, saveActiveSingleUser, validateUser } from '../../../../actions/UserActions';
import { QuestionsList } from '../../../../resources/Offers/ProofOfFinancing';
import FlowScreen from '../../../../components/FlowScreen';
const ProofFinancing = (props) => {
    const match = useParams();
    // PROPS
    const { activeSingleProperty, activeSingleCompany, changeFieldValue, company, destroyForm, formValue, handleGetActiveSingleProperty, handelSetSmallSpinner, initForm, initialValues, lang = 'en', } = props;
    const propID = get(match, 'propID', null);
    // STATE
    // SET THE QUESTIONS IN BASE OF THE COUNTRY
    const [questions, setQuestions] = useState(QuestionsList(changeFieldValue, lang));
    // SET QUEST TO FIRST QUESTION OF QuestionsList()
    // const [roomValue, setRoomValue] = useState('');
    // GET URL PARAMS
    // DESTROY FORM ON EXIT
    useEffect(() => {
        return () => destroyForm();
    }, []);
    useEffect(() => {
        if (!activeSingleProperty.id) {
            console.log('eh');
            handleGetActiveSingleProperty({ id: propID });
        }
    }, [propID]);
    useEffect(() => {
        setQuestions(QuestionsList(changeFieldValue, lang));
    }, [formValue]);
    // FUNCTION TO SAVE DATA
    const saveData = async () => {
        handelSetSmallSpinner({ sendData: true });
        setTimeout(() => {
            handelSetSmallSpinner({ sendData: false });
        }, 2000);
    };
    // SET DATA BY COMPANY
    useEffect(() => {
        initForm(initialValues);
    }, [get(company, 'id', null)]);
    return (React.createElement("div", { className: "flex-1" }, activeSingleCompany.id && (React.createElement(FlowScreen, { baseURL: `/buyer/${propID}/offerFlow/proofFinancig`, formName: "ProofOfFinancing", onSaveData: () => saveData(), QuestionsList: questions }))));
};
const mapStateToProps = (state) => {
    const initialValues = {
        propertyPrice: 100000,
    };
    return ({
        activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
        activeSingleProperty: get(state, 'property.activeSingleProperty', null),
        company: get(state, 'companies.activeSingleCompany', {}),
        errorValue: get(state, 'brixelForm.GetStarted.syncErrors', {}),
        formValue: get(state, 'brixelForm.GetStarted.values', {}),
        initialValues,
        isLoading: get(state, 'common.isLoading', 0) > 0,
        isTest: get(state, 'common.isTest', false),
        lang: get(state, 'common.language', 'de'),
        loggedInUser: get(state, 'user.loggedInUser.user', {}),
        packagesProperty: get(state, 'property.packagesProperty', []),
        startForm: get(state, 'brixelForm.GetStarted', null),
        translations: get(state, 'translations', {}),
    });
};
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('ProofOfFinancing', field, value));
    },
    destroyForm() {
        dispatch(destroy('ProofOfFinancing'));
    },
    initForm(value) {
        dispatch(initializeForm('ProofOfFinancing', value));
    },
    handleReset(initialValue) {
        (dispatch(reset('ProofOfFinancing', initialValue)));
    },
    handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
    handleDoLogin: bindActionCreators(doLogin, dispatch),
    handleGetActiveSingleCompany: bindActionCreators(getActiveSingleCompany, dispatch),
    handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
    handleSaveActiveSingleUser: bindActionCreators(saveActiveSingleUser, dispatch),
    handleSpinnerOn: bindActionCreators(spinnerOn, dispatch),
    handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
    handelSetSmallSpinner: bindActionCreators(spinnerSmall, dispatch),
    handleValidateUser: bindActionCreators(validateUser, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(ProofFinancing);
