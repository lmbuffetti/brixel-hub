import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { change, initializeForm, MultiFileldsReduxForm } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import set from 'lodash/set';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compose } from 'redux';
import { QuestionsList } from '../../../resources/Flows/onBoardingBuyer';
const SearchProfileForm = (props) => {
    const [isReady, setIsReady] = useState(false);
    const match = useParams();
    const idSearchProfile = get(match, 'id', null);
    const { activeSingleCompany, changeFieldValue, formValue, initForm, lang, userSearchProfiles = [], } = props;
    // STATE
    const [fullForm, setFullForm] = useState([]);
    useEffect(() => {
        const inputform = [];
        const fields = [];
        QuestionsList(lang, 'searchProfile', changeFieldValue, 'SearchProfile').forEach((form) => {
            if (!form.hideSearchProfile)
                inputform.push(form);
            form.inputs && form.inputs.forEach((field) => {
                if (field.name && field.name !== 'location.countryCode') {
                    if (field.name.includes('location'))
                        fields.push('location');
                    else if (!field.name.includes('register'))
                        fields.push(field.name);
                }
            });
        });
        setFullForm(inputform);
        if (userSearchProfiles) {
            const getCurrentSearchProfile = userSearchProfiles.find((itm) => itm.id === idSearchProfile);
            const initialValue = {};
            fields.forEach((field) => {
                set(initialValue, field, get(getCurrentSearchProfile, field, ''));
                if (get(getCurrentSearchProfile, `${field}.max`, '') === null) {
                    if (field.includes('bedrooms'))
                        set(initialValue, `${field}.max`, 9);
                    else
                        set(initialValue, `${field}.max`, 300);
                }
                else {
                    set(initialValue, field, get(getCurrentSearchProfile, field, ''));
                }
            });
            initialValue.locations = get(getCurrentSearchProfile, 'location', []);
            initialValue.location = get(getCurrentSearchProfile, 'location[0]', {});
            const companyCountryCode = get(activeSingleCompany, 'country.code', '');
            set(initialValue, 'location.countryCode', get(getCurrentSearchProfile, 'location[0].countryCode', companyCountryCode));
            if (idSearchProfile)
                initialValue.id = idSearchProfile;
            if (!initialValue.isDefault)
                initialValue.isDefault = false;
            initForm(initialValue);
        }
    }, [userSearchProfiles, isReady]);
    useEffect(() => {
        const inputform = [];
        const fields = [];
        QuestionsList(lang, 'searchProfile', changeFieldValue, 'SearchProfile').forEach((form) => {
            if (!form.hideSearchProfile)
                inputform.push(form);
            form.inputs && form.inputs.forEach((field) => {
                if (field.name && field.name !== 'location.countryCode') {
                    if (field.name.includes('location'))
                        fields.push('location');
                    else if (!field.name.includes('register'))
                        fields.push(field.name);
                }
            });
        });
        setFullForm(inputform);
        // Delay on init form is necessary to be sure to load updated data
        setTimeout(() => { setIsReady(true); }, 100);
    }, [formValue]);
    return (React.createElement("div", { className: "flowWrapper" },
        React.createElement("div", { className: "packageFlow" },
            React.createElement("div", { id: "multiStepForm" },
                React.createElement(MultiFileldsReduxForm, { baseByData: baseByData, form: "SearchProfile", disableNextBtn: false, formValue: formValue, nestedInputs: fullForm, showSendButton: true, autofocus: false, lang: lang })))));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    formValue: get(state, 'brixelForm.SearchProfile.values', {}),
    lang: get(state, 'common.language', 'en'),
    userSearchProfiles: get(state, 'user.userSearchProfiles', []),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('SearchProfile', field, value));
    },
    initForm(value) {
        dispatch(initializeForm('SearchProfile', value));
    },
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(SearchProfileForm);
