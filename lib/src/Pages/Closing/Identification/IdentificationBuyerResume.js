/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import { compose } from 'redux';
import get from 'lodash/get';
import isNaN from 'lodash/isNaN';
import isObject from 'lodash/isObject';
import { connect } from 'react-redux';
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonText, BrixelIcon, } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import { BrixelCheckbox, ReduxField, } from '@brixel-io/brixel-components/dist/form';
import { DateTime } from 'luxon';
import EditBuyerData from './EditBuyerData';
import { IdentificationQuestions } from '../../../resources/Deals/Identification';
const IdentificationBuyerResume = (props) => {
    // PROPS
    const { cardInput = [], dealID, formValue, isSmallLoading, lang, onBack, onClick, syncErrors, userType, } = props;
    // STATE
    const [editProfile, setEditProfile] = useState(-1);
    const [stepResume, setStepResume] = useState('resume');
    const [stepForm, setStepForm] = useState(0);
    const [agreeToProceed, setAgreeToProceed] = useState([]);
    const getBuyerData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'userData') || { inputs: [] };
    const onClickEdit = (id, formStep = 0) => {
        setStepResume('editProfile');
        setStepForm(formStep);
        setEditProfile(id);
    };
    const validateInput = () => {
        if (stepResume === 'editProfile' && stepForm === 0) {
            let isValid = true;
            if (get(syncErrors, `persons[${editProfile}]`, null)) {
                Object.keys(syncErrors.persons[editProfile]).forEach((key) => {
                    if (isObject(syncErrors.persons[editProfile][key])) {
                        Object.keys(syncErrors.persons[editProfile][key]).forEach((subkey) => {
                            if (isValid)
                                isValid = syncErrors.persons[editProfile][key][subkey] !== 'Required';
                        });
                    }
                    else if (isValid)
                        isValid = syncErrors.persons[editProfile][key] !== 'Required';
                });
            }
            return isValid;
        }
        if (stepResume === 'resume') {
            let isValid = true;
            if (syncErrors) {
                Object.keys(syncErrors).forEach((key) => {
                    if (isObject(syncErrors[key])) {
                        Object.keys(syncErrors[key]).forEach((subkey) => {
                            if (isValid)
                                isValid = syncErrors[key][subkey] !== 'Required' && syncErrors[key][subkey] !== 'Invalid IBAN';
                        });
                    }
                    else if (isValid)
                        isValid = syncErrors[key] !== 'Required' && syncErrors[key] !== 'Invalid IBAN';
                });
            }
            return isValid;
        }
        return true;
    };
    const formatTextForm = (txt, name) => {
        if (getBuyerData?.inputs) {
            const inputBuyerData = get(getBuyerData, 'inputs', []) || [];
            // TODO check
            //@ts-ignore
            const getField = inputBuyerData.find((fld) => fld.name === name);
            if (getField && getField.options) {
                const txtData = getField.options.find((fld) => fld.value === txt);
                if (txtData)
                    return txtData.label;
            }
        }
        return txt;
    };
    return (React.createElement("div", { className: "idFlow" },
        React.createElement(React.Fragment, null,
            stepResume === 'editProfile' && (React.createElement(React.Fragment, null,
                React.createElement(EditBuyerData, { dealID: dealID, forceStep: stepForm, profileId: editProfile, userType: userType }),
                React.createElement("div", { className: "footerAction flowFooter" },
                    React.createElement("div", { className: "pos-r mt-3" },
                        React.createElement("div", { className: "w-perc-100 max-w-fix-600 a-c dis-fl-row m-a flex-wrap jc-c mb-3" },
                            React.createElement(BrixelButtonIcon, { className: "backBtn ml-0", icon: "arrow-left-small", onClick: stepForm === 1 ? () => setStepForm(0) : () => setStepResume('resume'), theme: "text", themeSat: 300, ghost: true }),
                            React.createElement(BrixelButtonPrimary, { rounded: true, onClick: stepForm === 0 ? () => setStepForm(1) : () => setStepResume('resume'), rightIcon: "arrow-right-small", className: "ml-a mr-a noWrap", disabled: !validateInput(), label: translateTo('Next', lang) })))))),
            stepResume === 'resume' && (React.createElement(React.Fragment, null,
                React.createElement("h2", { className: "fweight-600 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6" }, translateTo(`Who is the ${userType} of the property?`, lang)),
                React.createElement("div", { className: "max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50" },
                    React.createElement("div", { className: "p-2 p-sm-5" },
                        React.createElement("p", { className: "mb-1" }, translateTo('Please fill in the full name as it is stated in your ID. Add all people who are legally buying the property, e.g. your spouse or an investment partner.', lang)),
                        get(formValue, 'persons', []).map((buyer, i) => (React.createElement("div", { className: "mt-2 bgBlue50x25 brdRadius p-2 dis-f a-c jc-b", key: `frm_${i.toString()}` },
                            React.createElement("div", { className: "dis-f a-c" },
                                React.createElement(BrixelIcon, { className: "mr-1", rounded: true, background: "white", saturation: 0, color: "green", icon: "account" }),
                                buyer.fullName && (React.createElement("span", { className: "txtGreen400" }, buyer.fullName))),
                            React.createElement("div", { className: "dis-f a-c" },
                                React.createElement(BrixelIcon, { className: "mr-2", color: "green", icon: get(buyer, 'document[0].id', null) || get(buyer, 'document[0].file', null) ? 'identity-card' : 'upload', onClick: () => onClickEdit(i, 1) }),
                                React.createElement(BrixelIcon, { color: "green", icon: "pencil", onClick: () => onClickEdit(i) }))))),
                        React.createElement(BrixelButtonText, { className: "mt-2 mb-2", label: translateTo('Add another person', lang), leftIcon: "plus", onClick: () => onClickEdit(get(formValue, 'persons', []).length) }),
                        React.createElement("hr", { className: "brdText50" }),
                        React.createElement("p", { className: "mt-3" }, translateTo('Please give us your bank details to simplify the reservation process.', lang)),
                        React.createElement("div", { className: "w-perc-100" }, cardInput.map((field, i) => (React.createElement("div", { className: `${field.classWidthBox ? field.classWidthBox : 'w-perc-100'} ${field.classBoxWrapper || 'mt-3'}`, key: `crd_${i.toString()}` },
                            React.createElement(ReduxField, { form: "Identification", component: field.component, design: {
                                    cardLayout: field.cardLayout,
                                    cardSmall: field.cardSmall,
                                    className: field.className || '',
                                    classNameParent: field.classNameParent || '',
                                    fluid: field.fluid,
                                    iconClass: field.iconClass,
                                    inputClassName: field.className || '',
                                    isHorizontal: field.isHorizontal,
                                    pdClass: field.pdClass,
                                    large: field.large,
                                    svgSupport: field.svgSupport,
                                    svgWidth: field.svgWidth,
                                }, input: {
                                    name: field.name,
                                    options: field.options,
                                    placeholder: field.placeholder || '',
                                    validate: field.validation,
                                }, labels: {
                                    icons: field.icons,
                                    label: translateTo(get(field, 'label', ''), lang),
                                    labelLeft: translateTo(get(field, 'labelLeft', ''), lang),
                                    labelType: field.labelType,
                                } }))))))),
                React.createElement("div", { className: "footerAction flowFooter" },
                    React.createElement("div", { className: "pos-r mt-3" },
                        React.createElement("div", { className: "w-perc-100 max-w-fix-600 a-c dis-fl-row m-a flex-wrap jc-c mb-3" },
                            React.createElement(BrixelButtonIcon, { className: "backBtn ml-0", icon: "arrow-left-small", onClick: () => onBack(), theme: "text", themeSat: 300, ghost: true }),
                            React.createElement(BrixelButtonPrimary, { rounded: true, disabled: !validateInput(), onClick: () => setStepResume('checkData'), rightIcon: "arrow-right-small", className: "ml-a mr-a noWrap", label: translateTo('Next', lang) })))))),
            stepResume === 'checkData' && (React.createElement(React.Fragment, null,
                React.createElement("h2", { className: "fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6" }, translateTo(`Who is the ${userType} of the property?`, lang)),
                React.createElement("div", { className: "max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50" },
                    React.createElement("div", { className: "p-2 p-sm-5" },
                        React.createElement("h6", { className: "fweight-400" }, translateTo('Great, thank you.', lang)),
                        React.createElement("h6", { className: "fweight-400" }, translateTo('Are all these details correct? Please review all inputs as they will be later used for the notary.', lang)),
                        get(formValue, 'persons', []).map((buyer, i) => (React.createElement("div", { className: "mt-2 bgBlue50x25 brdRadius py-2 px-4", key: `frm_${i.toString()}` },
                            React.createElement("div", { className: "dis-f a-c jc-b" },
                                buyer.fullName && (React.createElement("span", { className: "txtGreen400" }, buyer.fullName)),
                                React.createElement("div", null,
                                    React.createElement(BrixelIcon, { color: "green", icon: "pencil", onClick: () => onClickEdit(i) }))),
                            React.createElement("div", { className: "dis-f a-t flex-wrap" }, get(getBuyerData, 'inputs', []).map((data, f) => (React.createElement("div", { className: "w-perc-50 mt-2", key: `byrDt_${f.toString()}` }, data.name.includes('currentLivingAddress.address') ? (React.createElement(React.Fragment, null,
                                React.createElement("span", { className: "fsize-300 txtText400" }, translateTo('Address', lang)),
                                React.createElement("p", { className: "fsize-300" },
                                    React.createElement("span", null, get(formValue, `persons[${i}].currentLivingAddress.address`, '')),
                                    get(formValue, `persons[${i}].currentLivingAddress.zipCode`, '') && (React.createElement("span", null,
                                        ", ",
                                        get(formValue, `persons[${i}].currentLivingAddress.zipCode`, ''))),
                                    get(formValue, `persons[${i}].currentLivingAddress.city`, '') && (React.createElement("span", { className: "ml-small-4" }, get(formValue, `persons[${i}].currentLivingAddress.city`, '')))))) : (React.createElement(React.Fragment, null, !data.name.includes('currentLivingAddress') && (React.createElement(React.Fragment, null, get(formValue, data.name.replace('[0]', `[${i}]`)) && (React.createElement(React.Fragment, null,
                                React.createElement("span", { className: "fsize-300 txtText400" }, data.label),
                                data.name.includes('date') ? (React.createElement("p", { className: "fsize-300" }, !isNaN(+get(formValue, data.name.replace('[0]', `[${i}]`), '')) ? (DateTime.fromMillis(get(formValue, data.name.replace('[0]', `[${i}]`), '')).toFormat('d/MM/yyyy')) : (''))) : (React.createElement("p", { className: "fsize-300" }, formatTextForm(get(formValue, data.name.replace('[0]', `[${i}]`), ''), data.name)))))))))))))))),
                        React.createElement(BrixelCheckbox, { className: "mt-4", input: {
                                name: 'agreeToProceed',
                                onChange: (val) => setAgreeToProceed(val),
                                value: agreeToProceed,
                            }, options: [{
                                    label: translateTo('I hereby confirm that all the informations are correct to proceed with the sales process.', lang),
                                    value: 'true',
                                }] }))),
                React.createElement("div", { className: "footerAction flowFooter" },
                    React.createElement("div", { className: "pos-r mt-3" },
                        React.createElement("div", { className: "w-perc-100 max-w-fix-600 a-c dis-fl-row m-a flex-wrap jc-c mb-3" },
                            React.createElement(BrixelButtonIcon, { className: "backBtn ml-0", icon: "arrow-left-small", onClick: () => setStepResume('resume'), theme: "text", themeSat: 300, ghost: true }),
                            React.createElement(BrixelButtonPrimary, { rounded: true, onClick: () => onClick(), rightIcon: "arrow-right-small", className: "ml-a mr-a noWrap", label: translateTo('Save', lang), disabled: !agreeToProceed[0], isLoading: isSmallLoading.sendData })))))))));
};
const mapStateToProps = (state) => ({
    syncErrors: get(state, 'brixelForm.Identification.syncErrors', {}),
    formValue: get(state, 'brixelForm.Identification.values', {}),
    lang: get(state, 'common.language', 'en'),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
});
export default compose(connect(mapStateToProps, null))(IdentificationBuyerResume);
