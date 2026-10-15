import React from 'react';
import { connect } from 'react-redux';
import { BrixelButtonSecondary, Helpers, } from '@brixel-io/brixel-components';
import translateTo from '../../../../../utils/translation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import get from 'lodash/get';
import PhoneIcon from '../../../../../images/Boutique/phoneIcon.svg';
import MessageIcon from '../../../../../images/Boutique/messageIcon.svg';
import MailIcon from '../../../../../images/Boutique/mailIcon.svg';
import DocumentFullIcon from '../../../../../images/documentsIcon/documentFull.svg';
const ProofOfFinancingThankYou = ({ activeSingleProperty, activeSingleCompany, formValue, lang, }) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const propID = get(match, 'propID', null);
    const isElegible = formValue.affordabilityCheck && formValue.loanValueCheck;
    const documentsList = [
        'Latest tax declaration',
        'Latest proof of income, incl. proof of bonus if applicable',
        'Pension fund statement',
    ];
    const brochurePDF = activeSingleProperty?.documents ? activeSingleProperty?.documents.find((doc) => doc.isBrochure) : null;
    return (React.createElement(React.Fragment, null, isElegible ? (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "max-w-fix-456 ml-a mr-a brdRadius bgWhite brdSmall brdText50 p-3 p-sm-4" },
            React.createElement("p", { className: "fweight-600" }, translateTo('To ensure a smooth process, please prepare the following documents:', lang)),
            React.createElement("div", null,
                documentsList.map((doc, index) => (React.createElement("div", { key: `docsList${index.toString()}`, className: "dis-f a-c mt-2" },
                    React.createElement("img", { width: 40, height: 40, src: DocumentFullIcon, alt: doc, className: "mr-2" }),
                    React.createElement("span", null, translateTo(doc, lang))))),
                brochurePDF && (React.createElement("div", { className: "dis-f a-c mt-2" },
                    React.createElement("img", { width: 40, height: 40, src: DocumentFullIcon, alt: "Property Expos\u00E9", className: "mr-2" }),
                    React.createElement("span", null, translateTo('Property exposé -', lang)),
                    React.createElement("a", { href: brochurePDF?.loadUrl || '', className: "td-u ml-1 txtText900", target: "_blank", rel: "noreferrer" }, translateTo('download here', lang))))),
            React.createElement("p", { className: "txtText600 mt-3 fsize-300 fs-i" }, translateTo('You can check this later again.', lang))),
        React.createElement(BrixelButtonSecondary, { bgTransparent: true, rounded: true, label: translateTo('Go back to Offer', lang), onClick: () => history.push(`/buyer/${propID}/offer`), className: "mt-4 mx-a" }))) : (React.createElement(React.Fragment, null,
        React.createElement(BrixelButtonSecondary, { bgTransparent: true, rounded: true, label: translateTo('Go back to Offer', lang), onClick: () => history.push(`/buyer/${propID}/offer`), className: "mt-4 mx-a" }),
        React.createElement("div", { className: "dis-fl-col dis-fl-row-md a-c jc-c mx-a mt-10 contactSection" },
            React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-md as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-md-auto w-perc-100" },
                React.createElement("div", { className: "bgGreen100 brdCircle p-1" },
                    React.createElement("img", { loading: "lazy", className: "w-fix-40 w-fix-md-56", src: PhoneIcon, alt: "Call Us" })),
                React.createElement("div", { className: "dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-md-3" },
                    React.createElement("h6", null, translateTo('Call us', lang)),
                    React.createElement("span", { className: 'dis-b cur-poi txtGreen400 td-u', onClick: () => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true)) }, Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))))),
            React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-md as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-md-auto w-perc-100 mx-md-2" },
                React.createElement("div", { className: "bgGreen100 brdCircle p-1" },
                    React.createElement("img", { loading: "lazy", className: "w-fix-40 w-fix-md-56", src: MessageIcon, alt: "Call Us" })),
                React.createElement("div", { className: "dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-md-3" },
                    React.createElement("h6", null, translateTo('Text us via WhatsApp', lang)),
                    React.createElement("span", { className: 'dis-b cur-poi txtGreen400 td-u', onClick: () => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''), false, false, true)) }, Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''))))),
            React.createElement("div", { className: "dis-fl-row dis-fl-col-md a-c mb-2 mb-lg-0 ta-c-md as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-md-auto w-perc-100" },
                React.createElement("div", { className: "bgGreen100 brdCircle p-1" },
                    React.createElement("img", { loading: "lazy", className: "w-fix-40 w-fix-md-56", src: MailIcon, alt: "Call Us" })),
                React.createElement("div", { className: "dis-fl-col a-fs a-c-lg pl-2 pl-lg-0 mt-md-3" },
                    React.createElement("h6", null, translateTo('Write us', lang)),
                    React.createElement("span", { className: 'dis-b cur-poi txtGreen400 td-u', onClick: () => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`) }, get(activeSingleCompany, 'contact.email', '')))))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: state?.property?.activeSingleProperty || {},
    activeSingleCompany: state?.companies?.activeSingleCompany || {},
    formValue: get(state, 'brixelForm.ProofOfFinancing.values', {}),
    windowDimensions: get(state, 'common.windowDimensions', {}),
    lang: state?.common?.language || 'en',
});
export default connect(mapStateToProps, null)(ProofOfFinancingThankYou);
