import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ThankYouImg from '../../images/Boutique/Doc_House.svg';
import translateTo from '../../utils/translation';
import get from 'lodash/get';
import MessageIcon from '../../images/Boutique/messageIcon.svg';
import PhoneIcon from '../../images/Boutique/phoneIcon.svg';
import MailIcon from '../../images/Boutique/mailIcon.svg';
import { BrixelButtonText, Helpers, } from '@brixel-io/brixel-components';
const BrixelBoutiqueThankYou = (props) => {
    const { activeSingleCompany, lang, } = props;
    return (React.createElement("div", { className: "h-perc-100 max-w-fix-600 mx-a pt-32" },
        React.createElement("div", { className: "ta-c" },
            React.createElement("img", { src: ThankYouImg }),
            React.createElement("h2", { className: "boutiqueFont mt-5" }, translateTo('Thank You', lang)),
            React.createElement("p", { className: "mt-2" }, translateTo('Our Boutique experts will contact you shortly to clarify any questions and to proceed with the next steps.', lang))),
        React.createElement("div", { className: "mt-10" },
            React.createElement("b", { className: "ta-c dis-b" }, translateTo('We look forward to hearing from you', lang)),
            React.createElement("div", { className: "dis-fl-col dis-fl-row-sm flex-wrap jc-b-sm jc-fs mt-3" },
                React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-sm" },
                    React.createElement("img", { loading: "lazy", className: "w-fix-56 w-fix-lg-104", src: PhoneIcon, alt: "Call Us" }),
                    React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-sm" },
                        React.createElement("div", { className: "dis-fl-col as-fs a-c-lg pl-2 pl-lg-0 mt-3" },
                            React.createElement("h6", null, translateTo('Give us a call', lang)),
                            React.createElement(BrixelButtonText, { bgTransparent: true, onClick: () => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true)), label: Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', '')) })))),
                React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c  mb-2 mb-lg-0 ta-c-sm" },
                    React.createElement("img", { loading: "lazy", className: "w-fix-56 w-fix-lg-104", src: MessageIcon, alt: "Call Us" }),
                    React.createElement("div", { className: "dis-fl-col pl-2 pl-lg-0 mt-3" },
                        React.createElement("h6", null, translateTo('Message us on WhatsApp', lang)),
                        React.createElement("div", { className: 'as-c-sm' },
                            React.createElement(BrixelButtonText, { bgTransparent: true, onClick: () => window.open(`https://wa.me/${get(activeSingleCompany, 'contact.whatsapp.prefix', '')}${get(activeSingleCompany, 'contact.whatsapp.number', '')}`, '_blank'), label: Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', '')) })))),
                React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-sm" },
                    React.createElement("img", { loading: "lazy", className: "w-fix-56 w-fix-lg-104", src: MailIcon, alt: "Call Us" }),
                    React.createElement("div", { className: "dis-fl-col as-fs a-c-lg pl-2 pl-lg-0 mt-3" },
                        React.createElement("h6", null, translateTo('Send us an email', lang)),
                        React.createElement(BrixelButtonText, { bgTransparent: true, onClick: () => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`), label: get(activeSingleCompany, 'contact.email', '') })))))));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: state?.companies?.activeSingleCompany || {},
    lang: state?.common?.language || 'de',
});
export default compose(connect(mapStateToProps, null))(BrixelBoutiqueThankYou);
