import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import get from 'lodash/get';
import has from 'lodash/has';
import { BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon, Helpers, ProgressRing, } from '@brixel-io/brixel-components';
import translateTo from '../../utils/translation';
import { BrixelInputText, BrixelSelect, ReduxField } from '@brixel-io/brixel-components/dist/form';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { factsOptions } from '@brixel-io/brixel-components/dist/constants/Facts';
import { DateTime } from 'luxon';
import { setHistory, setModal } from '../../actions/CommonActions';
import { InputSheets } from '../../resources/SingleProperty/inputSheets';
import { calcPercentageProEstimation, completedBestimate } from '../../utils/helpers';
// COMPONENTS
import BestimateCardOverlay from '../../components/BestimateCardOverlay';
import { getEstimation } from '../../actions/PropertyActions';
import { generateEstimation } from '../../actions/EstimationActions';
import { change } from '@brixel-io/brixel-components/dist/utils/ReduxForm.Functions';
import SectionMobileTitle from '../../components/SectionMobileTitle';
const Price = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const { activeSingleProperty, changeFieldValue, estimation, formValue, handleGenerateBestimate, handleGetEstimation, handleSetHistory, handleSetModal, lang, proEstimation, } = props;
    // STATE
    const [Questions, setQuestions] = useState(InputSheets('facts', lang, changeFieldValue));
    const [selectedQuest, setSelectedQuest] = useState();
    // const [allSettings, setAllSettings] = useState(false);
    const [percComplete, setPercComplete] = useState(0);
    const [isReady, setIsReady] = useState(false);
    // PARAMS URL
    const propID = get(match, 'propID', null);
    const bestimateflowCompleted = completedBestimate(formValue);
    const propertyStatus = factsOptions.propertyStatus.map((item) => ({
        ...item,
        label: translateTo(item.label, lang),
    }));
    // ON CHANGE VALUE RE-CALC THE PERCENTAGE OF FACTS
    useEffect(() => {
        if (selectedQuest) {
            const findCurrentId = Questions.findIndex((quest) => quest.history === get(selectedQuest, 'history', null));
            const quest = InputSheets('facts', lang, changeFieldValue)[findCurrentId];
            setQuestions(InputSheets('facts', lang, changeFieldValue));
            setSelectedQuest(quest);
        }
    }, [formValue]);
    useEffect(() => {
        if (get(estimation, 'result.higherValue', 0) === 0 && activeSingleProperty.id && completedBestimate(activeSingleProperty)) {
            if (!has(estimation, 'result') && get(estimation, 'status', '') !== 'pending') {
                const payload = {
                    reloadOnwProperties: true,
                    type: 'market',
                    id: activeSingleProperty.id,
                    generate: bestimateflowCompleted,
                };
                handleGetEstimation(payload);
            }
            else if (has(estimation, 'result') &&
                !has(estimation, 'result.value') &&
                (get(estimation, 'status', '') !== 'pending' ||
                    bestimateflowCompleted) &&
                estimation.id &&
                (get(activeSingleProperty, 'location.countryCode', '') === 'CH') && (get(activeSingleProperty, 'properties.propertyType', '') === 'House' ||
                get(activeSingleProperty, 'properties.propertyType', '') === 'Apartment')) {
                handleGenerateBestimate(estimation.id);
            }
        }
    }, [activeSingleProperty.id, bestimateflowCompleted]);
    useEffect(() => {
        setPercComplete(calcPercentageProEstimation('', activeSingleProperty).realPerc);
    }, [formValue]);
    const openBestimate = () => {
        handleSetModal({
            component: React.createElement(BestimateCardOverlay, { clearEstimation: false, lang: lang }),
            state: true,
            small: true,
            layout: 'xxlarge',
        });
    };
    const onBestimateFlow = () => {
        history.push(`/${activeSingleProperty.id}/singleFlow/achievement/bestimate/step1?url=/${activeSingleProperty.id}/property/price`);
        handleSetModal({});
        handleSetHistory({ source: `/${activeSingleProperty.id}/property/price` });
    };
    const selectDocument = (id, action) => {
        const docs = get(activeSingleProperty, 'documents', []);
        const doc = docs.find((item) => item.id === id);
        if (action === 'name' && doc)
            return doc.name;
        if (action === 'path' && doc)
            return doc.path;
        if (action === 'date' && doc && doc.createdAt)
            return `${DateTime.fromMillis(doc.createdAt).toFormat('dd.MM.yyyy')}, ${DateTime.fromMillis(doc.createdAt).toFormat('hh:mm')}`;
        return null;
    };
    setTimeout(() => { setIsReady(true); }, 300);
    return (React.createElement(React.Fragment, null, isReady ? (React.createElement(React.Fragment, null,
        React.createElement("h3", { className: "mb-3 hide dis-b-lg" }, translateTo('Price', lang)),
        React.createElement("div", { className: "secondLevel dis-fl-col w-perc-100 h-perc-lg-100" },
            React.createElement(SectionMobileTitle, { title: "Price" }),
            React.createElement("div", { className: "dis-fl-col dis-fl-row-lg a-t jc-b" },
                React.createElement("div", { className: "boxCard dis-fl-col mr-2 w-perc-100 mb-5 mb-lg-0" },
                    React.createElement("h5", null, translateTo('Listing price', lang)),
                    React.createElement("div", { className: "dis-f jc-b a-c mt-3" },
                        React.createElement(ReduxField, { ReduxFieldClass: "w-perc-40 w-perc-md-30 mr-1", form: "Property", component: BrixelSelect, design: {
                                compact: true,
                            }, input: {
                                placeholder: 'CHF',
                                name: 'price.currency',
                                options: factsOptions.currency,
                            }, labels: {
                                label: translateTo('Currency', lang),
                            } }),
                        React.createElement(ReduxField, { ReduxFieldClass: "w-perc-70 ml-1", form: "Property", component: BrixelInputText, input: {
                                disableDelay: false,
                                placeholder: translateTo('700\'000', lang),
                                name: 'price.total',
                                unit: get(formValue, 'price.currency', ''),
                            }, inputFormat: {
                                currency: get(formValue, 'price.currency', ''),
                                formatType: 'price',
                            }, labels: {
                                label: translateTo('Price', lang),
                            } })),
                    React.createElement("div", { className: "dis-b-md" },
                        React.createElement(ReduxField, { ReduxFieldClass: "w-perc-60 mt-2", form: "Property", component: BrixelSelect, design: {
                                compact: true,
                            }, input: {
                                name: 'status',
                                options: propertyStatus,
                            }, labels: {
                                label: translateTo('Status', lang),
                            } }))),
                React.createElement("div", { className: "ml-md-1 w-perc-100" },
                    (get(activeSingleProperty, 'properties.propertyType', '') === 'House' ||
                        get(activeSingleProperty, 'properties.propertyType', '') === 'Apartment' ||
                        get(proEstimation, 'value', 0) > 0) && (React.createElement("div", { className: "dis-fl-col boxCard mb-5 pb-5" },
                        React.createElement("h5", { className: "mb-3" }, translateTo('Pro Estimation', lang)),
                        React.createElement("div", null, get(proEstimation, 'value', 0) <= 0 ? (React.createElement("p", { className: "txtText900" },
                            React.createElement("span", { dangerouslySetInnerHTML: { __html: translateTo(percComplete === 100 ? 'Your estimation is being calculated. You will receive an email with the result' : 'Complete your inputs to <span class="txtRed400 fweight-700">unlock</span> your professional estimation.', lang) } }))) : (React.createElement("p", { className: "txtText900" }, translateTo('This is your estimated value for your property.', lang)))),
                        React.createElement("div", { className: "dis-f a-c w-perc-100 my-3" },
                            React.createElement("span", { className: "ff-mono fsize-600 fweight-700 txtPrimary700" }, get(estimation, 'result.currency', '')),
                            get(proEstimation, 'value', 0) <= 0 ? (React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "w-perc-100 h-fix-40 mx-1 pos-r dis-f jc-c a-c" },
                                    React.createElement("div", { className: "w-perc-100 h-fix-40 bgBlue50 bgBlur pos-a" }),
                                    React.createElement("div", { className: "pos-r zIndex1" }, calcPercentageProEstimation().realPerc === 100 && (React.createElement("p", { className: "ff-mono fweight-700 fsize-400 txtYellow400" }, translateTo('pending', lang))))),
                                React.createElement(BrixelIcon, { className: "notranslate", color: calcPercentageProEstimation().realPerc === 100 ? 'yellow' : 'red', icon: calcPercentageProEstimation().realPerc === 100 ? 'hourglass' : 'locked' }))) : (React.createElement("span", { className: "ff-mono fsize-600 fweight-700 txtPrimary700 ml-1 notranslate" }, Helpers.formatNumberValue(get(proEstimation, 'value', 0).toFixed(0), get(estimation, 'result.currency', ''))))),
                        React.createElement("div", { className: "" }, proEstimation && selectDocument(proEstimation.document, 'path') ? (React.createElement("div", { className: "dis-f a-c" }, selectDocument(proEstimation.document, 'name') ? (React.createElement(React.Fragment, null,
                            React.createElement(BrixelIcon, { className: "mr-1", icon: "document", background: "blue", saturation: 100, color: "blue", saturationTxt: 700 }),
                            React.createElement("div", { className: "pl-small-4" },
                                React.createElement("button", { className: "txtText900 fweight-600 fsize-300 dis-b", onClick: () => Helpers.openDocument(proEstimation.document) }, selectDocument(proEstimation.document, 'name')),
                                React.createElement("small", { className: "fsize-200 fweight-500 txtText200" }, selectDocument(proEstimation.document, 'date'))))) : (React.createElement(React.Fragment, null, calcPercentageProEstimation().realPerc === 100 && (React.createElement(BrixelButtonSecondary, { rounded: true, className: "mt-2 w-fit", label: translateTo('Edit inputs', lang), onClick: () => history.push(`/${propID}/property/price/proEstimation`) })))))) : (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "dis-f a-c" },
                                React.createElement(ProgressRing, { progress: calcPercentageProEstimation().realPerc, size: 45, strokeWidth: 6, circleOneStroke: "#DCDDDE", circleTwoStroke: calcPercentageProEstimation().realPerc === 100 ? '#218B80' : '#004D71', showIcon: false, showIconComplete: calcPercentageProEstimation().realPerc === 100 }),
                                React.createElement("div", { className: "ml-2" },
                                    React.createElement("p", { className: "fsize-300 txtText900" }, translateTo('Estimation inputs', lang)),
                                    React.createElement("p", { className: `ff-mono fweight-700 ${calcPercentageProEstimation().realPerc === 100 ? 'txtGreen600' : 'txtPrimary700'}` },
                                        React.createElement("span", { className: "mr-1 notranslate" },
                                            calcPercentageProEstimation().realPerc,
                                            "%"),
                                        React.createElement("span", null, translateTo('completed', lang))))),
                            calcPercentageProEstimation().realPerc === 100 ? (React.createElement(BrixelButtonSecondary, { rounded: true, className: "mt-5 w-fit", label: translateTo('Edit inputs', lang), onClick: () => history.push(`/${propID}/property/price/proEstimation`) })) : (React.createElement(BrixelButtonPrimary, { rounded: true, className: "w-fit mt-5", label: translateTo('Complete now', lang), onClick: () => history.push(`/${propID}/property/price/proEstimation`) }))))))),
                    React.createElement("div", { className: "boxCard dis-fl-col" }, get(estimation, 'result.higherValue', 0) > 0 ? (React.createElement(React.Fragment, null,
                        React.createElement("h5", { className: "mb-3" }, translateTo('Bestimate®', lang)),
                        React.createElement("p", { className: "txtText900" }, translateTo('Your property is worth up to', lang)),
                        React.createElement("div", { className: "dis-f a-c w-perc-100 mt-3 " },
                            React.createElement("span", { className: "ff-mono fsize-600 fweight-700 txtPrimary700" },
                                React.createElement("span", null, get(estimation, 'result.currency', '')),
                                React.createElement("span", { className: "ml-1" }, Helpers.formatNumberValue(get(estimation, 'result.higherValue', 0).toFixed(0), get(estimation, 'result.currency', ''))))),
                        React.createElement(BrixelButtonSecondary, { rounded: true, className: "mt-5 w-fit", label: translateTo('Open', lang), onClick: () => openBestimate() }))) : (React.createElement(React.Fragment, null, ((get(estimation, 'status', null) !== 'pending' || !bestimateflowCompleted) && ((get(activeSingleProperty, 'properties.propertyType', '') === 'House' || get(activeSingleProperty, 'properties.propertyType', '') === 'Apartment'))) ? (React.createElement(React.Fragment, null,
                        React.createElement("h5", { className: "mb-3" }, translateTo('Get a free price indication.', lang)),
                        React.createElement("p", { className: "txtText900" }, translateTo('Compare your property to real transaction data to better define the pricing.', lang)),
                        React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Get free Bestimate®', lang), className: "mt-3 w-fit", onClick: () => onBestimateFlow(), rightIcon: "arrow-right" }))) : (React.createElement(React.Fragment, null,
                        React.createElement("h5", { className: "mb-3" }, translateTo('Bestimate® is missing 🙁', lang)),
                        React.createElement("p", { className: "txtText900" }, translateTo('We could not calculate your Bestimate®. No problem. Our support team will do it for you manually.', lang)),
                        React.createElement(BrixelButtonSecondary, { rounded: true, className: "mt-3 w-fit", label: translateTo('Contact support', lang), onClick: () => {
                                history.push(history.location.pathname, {
                                    state: { openSupport: true },
                                });
                            } }))))))))))) :
        (React.createElement("div", { className: "secondLevel dis-fl-col w-perc-100 h-perc-lg-100" },
            React.createElement("div", { className: "max-w-fix-1024 mt-10 pt-1 pt-lg-0 mt-lg-0 h-perc-100" },
                React.createElement("p", { className: "h-fix-24 h-fix-lg-40 mb-3 skeletonBg w-perc-15" }, " "),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-lg" },
                    React.createElement("div", { className: 'w-perc-100 w-perc-lg-50 brdRadius skeletonBg mr-0 mr-lg-2 h-fix-304' }),
                    React.createElement("div", { className: 'w-perc-100 w-perc-lg-50 mt-5 mt-lg-0 brdRadius skeletonBg ml-0 ml-lg-2 h-fix-304' })),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-lg mt-5" },
                    React.createElement("div", { className: 'w-perc-100 w-perc-lg-50 brdRadius skeletonBg mr-0 mr-lg-2 h-fix-304' }),
                    React.createElement("div", { className: 'w-perc-100 w-perc-lg-50 mt-5 mt-lg-0 brdRadius skeletonBg ml-0 ml-lg-2 h-fix-304' })))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    estimation: get(state, 'property.estimation', {}),
    formValue: get(state, 'brixelForm.Property.values', {}),
    lang: get(state, 'common.language', 'en'),
    proEstimation: get(state, 'brixelForm.Property.values.proEstimation', {}),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('Property', field, value));
    },
    handleGetEstimation: bindActionCreators(getEstimation, dispatch),
    handleGenerateBestimate: bindActionCreators(generateEstimation, dispatch),
    handleSetHistory: bindActionCreators(setHistory, dispatch),
    handleSetModal: bindActionCreators(setModal, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Price);
