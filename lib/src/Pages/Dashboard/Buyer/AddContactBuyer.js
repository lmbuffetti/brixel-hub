import React, { useEffect, useState } from 'react';
import { BrixelIcon, BrixelModal } from '@brixel-io/brixel-components';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { phonecode } from '@brixel-io/brixel-components/dist/constants/CountryCodePhone';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import ContactForm from '../../../components/ContactForm';
import translateTo from '../../../utils/translation';
// COMPONENTS
const AddContactBuyer = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { activeSingleProperty, isSmallLoading, lang, } = props;
    const [currentStep, setCurrentStep] = useState('message');
    const [action, setAction] = useState();
    useEffect(() => {
        if (isSmallLoading.sendMessage === 'savedBooking' || isSmallLoading.sendMessage === 'sentMessage') {
            setCurrentStep('sentMessage');
        }
    }, [isSmallLoading]);
    const buttonActions = () => {
        let btn = undefined;
        if (currentStep === 'message') {
            btn = [
                {
                    name: translateTo('Send', lang),
                    func: () => setAction('send'),
                    btnType: 'Primary',
                    className: 'mr-1',
                    bkg: 'primary',
                    isLoading: isSmallLoading.sendMessage === true,
                    sat: 400,
                    round: true,
                },
            ];
        }
        return btn;
    };
    return (React.createElement(BrixelModal, { multiActions: buttonActions(), onClose: () => history.push(`/buyer/${activeSingleProperty.id}/property/page`), id: "contact-foreground", layout: "large" },
        currentStep === 'message' && (React.createElement("div", { className: "dis-fl-col test" },
            React.createElement("section", { className: "titleSection" },
                React.createElement("h4", { className: "mb-2 txtText900" }, translateTo('About you', lang)),
                React.createElement("h5", { className: "heading6 txtText900" }, translateTo('How can we reach you?', lang)),
                React.createElement("div", { className: "min-h-\n              fix-320" },
                    React.createElement(ContactForm, { action: action, resetAction: () => setAction(undefined), onChangeAction: (val) => setAction(val || undefined) }))))),
        currentStep === 'sentMessage' && (React.createElement("div", { id: "messageSent", className: "dis-fl-col jc-b h-perc-100 mb-2-neg" },
            React.createElement("section", { className: "titleSection" },
                React.createElement("h6", { className: "mb-1 txtGreen400 dis-f a-bl" }, translateTo('YOUR MESSAGE WAS SENT', lang)),
                React.createElement("h4", { className: "mb-2 txtText900" }, translateTo('Thank you', lang)),
                React.createElement("h5", { className: "heading6 txtText900" }, translateTo('We will contact you as soon as possible.', lang))),
            React.createElement("section", { className: "bodySection mx-2-neg px-2 bgWhite shadow-1dp brdRadiusTop pt-2 pb-4 mx-sm-5-neg px-sm-5 mb-1-neg" },
                React.createElement("p", { className: "mb-2" },
                    React.createElement("b", null, translateTo('Here are 3 tips for a smooth process', lang))),
                React.createElement("ul", null,
                    React.createElement("li", null,
                        React.createElement(BrixelIcon, { icon: "tour", color: "green", background: "green", saturation: 200, saturationTxt: 700 }),
                        React.createElement("div", null,
                            React.createElement("span", null, translateTo('Make sure you visited the', lang)),
                            "\u00A0",
                            React.createElement("span", { className: "txtPrimary400 cur-poi", onClick: () => window.open(`${baseByData?.pageUrl}${activeSingleProperty.stub}/explore/tour`, '_blank') },
                                React.createElement("span", null, translateTo('3D Tour', lang))))),
                    React.createElement("li", { className: "redIcon" },
                        React.createElement(BrixelIcon, { icon: "favorite-house", color: "green", background: "green", saturation: 200, saturationTxt: 700 }),
                        React.createElement("span", null, translateTo('Do not forget to favorite the property to keep all the information in one place', lang))),
                    React.createElement("li", { className: "redIcon" },
                        React.createElement(BrixelIcon, { icon: "money", color: "green", background: "green", saturation: 200, saturationTxt: 700 }),
                        React.createElement("span", null, translateTo('Get in touch with your bank about financing before you visit', lang)))))))));
};
const mapStateToProps = (state) => {
    const companyCountryCode = get(state, 'companies.activeSingleCompany.country.code', 'CH');
    const countryPhoneCode = phonecode.find((code) => code.code === companyCountryCode);
    const activeSingleCompany = get(state, 'companies.activeSingleCompany', {});
    activeSingleCompany.defaultDialCode = countryPhoneCode?.dial_code;
    return ({
        activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
        activeSingleCompany,
        formValue: get(state, 'brixelForm.Property.values', get(state, 'property.activeSingleProperty', {})),
        loggedInUser: get(state, 'user.loggedInUser.user', {}),
        lang: get(state, 'common.language', 'en'),
        isSmallLoading: get(state, 'common.isSmallLoading', {}),
    });
};
export default compose(connect(mapStateToProps, null))(AddContactBuyer);
