import React from 'react';
import { BrixelButtonPrimary, BrixelButtonSecondary, BrixelIcon, FormatValue, Helpers } from '@brixel-io/brixel-components';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { setModal, setSplashType } from '../../actions/CommonActions';
import { completedBestimate, convertLabel } from '../../utils/helpers';
import translateTo from '../../utils/translation';
import CoverPropertyImage from '../CoverPropertyImage';
import BestimateCardOverlay from '../BestimateCardOverlay';
const DashboardPropertyCard = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { activeSingleCompany, activeSingleProperty, estimation, handleSetModal, lang, smallLayout = false, type = 'own', } = props;
    const isEstimation = !get(estimation, 'status', null) || !completedBestimate(activeSingleProperty) && get(estimation, 'status', null) === 'processed';
    const energyCertificate = activeSingleProperty?.properties?.energy?.totalEnergyEfficiency;
    return (React.createElement("div", { className: smallLayout ? '' : 'mb-3' },
        React.createElement("div", { className: `${activeSingleCompany?.stub === 'ubs' ? 'engBrdTop' : 'brdRadius'} imgSection ov-h bgWhite brdSmall brdText100` },
            React.createElement("div", { className: `dis-fl-col dis-fl-row-sm ${smallLayout ? 'p-sm-3' : 'p-sm-3 pt-0 pb-2'}` },
                React.createElement("div", { className: "pr-sm-3 pr-0 pr-sm-2 max-w-perc-sm-50" },
                    React.createElement("div", { onClick: () => history.push(`/${get(activeSingleProperty, 'id', '')}/property/facts`), className: `dis-b w-perc-100 ${smallLayout ? 'min-w-fix-sm-208' : 'w-fix-sm-232'} h-fix-160 pos-r` },
                        React.createElement(CoverPropertyImage, { className: "cover w-perc-100 h-perc-100 negTop brdRadius", coverPhoto: get(activeSingleProperty, 'coverPhoto.url', undefined), propertyType: get(activeSingleProperty, 'properties.propertyType', undefined), size: "M" }),
                        type !== 'sold' && type !== 'buy' && (React.createElement(Link, { to: `/${get(activeSingleProperty, 'id', '')}/property/photos`, className: "pos-a-fix x-r-1 x-b-1 brdRadiusLrg px-2 bgWhite p-small-10 txtText900 opacity-08" }, translateTo('Edit', lang))))),
                React.createElement("div", { className: "px-sm-0 px-2 pt-2 pt-sm-0 dis-fl-col jc-b flex-1" },
                    React.createElement("div", { className: "" },
                        React.createElement("h4", { className: `txtText900 fweight-600 fsize-sm-600 fsize-500 ${!activeSingleProperty?.title && 'skeletonh4'}` }, get(activeSingleProperty, 'title', '')),
                        React.createElement("span", { className: `fsize-300 txtText400 ${!activeSingleProperty?.location?.state && 'skeletonSmall dis-b mt-1'}` },
                            get(activeSingleProperty, 'location.city', ''),
                            ", ",
                            get(activeSingleProperty, 'location.state', ''))),
                    !get(activeSingleProperty, 'status', null) ? (React.createElement("div", null,
                        React.createElement("div", { className: "skeletonh4" }),
                        React.createElement("div", { className: "skeletonh4 mt-1" }))) : (React.createElement(React.Fragment, null, (type === 'sold' || type === 'buy') ? (React.createElement("div", { className: "w-perc-100" },
                        React.createElement("div", { className: "fweight-600 txtBlue700 fsize-500 mb-2" }, type !== 'sold' && get(activeSingleProperty, 'status', null) === 'on-sale' ? (React.createElement(React.Fragment, null,
                            React.createElement("span", null, get(activeSingleProperty, 'price.currency', 'CHF')),
                            React.createElement("span", { className: "ml-1" }, Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 'EUR'))))) : (React.createElement("span", null, translateTo(convertLabel(get(activeSingleProperty, 'status', 'on-request'), 'propertyStatus'), lang)))),
                        type === 'buy' ? (React.createElement("div", { className: "dis-fl-col dis-fl-row-sm" },
                            React.createElement("div", { className: "dis-f flex-1 jc-b jc-fs-sm" },
                                React.createElement("div", { className: "brdSmallRight brdText100 pr-2" },
                                    React.createElement("h6", { className: "ff-mono txtText400 fsize-300" }, translateTo('Living area', lang)),
                                    React.createElement("p", { className: "fsize-500 fSizePx20" },
                                        get(activeSingleProperty, 'properties.typology.livingArea.value', 0),
                                        "m2")),
                                React.createElement("div", { className: "ml-2 brdSmallRight brdText100 pr-2" },
                                    React.createElement("h6", { className: "ff-mono txtText400 fsize-300" }, translateTo('Rooms', lang)),
                                    React.createElement("p", { className: "fsize-500 fSizePx20" }, FormatValue.formatRooms(get(activeSingleProperty, 'properties.typology.bedrooms', 0), get(activeSingleProperty, 'location.countryCode', 'CH')))),
                                React.createElement("div", { className: "ml-2 brdSmallRight-sm brdText100 pr-2 mr-1" },
                                    React.createElement("h6", { className: "ff-mono txtText400 fsize-300" }, translateTo('Year built', lang)),
                                    React.createElement("p", { className: "fsize-500 fSizePx20" }, get(activeSingleProperty, 'properties.building.built', 0)))),
                            React.createElement(BrixelButtonSecondary, { className: "as-fs mt-2 ml-sm-2 mt-a-sm mb-a w-auto-sm w-perc-100", rounded: true, label: translateTo('View', lang), onClick: () => window.open(`${baseByData?.pageUrl}${get(activeSingleProperty, 'stub', '')}`, '_blank') }))) : (React.createElement("div", { className: "dis-f a-c" },
                            get(activeSingleProperty, 'virtual', null) && (React.createElement("div", { className: "bgBlue200 tourLink" },
                                React.createElement("button", { onClick: () => history.push(`/${get(activeSingleProperty, 'id', '')}/property/tour`), className: "dis-f a-c" },
                                    React.createElement(BrixelIcon, { color: "Blue", rounded: true, saturationTxt: 700, background: "Blue", saturation: 100, icon: "tour", padding: "p-small-8" }),
                                    React.createElement("span", { className: "pl-1 pr-2 txtBlue700 fsize-300" }, translateTo('3D-Tour', lang))))),
                            get(activeSingleProperty, 'photos', null) && get(activeSingleProperty, 'photos', []).length > 0 && (React.createElement("div", { className: "ml-1" },
                                React.createElement(BrixelIcon, { color: "red", rounded: true, saturationTxt: 700, background: "red", saturation: 100, icon: "photos", padding: "p-small-10", onClick: () => history.push(`/${get(activeSingleProperty, 'id', '')}/property/photos`) }))),
                            get(activeSingleProperty, 'floorPlans', null) && get(activeSingleProperty, 'floorPlans', []).length > 0 && (React.createElement("div", { className: "ml-1" },
                                React.createElement(BrixelIcon, { color: "green", rounded: true, saturationTxt: 700, background: "green", saturation: 100, icon: "plans", padding: "p-small-10", onClick: () => history.push(`/${get(activeSingleProperty, 'id', '')}/property/floorPlans`) }))))))) : (React.createElement(React.Fragment, null, smallLayout ? (React.createElement("div", { className: "dis-fl-col dis-fl-row-sm flex-wrap jc-b a-sm-c w-perc-100" },
                        React.createElement("div", { className: "dis-f a-c mr-a mr-sm-0 my-1" },
                            React.createElement(BrixelIcon, { background: "blue", saturation: 100, color: "blue", saturationTxt: 700, padding: "p-small-12", icon: "price", rounded: true, iconSize: "large" }),
                            React.createElement("div", { className: "ml-2 dis-fl-col" },
                                React.createElement("span", { className: "txtText400 fsize-300" }, translateTo('Your Price', lang)),
                                React.createElement(Link, { to: `/${get(activeSingleProperty, 'id', '')}/property/price`, className: "txtBlue700 fweight-600" },
                                    React.createElement("span", null, get(activeSingleProperty, 'price.currency', 0)),
                                    React.createElement("span", { className: "ml-1" }, Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 'EUR')))))),
                        React.createElement(BrixelButtonPrimary, { className: "mt-2 mt-sm-0 mr-a mr-sm-0 mb-3 mb-sm-0 as-c", rounded: true, label: translateTo('Open', lang), onClick: () => window.open(`${baseByData?.pageUrl}${get(activeSingleProperty, 'stub', '')}`, '_blank') }))) : (React.createElement(React.Fragment, null, get(activeSingleProperty, 'price.total', 0) > 0 ? (React.createElement("div", { className: "dis-fl-col" },
                        React.createElement("div", { className: "dis-f a-c mt-3 mt-sm-0" },
                            React.createElement(BrixelIcon, { background: "blue", saturation: 100, color: "blue", saturationTxt: 700, padding: "p-small-12", icon: "price", rounded: true, iconSize: "large" }),
                            React.createElement("div", { className: "ml-2 dis-fl-col" },
                                React.createElement("span", { className: "txtText400 fsize-300" }, translateTo('Your Price', lang)),
                                React.createElement(Link, { to: `/${get(activeSingleProperty, 'id', '')}/property/price`, className: "txtBlue700 fweight-600" },
                                    React.createElement("span", null, get(activeSingleProperty, 'price.currency', 0)),
                                    React.createElement("span", { className: "ml-1" }, Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', 'EUR')))))))) : (React.createElement(React.Fragment, null, get(activeSingleProperty, 'proEstimation.value', 0) > 0 ? (React.createElement("div", { className: "dis-f pt-3 pt-sm-2 a-t" },
                        React.createElement(BrixelIcon, { background: "blue", saturation: 100, color: "blue", saturationTxt: 700, padding: "p-small-12", icon: "chart", rounded: true, iconSize: "large" }),
                        React.createElement("div", { className: "dis-fl-col pl-2 mr-1" },
                            React.createElement("span", { className: "txtText400 fsize-300" }, translateTo('Pro estimation', lang)),
                            React.createElement(Link, { to: `/${get(activeSingleProperty, 'id', '')}/property/price`, className: "txtBlue700 no-state fweight-600" },
                                get(activeSingleProperty, 'proEstimation.currency', 0),
                                " ",
                                Helpers.formatNumberValue(get(activeSingleProperty, 'proEstimation.value', 0), get(activeSingleProperty, 'proEstimation.currency', 'EUR')))),
                        React.createElement("div", { className: "tagBg dis-fl-row-sm hide a-c" },
                            React.createElement("span", { className: "activeDot" }),
                            React.createElement(Link, { to: `/${get(activeSingleProperty, 'id', '')}/property/price`, className: "px-2 no-state txtBlue700" }, translateTo('Set your price', lang))))) : (React.createElement("div", { className: "dis-f pt-3 pt-sm-2 a-t" },
                        React.createElement(BrixelIcon, { background: "blue", saturation: 100, color: "blue", saturationTxt: 700, padding: "p-small-12", icon: "chart", rounded: true, iconSize: "large" }),
                        React.createElement("div", { className: "dis-fl-col pl-2 mr-1" },
                            React.createElement("span", { className: "txtText400 fsize-300" }, translateTo('Your Bestimate', lang)),
                            isEstimation && (React.createElement(Link, { to: `/${get(activeSingleProperty, 'id', '')}/singleFlow/achievement/bestimate/step1`, className: "txtBlue700 fweight-600" }, translateTo('Get Estimation', lang))),
                            get(estimation, 'status', null) === 'pending' && completedBestimate(activeSingleProperty) && (React.createElement("span", { className: "txtBlue700 fweight-600" }, translateTo('Pending', lang))),
                            !isEstimation && get(estimation, 'status', null) === 'processed' && (React.createElement("button", { onClick: () => handleSetModal({
                                    state: true,
                                    small: true,
                                    component: React.createElement(BestimateCardOverlay, { lang: lang }),
                                    layout: 'xlarge',
                                }), className: "txtBlue700 no-state fweight-600 fsize-400 ml-1-neg" },
                                get(estimation, 'result.currency', ''),
                                " ",
                                Helpers.formatNumberValue(get(estimation, 'result.higherValue', 0), get(estimation, 'result.currency', ''))))),
                        React.createElement("div", { className: "tagBg dis-fl-row-sm hide a-c" },
                            React.createElement("span", { className: "activeDot" }),
                            React.createElement(Link, { to: `/${get(activeSingleProperty, 'id', '')}/property/price`, className: "px-2 no-state txtBlue700" }, translateTo('Set your price', lang)))))))))))))))),
        activeSingleCompany?.stub === 'ubs' && type === 'buy' && (React.createElement("div", { className: "brdSmall engBrdRadius brdText100 bgWhite mt-2 mt-md-1-neg" },
            React.createElement("div", { className: `dis-f-md a-c jc-b ${smallLayout ? 'p-sm-3' : 'p-sm-3 pt-0 pb-2'}` },
                React.createElement("div", { className: `m-2 m-md-0 singleEnergyValue active ${energyCertificate} w-fix-72` },
                    React.createElement("span", { className: "labelValue" }, energyCertificate || '?')),
                React.createElement("div", { className: "ml-2 fsize-300" },
                    energyCertificate ? (React.createElement("h6", { className: "fsize-sm-300 fweight-600 pb-small-4" },
                        React.createElement("span", null, translateTo('This property has an indicative energy class', lang)),
                        React.createElement("span", { className: "ml-small-4" },
                            energyCertificate.toUpperCase(),
                            "."))) : (React.createElement("h6", { className: "fsize-sm-300 fweight-600 pb-small-4" },
                        React.createElement("span", null, translateTo('This property doesn\'t have a specified energy class yet.', lang)))),
                    React.createElement("p", { className: 'fsize-300' }, translateTo('Order the energy performance certificate with renovation schedule from Norm and benefit from attractive conditions.', lang))),
                React.createElement("div", { className: "ml-0 pt-2 pt-md-0 ml-sm-2 px-2 px-md-0" },
                    React.createElement(BrixelButtonPrimary, { className: "ws-nw flex-none w-perc-100", rounded: true, rightIcon: "arrow-right", label: translateTo('Get informed', lang), onClick: () => history.push(`/buyer/${activeSingleProperty.id}/energy`) })))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    estimation: get(state, 'property.estimation', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleSetModal: bindActionCreators(setModal, dispatch),
    setSplashScreen: bindActionCreators(setSplashType, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(DashboardPropertyCard);
