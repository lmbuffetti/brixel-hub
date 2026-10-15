import React, { useEffect, useState } from 'react';
import { BrixelInputText, BrixelTextArea, } from '@brixel-io/brixel-components/dist/form';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { BrixelButtonPrimary, BrixelButtonText, BrixelTooltip, BrixelIcon, Helpers, } from '@brixel-io/brixel-components';
import { saveMakeOffer } from '../../../../../actions/DealActions';
import translateTo from '../../../../../utils/translation';
const MakeOffer = (props) => {
    // PROPS
    const { activeSingleOffer, activeSingleProperty, closeModal, dealID, handleSaveMakeOffer, isSmallLoading, lang = 'en', } = props;
    const [formValue, setFormValue] = useState({ amount: 0, noteByBuyer: '' });
    useEffect(() => {
        if (isSmallLoading?.sendData === false) {
            closeModal();
        }
    }, [isSmallLoading]);
    // FUNCTION TO SAVE DATA
    const saveData = async () => {
        if (dealID && formValue?.amount) {
            const data = {
                amount: formValue?.amount,
                noteByBuyer: formValue?.noteByBuyer || '',
                id: dealID,
                smallLoader: 'sendData',
            };
            handleSaveMakeOffer(data);
        }
    };
    return (React.createElement("div", { className: "flex-1 dis-fl-col px-2 px-md-4 py-2" },
        React.createElement("div", { className: "bgBlue50 brdSmall brdBlue100 brdRadius dis-f a-c p-2" },
            React.createElement(BrixelIcon, { icon: "info", color: "blue", saturationTxt: 500 }),
            React.createElement("p", { className: "txtBlue500 ml-2" }, translateTo('We\'ve kept your previous details saved, so you only need to enter your new price.', lang))),
        React.createElement("div", { className: "bgText25 brdRadius dis-f a-c p-3 mt-3 jc-b" },
            React.createElement("div", { className: 'dis-fl-col' },
                React.createElement("span", { className: "mb-small-4 txtText700 fsize-300" }, translateTo('Listing price:', lang)),
                activeSingleProperty?.status === 'on-sale' && activeSingleProperty?.price?.total && (React.createElement("p", { className: "txtText800 dis-f a-c ff-mono" },
                    React.createElement("span", { className: "mr-1 ff-mono fsize-300 fsize-md-400" }, activeSingleProperty?.price?.currency),
                    React.createElement("span", { className: "ff-mono fsize-500 ff-mono fsize-md-500" }, Helpers.formatNumberValue(activeSingleProperty.price.total, activeSingleProperty?.price?.currency || 'CHF')))),
                activeSingleProperty?.status === 'on-request' && (React.createElement("span", { className: "txtText700 ff-mono fsize-500" }, translateTo('On Request', lang))),
                activeSingleProperty?.status === 'sold' && (React.createElement("span", { className: "txtRed700 ff-mono fsize-500" }, translateTo('Sold', lang))),
                activeSingleProperty?.status === 'reserved' && (React.createElement("span", { className: "txtBlue700 ff-mono fsize-500" }, translateTo('Reserved', lang)))),
            React.createElement("div", { className: "w-fix-small-1 h-fix-56 bgText200" }),
            React.createElement("div", { className: 'dis-fl-col' },
                React.createElement("span", { className: "mb-small-4 txtText700 fsize-300" }, translateTo('Last offer:', lang)),
                activeSingleOffer?.amount && (React.createElement("p", { className: "txtGreen400 dis-f a-c ff-mono" },
                    React.createElement("span", { className: "mr-1 ff-mono fsize-300 fsize-md-400" }, activeSingleOffer?.currency || 'CHF'),
                    React.createElement("span", { className: "ff-mono fsize-500 ff-mono fsize-md-500" }, Helpers.formatNumberValue(activeSingleOffer?.amount, activeSingleOffer?.currency || 'CHF')))))),
        React.createElement("div", { className: "mt-3" },
            React.createElement(BrixelInputText, { label: translateTo('Your new offer', lang), className: "", input: {
                    name: 'amount',
                    type: 'text',
                    onChange: (val) => setFormValue({ ...formValue, amount: val }),
                }, currency: activeSingleOffer?.currency || 'CHF', formatType: "price", unit: activeSingleOffer?.currency || 'CHF', large: true }),
            React.createElement(BrixelTextArea, { className: "mt-3", large: true, label: translateTo('Add a comment (optional)', lang), input: {
                    name: 'noteByBuyer',
                    type: 'text',
                    onChange: (val) => setFormValue({ ...formValue, noteByBuyer: val }),
                } }),
            React.createElement("div", { className: "dis-f a-c mt-3" },
                React.createElement("p", { className: "mr-1 mt-a mb-a fsize-200 txtText400" }, translateTo('This is a non-binding offer.', lang)),
                React.createElement(BrixelTooltip, { hideIcon: false, description: translateTo('This offer does not create any legal obligations and serves as a preliminary proposal. Final terms may change after further discussion.', lang) }))),
        React.createElement("div", { className: "dis-f mt-a jc-fe pt-md-4 pt-2" },
            React.createElement(BrixelButtonText, { className: "mr-2", theme: "text", onClick: () => closeModal(), label: translateTo('Cancel', lang) }),
            React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Submit', lang), onClick: () => saveData(), isLoading: isSmallLoading?.sendData }))));
};
const mapStateToProps = (state) => {
    return ({
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
export default compose(connect(mapStateToProps, mapDispatchToProps))(MakeOffer);
