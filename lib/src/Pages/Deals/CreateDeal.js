import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import { BrixelButtonIcon, BrixelButtonPrimary, FactsOptions } from '@brixel-io/brixel-components';
import translateTo from '../../utils/translation';
import { BrixelInputPhone, BrixelInputText, BrixelSelect, destroy, initializeForm, ReduxField, reset, } from '@brixel-io/brixel-components/dist/form';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { createDeal } from '../../actions/DealActions';
// COMPONENTS
import SplashScreen from '../../components/SplashScreen';
import ProgressBar from '../../components/ProgressBar';
const CreateDeal = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const { activeSingleCompany, activeSingleProperty, destroyForm, formValue, lang, handleCreateDeal, } = props;
    const { factsOptions, } = FactsOptions;
    useEffect(() => () => destroyForm(), []);
    const actionOptions = [
        {
            label: 'Marked Page as favorite',
            value: 'add-favorite',
        },
        {
            label: 'Wrote message',
            value: 'message',
        },
        {
            label: 'Scheduled a visit',
            value: 'schedule',
        },
        {
            label: 'Accessed a document',
            value: 'get-document',
        },
        {
            label: 'Phone call',
            value: 'phone-call',
        },
    ];
    const checkValidateField = () => {
        let isValid = false;
        if (get(formValue, 'email', null) && get(formValue, 'name', null) && get(formValue, 'stage', null) && get(formValue, 'actionStub', null))
            isValid = true;
        return isValid;
    };
    const createNewDeal = () => {
        const payload = {
            link: `/${activeSingleProperty.id}/prospects`,
            page: activeSingleProperty.id,
            leadName: formValue.name,
            leadEmail: formValue.email,
            leadPhone: formValue.phone,
            company: activeSingleCompany.stub,
            stage: formValue.stage,
            actionStub: formValue.actionStub,
        };
        handleCreateDeal(payload);
    };
    return (React.createElement(SplashScreen, { closeLink: `/${activeSingleProperty.id}/prospects`, className: "create-deal", closeOutside: false },
        React.createElement("div", { className: "add-deal-container w-perc-100 h-perc-100 dis-fl-col p-2 p-lg-0" },
            React.createElement("div", { className: "dis-f jc-b a-c mb-4" },
                React.createElement("h5", null, translateTo('Create new deal', lang)),
                React.createElement("div", null,
                    React.createElement(BrixelButtonIcon, { bgTransparent: true, theme: "text", icon: "close-small", onClick: () => history.push(`/${activeSingleProperty.id}/prospects`) }))),
            React.createElement("div", { className: "dis-fl-col max-w-fix-520 w-perc-100 h-perc-100 ml-a mr-a" },
                React.createElement(ReduxField, { form: "CreateDeal", design: {
                        className: 'w-perc-100 mb-2',
                    }, input: {
                        name: 'name',
                        placeholder: 'Name',
                    }, labels: {
                        label: translateTo('Name', lang),
                    }, component: BrixelInputText }),
                React.createElement(ReduxField, { form: "CreateDeal", design: {
                        className: 'w-perc-100 mb-2',
                    }, input: {
                        name: 'email',
                        placeholder: 'email@brixel.io',
                        type: 'email',
                    }, labels: {
                        label: translateTo('Email', lang),
                    }, component: BrixelInputText }),
                React.createElement(ReduxField, { form: "CreateDeal", design: {
                        className: 'w-perc-100 mb-2',
                    }, input: {
                        name: 'phone',
                        type: 'text',
                        placeholder: '123456789',
                    }, labels: {
                        label: translateTo('Phone', lang),
                    }, component: BrixelInputPhone }),
                React.createElement(ReduxField, { form: "CreateDeal", design: {
                        className: 'w-perc-100 mb-2',
                    }, input: {
                        name: 'stage',
                        placeholder: translateTo('Select deal stage', lang),
                        options: factsOptions.progressBarDealsOptions,
                        progressState: '',
                        readOnly: false,
                    }, labels: {
                        label: translateTo('Stage', lang),
                    }, component: ProgressBar }),
                React.createElement(ReduxField, { form: "CreateDeal", design: {
                        className: 'w-perc-100 mb-2',
                    }, input: {
                        name: 'actionStub',
                        placeholder: translateTo('Select deal action', lang),
                        options: actionOptions,
                    }, labels: {
                        label: translateTo('Action', lang),
                    }, component: BrixelSelect })),
            React.createElement("div", null,
                React.createElement(BrixelButtonPrimary, { disabled: !checkValidateField(), rounded: true, onClick: () => createNewDeal(), label: translateTo('Create deal', lang), className: "as-fe", rightIcon: "arrow-right-small" })))));
};
const mapStateToProps = (state) => ({
    isLoading: get(state, 'common.isLoading', 0) > 0,
    activeSingleCompany: get(state, 'companies.activeSingleCompany', null),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    formValue: get(state, 'brixelForm.CreateDeal.values', {}),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleReset(data) {
        (dispatch(reset('CreateDeal', data)));
    },
    initForm(value) {
        dispatch(initializeForm('CreateDeal', value));
    },
    destroyForm() {
        dispatch(destroy('CreateDeal'));
    },
    handleCreateDeal: bindActionCreators(createDeal, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(CreateDeal);
