import React, { useEffect, useState } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon, Helpers, } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import { BrixelTextArea, change, destroy, initializeForm, ReduxField } from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { setSplashType, spinnerSmall } from '../../../actions/CommonActions';
import { saveReviewOffer, setActiveSingleDeal } from '../../../actions/DealActions';
const ReviewOffer = (props) => {
    const { activeSingleDeal, activeSingleOffer, activeSingleProperty, destroyForm, formValue, handleReviewOffer, handleSetActiveSingleDeal, handleSmallSpinner, isSmallLoading, lang, setSplashScreen, } = props;
    // STATE
    const [success, setSuccess] = useState(null);
    const closeOverlay = () => {
        setSplashScreen('');
        handleSmallSpinner({ saveOffer: false });
    };
    useEffect(() => () => destroyForm(), []);
    useEffect(() => {
        if (isSmallLoading.saveOffer === 'done') {
            setSuccess(false);
        }
        if (isSmallLoading.saveOffer === 'close') {
            setSuccess(false);
        }
    }, [isSmallLoading]);
    const saveData = (action) => {
        if (action) {
            const dataForm = cloneDeep(formValue);
            dataForm.status = action;
            dataForm.id = activeSingleDeal.id;
            const newDealData = cloneDeep(activeSingleDeal);
            dataForm.action = action;
            if (action === 'saveNote') {
                dataForm.smallLoader = 'saveOffer';
                dataForm.status = success;
                newDealData.closing.stageOffer.offer.noteBySeller = dataForm.note;
                newDealData.closing.stageOffer.offer.status = (success || '').toString();
                handleSetActiveSingleDeal(newDealData);
                if (dataForm.id === 'sample') {
                    setSuccess(false);
                    return false;
                }
                handleReviewOffer(dataForm);
            }
            else if (action === 'accepted')
                dataForm.smallLoader = 'saveOffer';
            else
                dataForm.smallLoader = 'saveOffer';
            if (action !== 'saveNote')
                setSuccess(action);
        }
        else {
            closeOverlay();
        }
        return null;
    };
    const openDocument = (e, id) => {
        if (e)
            e.preventDefault();
        if (activeSingleOffer.offer.documents) {
            const currentDoc = activeSingleOffer.offer.documents.find((doc) => doc.id === id);
            if (currentDoc)
                window.open(currentDoc.loadUrl, '_blank');
        }
    };
    return (React.createElement(React.Fragment, null,
        activeSingleDeal.id === 'sample' && (React.createElement("div", { className: `dis-f p-3 pb-2 ${activeSingleDeal.id === 'sample' ? 'jc-b a-c' : 'jc-fe'}` },
            React.createElement("div", { className: "ml-2 brdRadiusSmall brdSmall bgPrimary100 txtPrimary400 p-small-4 fsize-200 ex-tag" }, translateTo('Example only', lang)))),
        get(activeSingleOffer, 'offer.status', null) === 'pending' || success ? (React.createElement("div", { className: "dis-fl-col jc-c pb-2 px-7" }, success ? (React.createElement(React.Fragment, null,
            success === 'accepted' ? (React.createElement("h3", { className: "ta-c" }, translateTo('Accept offer 👍', lang))) : (React.createElement("h3", { className: "ta-c" }, translateTo('Decline offer 👎', lang))),
            React.createElement("h6", { className: "fsize-200 pb-1 mt-5" }, translateTo('Asking Price', lang)),
            get(activeSingleProperty, 'price.total', 0) > 0 ? (React.createElement("p", { className: "txtText900 fweight-400" },
                React.createElement("span", { className: "mr-small-4" }, get(activeSingleProperty, 'price.currency', '')),
                React.createElement("span", { className: "ff-mono fSizePx20" }, Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))))) : (React.createElement("p", { className: "txtText900 fweight-400" }, translateTo('On Request', lang))),
            React.createElement("h6", { className: "fsize-200 pb-1 pt-3" }, translateTo('Offer Price', lang)),
            success === 'accepted' ? (React.createElement("p", { className: "txtText900 fweight-400 txtGreen400" },
                React.createElement("span", { className: "mr-small-4" }, get(activeSingleOffer, 'offer.currency', '')),
                React.createElement("span", { className: "ff-mono fSizePx20" }, Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', ''))))) : (React.createElement("p", { className: "txtRed400 txtText900 fweight-400" },
                React.createElement("span", { className: "mr-small-4" }, get(activeSingleOffer, 'offer.currency', '')),
                React.createElement("span", { className: "ff-mono fSizePx20" }, Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', ''))))),
            React.createElement(ReduxField, { component: BrixelTextArea, form: "Offer", design: {
                    className: 'mt-3',
                }, input: {
                    name: 'note',
                    placeholder: translateTo('Add comment or note for buyer', lang),
                }, labels: {
                    label: translateTo('Message', lang),
                } }),
            React.createElement("div", { className: "dis-f mt-3" },
                React.createElement(BrixelIcon, { icon: "info" }),
                React.createElement("p", { className: "fsize-300 txtText600 ml-2" }, success === 'accepted' ? (React.createElement(React.Fragment, null, translateTo('You hearby accept this offer. Legally this is non-biding but needed for the process to be continued.', lang))) : (React.createElement(React.Fragment, null, translateTo('You hearby decline this offer. Legally this is non-biding but needed for the process to be continued.', lang))))),
            React.createElement("div", { className: "dis-f jc-b a-c mt-5" },
                React.createElement(BrixelButtonIcon, { icon: "arrow-left-small", theme: "text", onClick: () => setSuccess(null), bgTransparent: true }),
                React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Send', lang), isLoading: isSmallLoading.saveOffer === true, onClick: () => saveData('saveNote') })))) : (React.createElement(React.Fragment, null,
            React.createElement("h3", { className: "ta-c" }, translateTo('Review offer', lang)),
            React.createElement("div", { className: "w-perc-100 mt-5" },
                React.createElement("h6", { className: "fsize-200 pb-1" }, translateTo('Asking Price', lang)),
                get(activeSingleProperty, 'price.total', 0) > 0 ? (React.createElement("p", { className: "txtText900 fweight-400" },
                    React.createElement("span", { className: "mr-small-4" }, get(activeSingleProperty, 'price.currency', '')),
                    React.createElement("span", { className: "ff-mono fSizePx20" }, Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))))) : (React.createElement("p", { className: "txtText900 fweight-400" }, translateTo('On Request', lang))),
                React.createElement("h6", { className: "fsize-200 pb-1 pt-3" }, translateTo('Offer Price', lang)),
                React.createElement("p", { className: "txtText900 fweight-400 txtGreen400" },
                    React.createElement("span", { className: "mr-small-4" }, get(activeSingleOffer, 'offer.currency', '')),
                    React.createElement("span", { className: "ff-mono fSizePx20" }, Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', '')))),
                get(activeSingleOffer, 'offer.documents[0].name', null) && (React.createElement("div", { onClick: (e) => openDocument(e, get(activeSingleOffer, 'offer.documents[0].id', '')), className: "cur-poi" },
                    React.createElement("h6", { className: "fsize-200 pb-1 pt-3" }, translateTo('Proof of financing from bank', lang)),
                    React.createElement("div", { className: "dis-f a-c" },
                        React.createElement(BrixelIcon, { className: "mr-1", icon: "document", background: "blue", saturation: 100, color: "blue", saturationTxt: 700 }),
                        React.createElement("p", { className: "txtText900 pl-small-4" }, get(activeSingleOffer, 'offer.documents[0].name', ''))))),
                React.createElement("h6", { className: "fsize-200 pb-1 pt-3" }, translateTo('Message', lang)),
                React.createElement("p", { className: "txtText900" },
                    React.createElement("i", null, get(activeSingleOffer, 'offer.noteByBuyer', '-') || '-')),
                React.createElement("div", { className: "dis-f mt-5" },
                    React.createElement(BrixelIcon, { icon: "info", color: "text", saturationTxt: 300 }),
                    React.createElement("p", { className: "txtText500 ml-2" }, translateTo('This is a non-binding offer. The buyer will be notified about your decision.', lang)))),
            React.createElement("div", { className: "dis-f jc-b a-c mt-5" },
                React.createElement(BrixelButtonSecondary, { rounded: true, theme: "red", label: translateTo('Decline 👎', lang), onClick: () => saveData('rejected'), isLoading: isSmallLoading.saveOffer === true }),
                React.createElement(BrixelButtonSecondary, { bgTransparent: true, theme: "green", rounded: true, label: translateTo('Accept 👍', lang), onClick: () => saveData('accepted'), isLoading: isSmallLoading.saveOffer === true })))))) : (React.createElement("div", { className: "dis-fl-col jc-c pb-2 px-7" },
            get(activeSingleOffer, 'offer.status', null) === 'accepted' ? (React.createElement("h3", { className: "ta-c txtGreen400" }, translateTo('Offer accepted 👍', lang))) : (React.createElement("h3", { className: "ta-c txtRed400" }, translateTo('Offer declined 👎', lang))),
            React.createElement("div", { className: "w-perc-100 mt-5" },
                React.createElement("h6", { className: "fsize-200 pb-1 pt-3" }, "Offer Price"),
                React.createElement("p", { className: `txtText900 fweight-400 ${get(activeSingleOffer, 'offer.status', null) === 'accepted' ? 'txtGreen400' : 'txtRed400'}` },
                    React.createElement("span", { className: "mr-small-4" }, get(activeSingleOffer, 'offer.currency', '')),
                    React.createElement("span", { className: "ff-mono fSizePx20" }, Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', '')))),
                get(activeSingleOffer, 'offer.documents[0].name', null) && (React.createElement("div", { onClick: () => window.open(`${baseByData?.shortPath}${get(activeSingleOffer, 'offer.documents[0].path', '')}`, '_blank'), className: "cur-poi" },
                    React.createElement("h6", { className: "fsize-200 pb-1 pt-3" }, translateTo('Proof of financing from bank', lang)),
                    React.createElement("div", { className: "dis-f a-c" },
                        React.createElement(BrixelIcon, { className: "mr-1", icon: "document", background: "blue", saturation: 100, color: "blue", saturationTxt: 700 }),
                        React.createElement("p", { className: "txtText900 pl-small-4" }, get(activeSingleOffer, 'offer.documents[0].name', ''))))),
                React.createElement("h6", { className: "fsize-200 pb-1 pt-3" }, "Note"),
                React.createElement("p", { className: "txtText900" },
                    React.createElement("i", null, get(activeSingleOffer, 'offer.noteByBuyer', '-') || '-')),
                React.createElement("div", { className: "ta-r" },
                    React.createElement("h6", { className: "fsize-200 pb-1 pt-3" }, "Answer"),
                    React.createElement("p", { className: "txtText900" },
                        React.createElement("i", null, get(activeSingleOffer, 'offer.noteBySeller', '-') || '-'))),
                React.createElement("div", { className: "dis-f mt-5" },
                    React.createElement(BrixelIcon, { className: "mr-1", icon: "info" }),
                    React.createElement("p", { className: "fsize-300 txtText600 ml-2" }, get(activeSingleOffer, 'offer.status', null) === 'accepted' ? (React.createElement(React.Fragment, null, translateTo('You accepted this non-binding offer. To proceed with the closing continue with identification.', lang))) : (React.createElement(React.Fragment, null, translateTo('You declined this non-binding offer. The buyer was informed about your decision.', lang)))))),
            React.createElement("div", { className: "dis-f jc-c a-c mt-5" },
                React.createElement(BrixelButtonPrimary, { rounded: true, label: "Close", onClick: () => closeOverlay() }))))));
};
const mapStateToProps = (state) => ({
    activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
    activeSingleOffer: get(state, 'deal.activeSingleDeal.closing.stageOffer', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    errors: get(state, 'brixelForm.Offer.syncErrors', {}),
    formValue: get(state, 'brixelForm.Offer.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('Offer', field, value));
    },
    destroyForm() {
        dispatch(destroy('Offer'));
    },
    initForm(value) {
        dispatch(initializeForm('Offer', value));
    },
    handleSetActiveSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
    handleSmallSpinner: bindActionCreators(spinnerSmall, dispatch),
    handleReviewOffer: bindActionCreators(saveReviewOffer, dispatch),
    setSplashScreen: bindActionCreators(setSplashType, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(ReviewOffer);
