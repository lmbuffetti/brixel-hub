import React, { useState } from 'react';
import { BrixelButtonPrimary, BrixelButtonText, Helpers } from '@brixel-io/brixel-components';
import { BrixelCheckbox, change } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { compose } from 'redux';
import FinancingQuestionImg from '../../../../images/Offer/financing_question.svg';
import RegisterKey4Img from '../../../../images/Offer/register_key4.svg';
import UploadKey4Img from '../../../../images/Offer/upload_key4.svg';
import translateTo from '../../../../utils/translation';
const FinanceCertificate = (props) => {
    const { activeSingleProperty, changeFieldValue, lang, onClick, } = props;
    // STATE
    const [checkedBox, setCheckedBox] = useState(false);
    const continueWithoutCert = () => {
        if (checkedBox) {
            changeFieldValue('financeCertificate', 1);
            changeFieldValue('skipFinanceTest', 1);
            changeFieldValue('noDocument', 1);
        }
        else {
            changeFieldValue('noDocument', 0);
        }
    };
    return (React.createElement("div", null,
        React.createElement("h2", { className: "fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6" }, translateTo('Apply for a financing certificate', lang)),
        React.createElement("div", { className: "max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50" },
            get(activeSingleProperty, 'location.countryCode', '') === 'CH' ? (React.createElement("div", { className: "p-5" },
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm jc-b a-t" },
                    React.createElement("div", { className: "dis-f-col w-perc-100 flex-1 a-c jc-fs ta-c" },
                        React.createElement("div", { className: "m-a w-fix-80 h-fix-80 brdCircle bgBlue100 dis-f a-c jc-c mb-1" },
                            React.createElement("img", { loading: "lazy", src: FinancingQuestionImg, alt: "Answer questions about financing" })),
                        React.createElement("p", { className: "txtText900 fsize-300 fweight-600 ta-c" }, translateTo('Answer questions about financing', lang))),
                    React.createElement("div", { className: "dis-f-col w-perc-100 flex-1 a-c jc-fs my-2 my-sm-0" },
                        React.createElement("div", { className: "m-a w-fix-80 h-fix-80 brdCircle bgBlue100 dis-f a-c jc-c mb-1" },
                            React.createElement("img", { loading: "lazy", src: RegisterKey4Img, alt: "Register on key4" })),
                        React.createElement("p", { className: "txtText900 fsize-300 fweight-600 ta-c" }, translateTo('Register on key4', lang))),
                    React.createElement("div", { className: "dis-f-col w-perc-100 flex-1 a-c jc-fs" },
                        React.createElement("div", { className: "m-a w-fix-80 h-fix-80 brdCircle bgBlue100 dis-f a-c jc-c mb-1" },
                            React.createElement("img", { loading: "lazy", src: UploadKey4Img, alt: "Upload documents on key4" })),
                        React.createElement("p", { className: "txtText900 fsize-300 fweight-600 ta-c" }, translateTo('Upload documents on key4', lang)))),
                React.createElement("div", { className: "mt-4" },
                    React.createElement("p", { className: "fsize-300 txtText900 pb-2" }, translateTo('The financing certificate is a quick, non-binding assessment of your financial situation and proof that you can afford the property you want provided by our partner key4 by UBS.', lang)),
                    React.createElement("p", { className: "fsize-300 txtText900" }, translateTo('The non-binding certificate is issued by our partner key4 by UBS, the real estate financing platform of UBS.', lang))),
                React.createElement(BrixelButtonPrimary, { onClick: () => onClick(), rounded: true, className: "mx-a mt-4", label: translateTo('Apply now', lang), rightIcon: "arrow-right" }),
                React.createElement("div", { className: "mt-4 mx-a ta-c w-fix-md-504" },
                    React.createElement("p", { className: "fsize-300 txtText500 fs-i" }, translateTo('Please be aware that key4 offers are only valid for persons with residency in Switzerland.', lang))))) : (React.createElement("div", { className: "p-5" },
                React.createElement("p", { className: "txtText900", dangerouslySetInnerHTML: { __html: Helpers.sanitizeText(translateTo('No problem.<br>We suggest checking your financing as soon as possible.', lang)) } }),
                React.createElement("p", { className: "txtText900 pt-2" }, translateTo('A pre-approved mortgage gets you ahead of unqualified buyers. That\'s how you can get one:', lang)),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm jc-b a-t mt-3" },
                    React.createElement("div", { className: "w-perc-100 flex-1 dis-f-col a-c jc-fs ta-c" },
                        React.createElement("div", { className: "m-a w-fix-80 h-fix-80 brdCircle bgBlue100 dis-f a-c jc-c mb-1" },
                            React.createElement("img", { loading: "lazy", src: FinancingQuestionImg, alt: "Answer questions about financing" })),
                        React.createElement("p", { className: "txtText900 fsize-300 fweight-600 ta-c" }, translateTo('Prepare your documents', lang))),
                    React.createElement("div", { className: "w-perc-100 flex-1 dis-f-col a-c jc-fs my-2 my-sm-0" },
                        React.createElement("div", { className: "m-a w-fix-80 h-fix-80 brdCircle bgBlue100 dis-f a-c jc-c mb-1" },
                            React.createElement("img", { loading: "lazy", src: RegisterKey4Img, alt: "Register on key4" })),
                        React.createElement("p", { className: "txtText900 fsize-300 fweight-600 ta-c" }, translateTo('Contact a financial provider', lang))),
                    React.createElement("div", { className: "w-perc-100 flex-1 dis-f-col a-c jc-fs" },
                        React.createElement("div", { className: "m-a w-fix-80 h-fix-80 brdCircle bgBlue100 dis-f a-c jc-c mb-1" },
                            React.createElement("img", { loading: "lazy", src: UploadKey4Img, alt: "Upload documents on key4" })),
                        React.createElement("p", { className: "txtText900 fsize-300 fweight-600 ta-c" }, translateTo('Attach the approval to your offer', lang)))),
                React.createElement("div", { className: "mt-3" },
                    React.createElement("p", { className: "fsize-300 txtText900" }, translateTo('Be aware Brixel is not in charge of the mortgage process.', lang))))),
            React.createElement("hr", { className: "brdText50" }),
            React.createElement("div", { className: "p-5" },
                React.createElement("span", { className: "dis-b pb-2 fsize-500 txtText900" }, translateTo('Continue without financing certificate.', lang)),
                React.createElement(BrixelCheckbox, { input: {
                        name: 'proofConfirm',
                        onChange: (val) => setCheckedBox(val[0]),
                    }, options: [{
                            label: translateTo('I hereby confirm that I will hand in my proof of financing later.', lang),
                            value: 'true',
                        }] }),
                React.createElement(BrixelButtonText, { disabled: !checkedBox, className: "mt-3 ml-a mr-a", label: translateTo('Continue', lang), rightIcon: "arrow-right", onClick: () => continueWithoutCert() })))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', null),
    lang: get(state, 'common.language', 'en'),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('offerFlow', field, value));
    },
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(FinanceCertificate);
