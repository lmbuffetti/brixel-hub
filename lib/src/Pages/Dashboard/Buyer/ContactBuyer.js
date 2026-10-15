import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import get from 'lodash/get';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrixelAvatar, BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonSecondary, BrixelButtonText, Helpers, } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
const ContactBuyer = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { contacts, lang, } = props;
    // URL PARAMS
    const propID = get(match, 'propID', null);
    const navigate = useNavigate();
    useEffect(() => {
        navigate(`/buyer/${propID}/property/page/contact`);
    }, [navigate]);
    return (React.createElement(React.Fragment, null,
        React.createElement("h3", { className: "mb-3 hide dis-b-lg  fweight-600" }, translateTo('Contact', lang)),
        React.createElement("div", { className: "dis-f h-perc-lg-100" },
            React.createElement("div", { className: "secondLevel dis-fl-col w-perc-100 h-perc-lg-100" },
                React.createElement("div", { className: "dis-fl-col backPanel hide-lg" },
                    React.createElement("h5", { className: "sectionTitle" }, translateTo('Contact', lang))),
                React.createElement("div", { className: "boxCard" },
                    React.createElement("div", { className: "dis-f jc-b" },
                        React.createElement("div", { className: "dis-f a-t" },
                            React.createElement(BrixelAvatar, { avatarImg: get(contacts, 'avatarUrl', undefined), name: get(contacts, 'name', '') ? get(contacts, 'name', '') : 'No Name', size: "M" }),
                            React.createElement("div", null,
                                React.createElement("h5", { className: "ml-3 mb-0" },
                                    React.createElement("span", { className: "dis-b" }, translateTo('Hello, I am', lang)),
                                    React.createElement("span", { className: "dis-b" }, get(contacts, 'name', '') ? get(contacts, 'name', '') : 'No Name')),
                                get(contacts, 'company', null) && (React.createElement("p", { className: "ml-3" },
                                    React.createElement("span", null, translateTo('from', lang)),
                                    React.createElement("span", null,
                                        "\u00A0",
                                        contacts.company))))),
                        React.createElement("div", { className: "hide-lg" },
                            React.createElement(BrixelButtonIcon, { icon: "close", theme: "text", bgTransparent: true, className: "as-c", onClick: () => history.push(-1) }))),
                    React.createElement("div", { className: "dis-f a-c my-3" },
                        get(contacts, 'phone.number', null) && (React.createElement(BrixelButtonText, { onClick: () => window.open(`tel:${contacts.phone}`), leftIcon: "call", label: Helpers.telephoneFormat(contacts.phone) })),
                        React.createElement(BrixelButtonText, { className: "ml-2", onClick: () => history.push(`/buyer/${propID}/property/contact/add`), leftIcon: "mail", label: translateTo('Ask a question', lang) })),
                    get(contacts, 'generalInformation', null) && (React.createElement("div", { className: "mb-4" },
                        React.createElement("h6", { className: "overline mb-2 mt-1" }, translateTo('INFO', lang)),
                        React.createElement("p", null, translateTo(get(contacts, 'generalInformation', ''), lang)))),
                    React.createElement("div", { className: "dis-f" },
                        React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Schedule visit', lang), onClick: () => history.push(`/buyer/${propID}/scheduleVisit`) }),
                        React.createElement(BrixelButtonSecondary, { className: "ml-2", rounded: true, label: translateTo('Make an offer', lang), onClick: () => history.push(`/buyer/${propID}/deal`) })))))));
};
const mapStateToProps = (state) => ({
    contacts: get(state, 'property.activeSingleProperty.contacts[0]', {}),
    lang: get(state, 'common.language', 'en'),
});
export default compose(connect(mapStateToProps, null))(ContactBuyer);
