import React from 'react';
import { BrixelIcon, FactsOptions, Helpers, } from '@brixel-io/brixel-components';
import { connect } from 'react-redux';
import get from 'lodash/get';
import translateTo from '../../../../../utils/translation';
import { DateTime } from 'luxon';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import PageHeader from '../../../../../components/Header/PageHeader';
import PageFooter from '../../../../../components/Footer/PageFooter';
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
            name: 'user.name',
        },
        {
            title: 'Email',
            name: 'user.email',
        },
        {
            title: 'Phone number',
            name: 'user.phone',
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
const MakeOfferModalView = ({ activeSingleOffer, closeModal, lang, loggedInUser, }) => {
    const purchaseType = factsOptions.purchaseType.find((item) => item.value === get(activeSingleOffer, 'additionalBuyerInfo.typeOfPurchase', ''));
    const martialStatus = factsOptions.martialStatus.find((item) => item.value === get(activeSingleOffer, 'additionalBuyerInfo.maritialStatus', ''));
    const matrimonialPropertyRegime = factsOptions.matrimonialPropertyRegime.find((item) => item.value === get(activeSingleOffer, 'additionalBuyerInfo.matrimonialPropertyRegime', ''));
    const returnData = (item) => {
        if (item.name.includes('user')) {
            if (item.name === 'user.phone') {
                return Helpers.telephoneFormat(get(loggedInUser, item.name, ''));
            }
            return get(loggedInUser, item.name, '');
        }
        if (item.name === 'additionalBuyerInfo.dateBirth') {
            return DateTime.fromMillis(get(activeSingleOffer, item.name, 0), { locale: lang }).toFormat('dd/MM/yyyy');
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
            return `${get(activeSingleOffer, item.name, {})?.street || ''} ${get(activeSingleOffer, item.name, {})?.streetNumber || ''}, ${get(activeSingleOffer, item.name, {})?.zipCode || ''} ${get(activeSingleOffer, item.name, {})?.city || ''}`;
        }
        return get(activeSingleOffer, item.name, '');
    };
    return (React.createElement("div", { className: "dis-fl-col bgText25" },
        React.createElement(PageHeader, { isFlow: true, onClose: () => closeModal(), showFooter: true }),
        React.createElement("div", { className: "max-w-fix-600 px-3 mx-a w-perc-100 h-perc-100" },
            React.createElement("h2", { className: "ta-c fweight-600 pt-3" }, translateTo('Your offer details', lang)),
            React.createElement("div", { className: 'mt-4' },
                React.createElement("h6", { className: "mb-2 fweight-600" }, translateTo('Your offer details', lang)),
                React.createElement("div", { className: "brdRadius bgWhite brdSmall brdText100 p-3" },
                    React.createElement("div", { className: "mb-3" },
                        React.createElement("p", { className: "fsize-300 fweight-500 mb-small-4" }, translateTo('Your offer', lang)),
                        React.createElement("p", { className: "fsize-600 txtGreen400" },
                            React.createElement("span", { className: "mr-1 ff-mono" }, activeSingleOffer.currency),
                            React.createElement("span", { className: "ff-mono" }, Helpers.formatNumberValue(activeSingleOffer.amount, activeSingleOffer.currency)))),
                    objAnswer.offerDetail.map((item, index) => (React.createElement(React.Fragment, { key: `offerDetail${index.toString()}` }, returnData(item) && (React.createElement("div", { className: index < objAnswer.offerDetail.length - 1 ? 'mb-3' : '' },
                        React.createElement("p", { className: "fsize-300 fweight-500 mb-small-4" }, translateTo(item.title, lang)),
                        React.createElement("p", { className: `txtText700 ${item.title === 'Comment' ? 'fs-i' : ''}` }, returnData(item))))))))),
            React.createElement("div", { className: "mt-4" },
                React.createElement("h6", { className: "mb-2 fweight-600" }, translateTo('Your personal details', lang)),
                React.createElement("div", { className: "brdRadius bgWhite brdSmall brdText100 p-3" }, objAnswer.personalDetail.map((item, index) => (React.createElement(React.Fragment, { key: `personalDetail${index.toString()}` }, returnData(item) && (React.createElement("div", { className: index < objAnswer.personalDetail.length - 1 ? 'mb-3' : '' },
                    React.createElement("p", { className: "fsize-300 fweight-500 mb-small-4" }, translateTo(item.title, lang)),
                    React.createElement("p", { className: 'txtText700' }, returnData(item))))))))),
            React.createElement("div", { className: "mt-4 pb-5" },
                React.createElement("h6", { className: "mb-2 fweight-600" }, translateTo('Proof of financing', lang)),
                React.createElement("div", { className: "brdRadius bgWhite brdSmall brdText100 p-2" }, activeSingleOffer.documents && activeSingleOffer.documents.length > 0 ? (React.createElement(React.Fragment, null, activeSingleOffer.documents.map((file, index) => (React.createElement("div", { key: index, className: `dis-f a-c jc-sb dis-f jc-b a-c ${index < activeSingleOffer.documents.length - 1 ? 'mb-3' : ''}` },
                    React.createElement("div", { className: "dis-f a-c mt-a mb-a" },
                        React.createElement(BrixelIcon, { background: "green", saturation: 100, color: "green", saturationTxt: 400, icon: "document" }),
                        React.createElement("p", { className: "fsize-300 ml-2 mt-a mb-a" }, file.name)),
                    React.createElement(BrixelButtonSecondary, { rounded: true, small: true, label: translateTo('View', lang), onClick: () => window.open(file.loadUrl, '_blank') })))))) : (React.createElement("div", { className: "dis-f a-t" },
                    React.createElement(BrixelIcon, { icon: 'info', color: 'green' }),
                    React.createElement("div", { className: "ml-1" },
                        React.createElement("p", { className: "fweight-600 fsize-300" }, translateTo('No proof of financing uploaded yet.', lang)),
                        React.createElement("p", { className: 'fsize-300' }, translateTo('You can apply for a free proof of financing from our partners later.', lang)))))))),
        React.createElement(PageFooter, null)));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: state?.property?.activeSingleProperty || null,
    activeSingleOffer: state?.deal?.activeSingleOffer || {},
    formValue: state?.brixelForm?.makeOffer?.values || {},
    lang: state?.common?.language || 'en',
    loggedInUser: state?.user?.loggedInUser || {},
});
export default connect(mapStateToProps, null)(MakeOfferModalView);
