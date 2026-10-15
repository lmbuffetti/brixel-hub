import React from 'react';
import { BrixelTooltip, BrixelIcon, FactsOptions, Helpers, } from '@brixel-io/brixel-components';
import MakeOfferPropertyCard from '../../../../../components/Cards/MakeOfferPropertyCard';
import { connect } from 'react-redux';
import get from 'lodash/get';
import translateTo from '../../../../../utils/translation';
import { DateTime } from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
const { factsOptions } = FactsOptions;
const objAnswer = {
    offerDetail: [
        {
            title: 'Type of purchase',
            name: 'additionalBuyerInfo.typeOfPurchase',
        },
        {
            title: 'Comment',
            name: 'noteByBuyer',
            classAnswer: 'fs-i',
        },
    ],
    personalDetail: [
        {
            title: 'Full name',
            name: 'additionalBuyerInfo.fullName',
        },
        {
            title: 'Email',
            name: 'additionalBuyerInfo.email',
        },
        {
            title: 'Phone number',
            name: 'additionalBuyerInfo.phone',
        },
        {
            title: 'Birth date',
            name: 'additionalBuyerInfo.dateBirth',
        },
        {
            title: 'Marital status',
            name: 'additionalBuyerInfo.maritialStatus',
        },
        {
            title: 'Matrimonial property regime',
            name: 'additionalBuyerInfo.matrimonialPropertyRegime',
        },
        {
            title: 'Living address',
            name: 'location',
        },
    ],
};
const MakeOfferResume = ({ formValue, lang, }) => {
    const purchaseType = factsOptions.purchaseType.find((item) => item.value === get(formValue, 'additionalBuyerInfo.typeOfPurchase', ''));
    const martialStatus = factsOptions.martialStatus.find((item) => item.value === get(formValue, 'additionalBuyerInfo.maritialStatus', ''));
    const matrimonialPropertyRegime = factsOptions.matrimonialPropertyRegime.find((item) => item.value === get(formValue, 'additionalBuyerInfo.matrimonialPropertyRegime', ''));
    const returnData = (item) => {
        if (item.name === 'additionalBuyerInfo.phone') {
            return Helpers.telephoneFormat(get(formValue, item.name, ''));
        }
        if (item.name === 'additionalBuyerInfo.dateBirth') {
            return DateTime.fromMillis(get(formValue, item.name, 0), { locale: lang }).toFormat('dd/MM/yyyy');
        }
        if (item.name === 'additionalBuyerInfo.typeOfPurchase') {
            return translateTo(purchaseType?.label || '', lang);
        }
        if (item.name === 'additionalBuyerInfo.maritialStatus') {
            return translateTo(martialStatus?.label || '', lang);
        }
        if (item.name === 'additionalBuyerInfo.matrimonialPropertyRegime') {
            return translateTo(matrimonialPropertyRegime?.label || '', lang);
        }
        if (item.name === 'location') {
            return `${get(formValue, item.name, {})?.street} ${get(formValue, item.name, {})?.streetNumber}, ${get(formValue, item.name, {})?.zipCode} ${get(formValue, item.name, {})?.city}`;
        }
        return get(formValue, item.name, '');
    };
    const showPDF = (data) => {
        const pdfWindow = window.open('');
        if (pdfWindow) {
            const base64Info = data.split('base64,');
            pdfWindow.document.write('<html<head><title>PDF</title><style>body{margin: 0px;}</style></head>');
            pdfWindow.document.write(`<body><embed width='100%' height='100%' src='${base64Info[0]}base64, ${encodeURI(base64Info[1])}#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>`);
            pdfWindow.document.close();
        }
    };
    return (React.createElement("div", { className: "max-w-fix-600 mx-a" },
        React.createElement(MakeOfferPropertyCard, null),
        React.createElement("div", { className: 'mt-4' },
            React.createElement("h6", { className: "mb-2 fweight-600" }, translateTo('Your offer details', lang)),
            React.createElement("div", { className: "brdRadius bgWhite brdSmall brdText100 p-3" },
                React.createElement("div", { className: "mb-3" },
                    React.createElement("p", { className: "fsize-300 fweight-500 mb-small-4" }, translateTo('Your offer', lang)),
                    React.createElement("p", { className: "fsize-600 txtGreen400" },
                        React.createElement("span", { className: "mr-1" }, formValue.currency),
                        React.createElement("span", { className: "ff-mono" }, Helpers.formatNumberValue(formValue.amount, formValue)))),
                objAnswer.offerDetail.map((item, index) => (React.createElement(React.Fragment, { key: `offerDetail${index.toString()}` }, get(formValue, item.name, '') && (React.createElement("div", { className: index < objAnswer.offerDetail.length - 1 ? 'mb-3' : '' },
                    React.createElement("p", { className: "fsize-300 fweight-500 mb-small-4" }, translateTo(item.title, lang)),
                    React.createElement("p", null, translateTo(returnData(item), lang)))))))),
            React.createElement("div", { className: "dis-f a-c mt-1" },
                React.createElement("p", { className: "mr-1 fsize-200 txtText400" }, translateTo('This is a non-binding offer.', lang)),
                React.createElement(BrixelTooltip, { description: translateTo('This offer does not create any legal obligations and serves as a preliminary proposal. Final terms may change after further discussion.', lang) }))),
        React.createElement("div", { className: "mt-4" },
            React.createElement("h6", { className: "mb-2 fweight-600" }, translateTo('Your personal details', lang)),
            React.createElement("div", { className: "brdRadius bgWhite brdSmall brdText100 p-3" }, objAnswer.personalDetail.map((item, index) => (React.createElement(React.Fragment, { key: `personalDetail${index.toString()}` }, get(formValue, item.name, '') && (React.createElement("div", { className: index < objAnswer.personalDetail.length - 1 ? 'mb-3' : '' },
                React.createElement("p", { className: "fsize-300 fweight-500 mb-small-4" }, translateTo(item.title, lang)),
                React.createElement("p", null, returnData(item))))))))),
        React.createElement("div", { className: "mt-4" },
            React.createElement("h6", { className: "mb-2 fweight-600" }, translateTo('Proof of financing', lang)),
            React.createElement("div", { className: "brdRadius bgWhite brdSmall brdText100 p-2" }, formValue.documents && formValue.documents.length > 0 ? (React.createElement(React.Fragment, null, formValue.documents.map((file, index) => (React.createElement("div", { key: index, className: `dis-f a-c jc-sb dis-f jc-b a-c ${index < formValue.documents.length - 1 ? 'mb-3' : ''}` },
                React.createElement("div", { className: "dis-f a-c" },
                    React.createElement(BrixelIcon, { background: "green", saturation: 100, color: "green", saturationTxt: 400, icon: "document" }),
                    React.createElement("p", { className: "fsize-300 ml-2" }, file.name)),
                React.createElement(BrixelButtonSecondary, { rounded: true, small: true, label: translateTo('View', lang), onClick: () => showPDF(file.file) })))))) : (React.createElement("div", { className: "dis-f a-t" },
                React.createElement(BrixelIcon, { icon: 'info', color: 'green' }),
                React.createElement("div", { className: "ml-1" },
                    React.createElement("p", { className: "fweight-600 fsize-300" }, translateTo('No proof of financing uploaded yet.', lang)),
                    React.createElement("p", { className: 'fsize-300' }, translateTo('You can apply for a free proof of financing from our partners later.', lang)))))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: state?.property?.activeSingleProperty || null,
    formValue: state?.brixelForm?.makeOffer?.values || {},
    lang: state?.common?.language || 'en',
});
export default connect(mapStateToProps, null)(MakeOfferResume);
