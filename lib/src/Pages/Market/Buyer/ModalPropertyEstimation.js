import React, { useEffect, useState } from 'react';
import { BrixelButtonText, BrixelIcon, BrixelModal, FactsOptions, FormatValue, Helpers, } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import CoverEstimationGreenImg from '../../../images/Market/icnEstimationGreen.svg';
import CoverEstimationYellowImg from '../../../images/Market/icnEstimationYellow.svg';
import translateTo from '../../../utils/translation';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import { generateEstimation } from '../../../actions/EstimationActions';
import Tags from '../../../components/Tags';
const { factsOptions } = FactsOptions;
const ModalPropertyEstimation = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const { handleGenerateEstimation, isSmallLoading, lang, ownerEstimations, } = props;
    // STATE
    const [activeEstimation, setActiveEstimation] = useState();
    const [showDetail, setShowDetail] = useState(false);
    const [activeExtraFeatures, setActiveExtraFeatures] = useState([]);
    // URL PARAMS
    const propID = get(match, 'propID', null);
    // CONSTANTS VALUE
    const currency = get(activeEstimation, 'result.currency', '');
    const value = Math.round(get(activeEstimation, 'result.value', 0));
    const lowerValue = Math.round(get(activeEstimation, 'result.lowerValue', 0));
    const higherValue = Math.round(get(activeEstimation, 'result.higherValue', 0));
    useEffect(() => {
        if (ownerEstimations.length > 0) {
            const getEstimation = ownerEstimations.find((est) => est.id === propID);
            if (getEstimation)
                setActiveEstimation(getEstimation);
        }
    }, [ownerEstimations, propID]);
    useEffect(() => {
        const localActiveExtraFeatures = get(activeEstimation, 'data.properties.extraFeatures', {});
        if (localActiveExtraFeatures) {
            Object.keys(localActiveExtraFeatures).forEach((key) => {
                if (localActiveExtraFeatures[key]) {
                    const updateExtraFeature = activeExtraFeatures || [];
                    const filterExtraFeatures = factsOptions.extraFeature.find((feat) => feat.value === key);
                    if (filterExtraFeatures) {
                        updateExtraFeature.push(filterExtraFeatures);
                        setActiveExtraFeatures(updateExtraFeature);
                    }
                }
            });
        }
    }, [activeEstimation]);
    const onClose = () => {
        history.push('/buy/estimations');
    };
    const onUpdateEstimation = () => {
        if (activeEstimation) {
            const data = {
                id: activeEstimation.id,
                smallLoader: 'generateEstimation',
            };
            handleGenerateEstimation(data);
        }
    };
    const convertLabel = (curVal, field, type = null) => {
        const fact = factsOptions[field].find((val) => val.value === curVal);
        if (fact && type)
            return fact[type];
        return fact;
    };
    return (React.createElement(BrixelModal, { clickOutsideToClose: false, onClose: () => onClose(), layout: "xxlarge", bodyClassColor: "bgWhite p-0", hideHeader: true },
        React.createElement("div", null,
            React.createElement("div", { className: `dis-f jc-c a-c py-7 ${get(activeEstimation, 'result.available', false) ? 'bgGreen100' : 'bgYellow100'}` },
                React.createElement(BrixelIcon, { rounded: true, background: "white", saturation: 0, color: "text", className: "pos-a-fix x-r-2 x-t-2", icon: "close-small", onClick: () => onClose() }),
                get(activeEstimation, 'result.available', false) ? (React.createElement("img", { src: CoverEstimationGreenImg, alt: "completed estimation" })) : (React.createElement("img", { src: CoverEstimationYellowImg, alt: "completed estimation" }))),
            React.createElement("div", { className: "dis-f mt-2 px-2" }, get(activeEstimation, 'result.available', false) ? (React.createElement(Tags, { lang: lang, status: "accepted", text: "Calculated", message: {
                    accepted: translateTo('Calculated', lang),
                } })) : (React.createElement(Tags, { lang: lang, status: "pending", text: "Pending", message: {
                    pending: translateTo('Pending', lang),
                } }))),
            React.createElement("div", { className: "p-4" },
                React.createElement("h4", { className: "mb-3 fweight-600" }, translateTo(get(activeEstimation, 'data.title', ''), lang)),
                React.createElement("div", { className: "dis-fl-col dis-fl-row-sm jc-fs" },
                    React.createElement("div", { className: "brdSmallRight-sm brdText50 mr-2 pr-2" },
                        React.createElement("h6", { className: "fsize-300 fweight-400 txtText400 pb-1" }, translateTo('Property worth', lang)),
                        get(activeEstimation, 'result.available', false) ? (React.createElement("p", { className: "ff-mono dis-f a-b txtGreen400" },
                            React.createElement("span", { className: "mr-1 fsize-300" }, currency),
                            React.createElement("span", { className: "fsize-500" }, Helpers.formatNumberValue(value, currency)))) : (React.createElement("p", { className: "ff-mono dis-f a-b txtGreen400" },
                            React.createElement("span", { className: "fsize-500" }, "-")))),
                    React.createElement("div", { className: "mt-1 mt-sm-0" },
                        React.createElement("h6", { className: "fsize-300 fweight-400 txtText400 pb-1" }, translateTo('Similar properties are currently worth between', lang)),
                        get(activeEstimation, 'result.available', false) ? (React.createElement("p", { className: "ff-mono dis-f a-b txtGreen400" },
                            React.createElement("span", null,
                                React.createElement("span", { className: "mr-1 fsize-400" }, currency),
                                React.createElement("span", null, Helpers.formatNumberValue(lowerValue, currency))),
                            React.createElement("span", { className: "mx-2" }, "-"),
                            React.createElement("span", null,
                                React.createElement("span", { className: "mr-1 fsize-400" }, currency),
                                React.createElement("span", null, Helpers.formatNumberValue(higherValue, currency))))) : (React.createElement("p", { className: "ff-mono dis-f a-b txtGreen400" },
                            React.createElement("span", { className: "fsize-500" }, "-"))))),
                React.createElement("hr", { className: "my-4 lighter" }),
                React.createElement("div", { className: "dis-f a-t jc-b flex-wrap" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Property Type', lang)),
                        React.createElement("span", { className: "ff-mono fsize-500 txtBlack" }, translateTo(get(activeEstimation, 'data.properties.propertyType', ''), lang))),
                    React.createElement("div", null,
                        React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Rooms', lang)),
                        React.createElement("span", { className: "ff-mono fsize-500 txtBlack" }, FormatValue.formatRooms(get(activeEstimation, 'data.properties.typology.bedrooms', 0), get(activeEstimation, 'data.location.countryCode', 'CH')))),
                    React.createElement("div", null,
                        React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Size', lang)),
                        React.createElement("span", { className: "ff-mono fsize-500 txtBlack" },
                            get(activeEstimation, 'data.properties.typology.livingArea.value', 0),
                            " m2")),
                    React.createElement("div", null,
                        React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Year built', lang)),
                        React.createElement("span", { className: "ff-mono fsize-500 txtBlack" }, get(activeEstimation, 'data.properties.building.built', 0))),
                    React.createElement("div", null,
                        React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Location', lang)),
                        React.createElement("span", { className: "fsize-500 txtText900 mt-1 notranslate" },
                            get(activeEstimation, 'data.location.zip', ''),
                            " ",
                            get(activeEstimation, 'data.location.city', ''),
                            get(activeEstimation, 'data.location.countryCode', 'CH') === 'CH' && (React.createElement(React.Fragment, null, ` (${get(activeEstimation, 'data.location.stateCode', '')})`))))),
                React.createElement("hr", { className: "my-4 lighter" }),
                React.createElement(BrixelButtonText, { label: translateTo('Show details', lang), rightIcon: showDetail ? 'arrow-simple-up' : 'arrow-simple-down', bgTransparent: true, onClick: () => setShowDetail(!showDetail) }),
                showDetail && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "dis-f a-t jc-b flex-wrap detailList mt-3" },
                        get(activeEstimation, 'data.properties.building.conditionStatus', null) && (React.createElement("div", null,
                            React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Condition', lang)),
                            React.createElement("span", { className: "ff-mono fsize-500 txtBlack" }, translateTo(convertLabel(get(activeEstimation, 'data.properties.building.conditionStatus', ''), 'conditionStatus', 'label'), lang)))),
                        get(activeEstimation, 'data.properties.typology.bathrooms', 0) > 0 && (React.createElement("div", null,
                            React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Bathrooms', lang)),
                            React.createElement("span", { className: "ff-mono fsize-500 txtBlack" }, translateTo(get(activeEstimation, 'data.properties.typology.bathrooms', ''), lang)))),
                        Object.keys(get(activeEstimation, 'data.properties.building.solarOrientarion', {})).length > 0 && (React.createElement("div", null,
                            React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Solar orientations', lang)),
                            Object.keys(get(activeEstimation, 'data.properties.building.solarOrientarion', {})).map((key, i) => (React.createElement(React.Fragment, null,
                                i > 0 && (React.createElement("span", { className: "mr-1" }, ",")),
                                React.createElement("span", { key: `solar${i.toString()}`, className: "ff-mono fsize-500 txtBlack" }, translateTo(convertLabel(get(activeEstimation, `data.properties.building.solarOrientarion[${key}]`, ''), 'solarOrientation', 'label'), lang))))))),
                        get(activeEstimation, 'data.properties.parking.garage', 0) > 0 && (React.createElement("div", null,
                            React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Garage', lang)),
                            React.createElement("span", { className: "ff-mono fsize-500 txtBlack" }, translateTo(get(activeEstimation, 'data.properties.parking.garage', ''), lang)))),
                        get(activeEstimation, 'data.properties.parking.outside', 0) > 0 && (React.createElement("div", null,
                            React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Parking outside', lang)),
                            React.createElement("span", { className: "ff-mono fsize-500 txtBlack" }, translateTo(get(activeEstimation, 'data.properties.parking.outside', ''), lang)))),
                        get(activeEstimation, 'data.properties.parking.underground', 0) > 0 && (React.createElement("div", null,
                            React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Parking underground', lang)),
                            React.createElement("span", { className: "ff-mono fsize-500 txtBlack" }, translateTo(get(activeEstimation, 'data.properties.parking.underground', ''), lang)))),
                        get(activeEstimation, 'data.properties.energy.efficiency', null) && (React.createElement("div", null,
                            React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Energy efficiency', lang)),
                            React.createElement("span", { className: "ff-mono fsize-500 txtBlack" }, translateTo(get(activeEstimation, 'data.properties.energy.efficiency', ''), lang)))),
                        get(activeEstimation, 'data.properties.energy.efficiencyCertified', null) && (React.createElement("div", null,
                            React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Energy certified', lang)),
                            React.createElement("span", { className: "ff-mono fsize-500 txtBlack" }, translateTo(get(activeEstimation, 'data.properties.energy.efficiencyCertified', ''), lang)))),
                        activeExtraFeatures.length > 0 && (React.createElement("div", null,
                            React.createElement("span", { className: "fsize-300 dis-b txtText400 mb-1" }, translateTo('Extra Features', lang)),
                            activeExtraFeatures.map((extra, i) => (React.createElement(React.Fragment, null,
                                i > 0 && (React.createElement("span", { className: "mr-1" }, ",")),
                                React.createElement("span", { key: `extra${i.toString()}`, className: "ff-mono fsize-500 txtBlack" }, translateTo(extra.label, lang))))))))))),
            React.createElement("hr", { className: "mt-2 mb-4 lighter" }),
            React.createElement("div", { className: "dis-f a-c jc-b mb-4 px-3" },
                React.createElement(BrixelButtonText, { theme: "text", themeSat: 500, bgTransparent: true, label: translateTo('Close', lang), onClick: () => onClose() }),
                activeEstimation && !get(activeEstimation, 'result.available', false) && (React.createElement(BrixelButtonPrimary, { rounded: true, isLoading: isSmallLoading.generateEstimation, label: translateTo('Refresh', lang), onClick: () => onUpdateEstimation() }))))));
};
const mapStateToProps = (state) => ({
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    ownerEstimations: get(state, 'market.ownerEstimations.data', []),
});
const mapDispatchToProps = (dispatch) => ({
    handleGenerateEstimation: bindActionCreators(generateEstimation, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(ModalPropertyEstimation);
