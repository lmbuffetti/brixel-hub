import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Helpers, } from '@brixel-io/brixel-components';
import { saveMakeOffer } from '../../../../../actions/DealActions';
import translateTo from '../../../../../utils/translation';
import DocumentFullIcon from '../../../../../images/documentsIcon/documentFull.svg';
import PhoneIcon from '../../../../../images/Boutique/phoneIcon.svg';
import get from 'lodash/get';
import MessageIcon from '../../../../../images/Boutique/messageIcon.svg';
import MailIcon from '../../../../../images/Boutique/mailIcon.svg';
const documentsList = [
    'Latest tax declaration',
    'Latest proof of income, incl. proof of bonus if applicable',
    'Pension fund statement',
];
const ProofOfFinancingModalPrepare = (props) => {
    // PROPS
    const { activeSingleProperty, activeSingleCompany, lang = 'en', } = props;
    const brochurePDF = activeSingleProperty?.documents ? activeSingleProperty?.documents.find((doc) => doc.isBrochure) : null;
    return (React.createElement("div", null,
        React.createElement("div", { className: "px-2 px-sm-3 pb-3" },
            React.createElement("div", null,
                documentsList.map((doc, index) => (React.createElement("div", { key: `docsList${index.toString()}`, className: "dis-f a-c mt-2" },
                    React.createElement("img", { width: 40, height: 40, src: DocumentFullIcon, alt: doc, className: "mr-2" }),
                    React.createElement("span", null, translateTo(doc, lang))))),
                brochurePDF && (React.createElement("div", { className: "dis-f a-c mt-2" },
                    React.createElement("img", { width: 40, height: 40, src: DocumentFullIcon, alt: "Property Expos\u00E9", className: "mr-2" }),
                    React.createElement("div", { className: "dis-f flex-wrap" },
                        React.createElement("span", { className: 'no-wrap' }, translateTo('Property exposé -', lang)),
                        React.createElement("a", { href: brochurePDF?.loadUrl || '', className: "td-u ml-1 no-wrap txtText900", target: "_blank", rel: "noreferrer" }, translateTo('download here', lang))))))),
        React.createElement("hr", null),
        React.createElement("div", { className: "p-2" },
            React.createElement("p", { className: 'pb-2 fsize-300 txtText700' }, translateTo('If you need immediate help, you can also:', lang)),
            React.createElement("div", { className: "dis-fl-col a-c jc-c mx-a" },
                React.createElement("div", { className: "dis-fl-row a-c mb-2 as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-100" },
                    React.createElement("div", { className: "" },
                        React.createElement("img", { loading: "lazy", className: "w-fix-40", src: PhoneIcon, alt: "Call us" })),
                    React.createElement("div", { className: "dis-f a-fs pl-2 fsize-300 flex-wrap" },
                        React.createElement("h6", { className: "fsize-300 pr-1" }, translateTo('Call us', lang)),
                        React.createElement("span", { className: 'dis-b cur-poi txtGreen400 td-u', onClick: () => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''), false, false, true)) }, Helpers.telephoneFormat(get(activeSingleCompany, 'contact.phone', ''))))),
                React.createElement("div", { className: "dis-fl-row a-c mb-2 as-fs  min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-100" },
                    React.createElement("div", { className: "" },
                        React.createElement("img", { loading: "lazy", className: "w-fix-40", src: MessageIcon, alt: "Call Us" })),
                    React.createElement("div", { className: "dis-f a-fs pl-2 fsize-300 flex-wrap" },
                        React.createElement("h6", { className: "fsize-300 pr-1" }, translateTo('Text us via WhatsApp', lang)),
                        React.createElement("span", { className: 'dis-b cur-poi txtGreen400 td-u', onClick: () => window.location.assign(Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''), false, false, true)) }, Helpers.telephoneFormat(get(activeSingleCompany, 'contact.whatsapp', ''))))),
                React.createElement("div", { className: "dis-fl-row a-c mb-2 as-fs min-w-fix-240 bgGreen25 p-1 brdRadius w-perc-100" },
                    React.createElement("div", { className: "" },
                        React.createElement("img", { loading: "lazy", className: "w-fix-40", src: MailIcon, alt: "Call Us" })),
                    React.createElement("div", { className: "dis-f a-fs pl-2 fsize-300 flex-wrap" },
                        React.createElement("h6", { className: "fsize-300 pr-1" }, translateTo('Write us', lang)),
                        React.createElement("span", { className: 'dis-b cur-poi txtGreen400 td-u', onClick: () => window.location.assign(`mailto:${get(activeSingleCompany, 'contact.email', '')}`) }, get(activeSingleCompany, 'contact.email', ''))))))));
};
const mapStateToProps = (state) => {
    return ({
        activeSingleCompany: state?.companies?.activeSingleCompany || {},
        activeSingleProperty: state?.property?.activeSingleProperty || {},
        activeSingleOffer: state?.deal?.activeSingleOffer || {},
        dealID: state?.deal?.activeSingleDeal?.id || null,
        isSmallLoading: state?.common?.isSmallLoading || {},
        lang: state?.common?.language || 'de',
    });
};
const mapDispatchToProps = (dispatch) => ({
    handleSaveMakeOffer: bindActionCreators(saveMakeOffer, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(ProofOfFinancingModalPrepare);
