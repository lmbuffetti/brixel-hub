import React, { useEffect, useRef, useState } from 'react';
import { BrixelButtonIcon, BrixelButtonSecondary, BrixelButtonText, BrixelDropdownMini, useOutsideAlerter, } from '@brixel-io/brixel-components';
import { BrixelRadioButton, change, initializeForm } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import set from 'lodash/set';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../../actions/CommonActions';
import { deleteUserSearchProfile, updateUserSearchProfile } from '../../../actions/SearchProfileActions';
import SearchProfileField from '../../../components/SearchProfileField';
import exclamationIcon from '../../../images/searchProfile/exclamation-icon.svg';
import { QuestionsList } from '../../../resources/Flows/onBoardingBuyer';
import { titleSearchProfile } from '../../../utils/titleCreationSearchProfile';
import translateTo from '../../../utils/translation';
const SearchProfileList = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const { activeSingleCompany, changeFieldValue, handleDeleteUserSearchProfile, handleSetModal, handleUpdateSearchProfile, initForm, isSmallLoading, lang, onChangeProfile, userActiveSearchProfileId, userSearchProfiles = [], } = props;
    // REF
    const optionsRef = useRef(null);
    // STATE
    const [isOptionsOpen, setIsOptionsOpen] = useState({
        id: undefined,
        active: false,
    });
    const [fieldsSearchProfile, setFieldsSearchProfile] = useState([]);
    useEffect(() => {
        const fields = [...fieldsSearchProfile];
        QuestionsList(lang, 'searchProfile', changeFieldValue, 'SearchProfile').forEach((inputs) => {
            if (inputs.inputs) {
                inputs.inputs.forEach((field) => {
                    if (field.name && field.name !== 'location.countryCode') {
                        if (field.name.includes('location'))
                            fields.push('location');
                        else if (!field.name.includes('register'))
                            fields.push(field.name);
                    }
                });
            }
        });
        setFieldsSearchProfile(fields);
    }, []);
    const editSearchProfile = (searchProfile) => {
        const initialValue = {};
        fieldsSearchProfile.forEach((field) => {
            if (get(searchProfile, field, '') === null) {
                set(initialValue, field, 9);
            }
            else {
                set(initialValue, field, get(searchProfile, field, ''));
            }
        });
        initForm(initialValue);
        history.push(`/buy/searchProfile/list/edit/${searchProfile.id}`);
    };
    const deleteSearchProfile = (profile) => {
        handleDeleteUserSearchProfile(profile);
        handleSetModal({
            state: false,
        });
    };
    const onDeleteSearchProfile = (profile) => {
        handleSetModal({
            // type: 'confirm',
            small: true,
            state: true,
            title: translateTo('Confirm Delete', lang),
            body: translateTo('Do you want to delete the selected search profile?', lang),
            bodyInnerClass: 'm-a ta-c',
            bodyClassColor: 'bgWhite dis-fl-col jc-b',
            classContainer: 'dis-b ta-c',
            titleImg: exclamationIcon,
            classImg: 'mx-a w-fix-48 mb-1 mt-4-neg',
            bodyActionsClass: 'dis-f a-c jc-c mt-5',
            classTitle: 'ta-c fSizePx18 fweight-600 dis-b mb-3-neg',
            multiBodyActions: [
                {
                    btnType: 'Secondary',
                    name: translateTo('No, keep it', lang),
                    round: true,
                    className: 'mr-1',
                    func: () => handleSetModal({}),
                },
                {
                    btnType: 'Primary',
                    name: translateTo('Yes, remove it', lang),
                    round: true,
                    className: 'ml-1',
                    func: () => deleteSearchProfile(profile),
                },
            ],
        });
    };
    const onSetDefaultSearchProfile = (searchProfile) => {
        handleUpdateSearchProfile({
            id: searchProfile.id,
            smallLoader: `saveData${searchProfile.id}`,
            dataSearchProfile: {
                isDefault: true,
            },
        });
        setIsOptionsOpen({
            id: undefined,
            active: false,
        });
    };
    // FUNCTION TO MANAGE THE CLICK OUTSIDE OF ELEMENT
    useOutsideAlerter(optionsRef, {
        action: 'function',
        func: () => setIsOptionsOpen({
            id: undefined,
            active: false,
        }),
    });
    return (React.createElement("div", { className: "mb-3" },
        React.createElement("div", { className: "dis-fl-col-rev dis-fl-row-md jc-b a-t" },
            React.createElement("div", { className: "w-perc-100 max-w-fix-264" },
                React.createElement("h5", { className: "fweight-600" }, translateTo('Your Search Profiles', lang)),
                React.createElement("p", { className: "txtText400 fsize-300" }, translateTo('Select the Search Profile you’d like to apply to filter properties.', lang))),
            React.createElement("div", { className: "ml-a mb-2 md-md-0" },
                React.createElement(BrixelButtonText, { label: translateTo('New Search Profile', lang), leftIcon: "plus", onClick: () => history.push('/buy/searchProfile/list/create') }))),
        userSearchProfiles && userSearchProfiles.map((searchProfile, i) => (React.createElement(React.Fragment, { key: `usrProfile${i.toString()}` }, searchProfile.id && (React.createElement("div", { key: `searchProfile${i.toString()}`, className: `searchProfileList brdSmall brdRadius p-2 p-md-3 mb-2 ${i.toString() === '0' ? 'mt-4' : ''} ${userActiveSearchProfileId === searchProfile.id ? 'bgBlue50 brdBlue200' : 'brdText50'}` },
            React.createElement("div", { className: `dis-f a-c jc-b ${userActiveSearchProfileId === searchProfile.id ? 'brdSmallBottom-md pb-md-3 mb-md-3 pb-2' : 'pb-2 pb-md-0'} brdBlue200` },
                React.createElement("div", { className: "dis-f a-t jc-fs w-perc-75" },
                    React.createElement(BrixelRadioButton, { disableDelay: true, input: {
                            value: userActiveSearchProfileId,
                            name: 'saerchProfileSelected',
                            onChange: (val) => onChangeProfile(val),
                            checkmarkColor: 'blue',
                        }, options: [{
                                index: i,
                                value: searchProfile.id,
                                label: searchProfile.name || titleSearchProfile(searchProfile, lang),
                            }] })),
                React.createElement("div", { className: "dis-f a-c jc-fe w-perc-20" },
                    searchProfile.isDefault && (React.createElement("div", { className: "mr-md-2 brdFullRadius bgBlue100 txtBlue700 fsize-300 py-small-4 px-1" }, translateTo('Default', lang))),
                    React.createElement("div", { className: "pos-r hide dis-b-md" },
                        React.createElement(BrixelButtonIcon, { isLoading: isSmallLoading[`saveData${searchProfile.id}`], icon: "options-vertical", className: "ml-a", theme: "text", bgTransparent: true, onClick: () => setIsOptionsOpen({
                                id: isOptionsOpen.id === searchProfile.id ? undefined : searchProfile.id,
                                active: !isOptionsOpen.active,
                            }) }),
                        (isOptionsOpen.id === searchProfile.id && isOptionsOpen.active) && (React.createElement(BrixelDropdownMini, { rightAligned: true, ref: optionsRef, topOffset: 48, links: [
                                {
                                    label: translateTo('Edit', lang),
                                    clickFunc: () => editSearchProfile(searchProfile),
                                    className: 'txtPrimary400',
                                },
                                {
                                    label: translateTo('Set as default', lang),
                                    clickFunc: () => onSetDefaultSearchProfile(searchProfile),
                                    className: 'txtPrimary400',
                                },
                                {
                                    label: translateTo('Delete', lang),
                                    clickFunc: () => onDeleteSearchProfile(searchProfile),
                                    className: 'txtRed400',
                                },
                            ] }))))),
            React.createElement("div", { className: userActiveSearchProfileId === searchProfile.id ? '' : 'hide-md' },
                React.createElement("div", { className: "hide dis-b-md" },
                    React.createElement("h6", null, translateTo('Filters applied', lang)),
                    React.createElement("p", { className: "txtText400 fsize-300" }, translateTo('Summary of all the filters applied', lang))),
                React.createElement("div", { className: "dis-f flex-wrap a-t mt-2" }, fieldsSearchProfile.map((field, index) => (React.createElement(React.Fragment, { key: `search${index.toString()}` }, field !== 'isDefault' && field !== 'name' && (React.createElement(React.Fragment, null,
                    React.createElement(SearchProfileField, { activeSingleCompany: activeSingleCompany, searchProfile: searchProfile, field: field, lang: lang, onClick: () => history.push(`/buy/searchProfile/list/edit/${searchProfile.id}`) }))))))),
                React.createElement("div", { className: `hide-md dis-f jc-fe brdSmallTop ${userActiveSearchProfileId === searchProfile.id ? 'brdBlue200' : 'brdText100'} mt-3 pt-2` },
                    React.createElement(BrixelButtonText, { theme: "red", rounded: true, label: translateTo('Delete', lang), onClick: () => onDeleteSearchProfile(searchProfile) }),
                    React.createElement(BrixelButtonSecondary, { rounded: true, className: "ml-2", label: translateTo('Edit', lang), onClick: () => editSearchProfile(searchProfile) }))))))))));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
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
    handleDeleteUserSearchProfile: bindActionCreators(deleteUserSearchProfile, dispatch),
    handleSetModal: bindActionCreators(setModal, dispatch),
    handleUpdateSearchProfile: bindActionCreators(updateUserSearchProfile, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(SearchProfileList);
