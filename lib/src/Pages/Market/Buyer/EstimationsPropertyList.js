import { BrixelButtonPrimary } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import MarketCardEstimation from '../../../components/Cards/MarketCardEstimation';
import emptyEst from '../../../images/empty-est.svg';
import translateTo from '../../../utils/translation';
import ModalPropertyEstimation from './ModalPropertyEstimation';
const EstimationPropertyList = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    // PROPS
    const { activeSingleCompany, lang, ownerEstimations, skeleton, } = props;
    // STATE
    return (React.createElement(React.Fragment, null,
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/:propID", element: React.createElement(ModalPropertyEstimation, null) })),
        React.createElement("div", { className: "container" },
            ownerEstimations.total === 0 ? (React.createElement("div", { className: 'dis-fl-col a-c py-8' },
                React.createElement("img", { width: "200", src: emptyEst, alt: "" }),
                React.createElement("div", { className: " ta-c mt-3" },
                    React.createElement("h3", { className: "fweight-600 mb-2" }, translateTo('You haven’t created any Estimation', lang)),
                    React.createElement("p", { className: "txtText400 max-w-fix-320 ml-a mr-a" }, translateTo('Create an estimation of value for a property you own or you are interested in buying.', lang)),
                    React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Create Estimation', lang), leftIcon: "plus", className: "ml-a mr-a mt-3", onClick: () => {
                            localStorage.setItem('backUrlBuyerEstimations', '/buy/estimations');
                            history.push(`/packageFlow/getStartedEstimation/${activeSingleCompany.stub}/estimationType`);
                        } })))) : (React.createElement("div", null,
                React.createElement("div", { className: "dis-fl-row-sm dis-fl-col a-c jc-b my-2 my-sm-3" },
                    React.createElement("h4", { className: "fsize-400 fsize-sm-600 mb-1 mb-sm-0" },
                        React.createElement("span", null, translateTo('Your Estimations', lang)),
                        React.createElement("span", { className: "ml-1" },
                            "(",
                            ownerEstimations.total || '-',
                            ")")),
                    React.createElement(BrixelButtonPrimary, { rounded: true, leftIcon: "plus", label: translateTo('New estimation', lang), onClick: () => {
                            localStorage.setItem('backUrlBuyerEstimations', '/buy/estimations');
                            history.push(`/packageFlow/getStartedEstimation/${activeSingleCompany.stub}/estimationType`);
                        } })))),
            skeleton.estimation ? (React.createElement(React.Fragment, null, [...Array(3)].map((_x, i) => (React.createElement("div", { key: `skeleton${i.toString()}`, className: "w-perc-100 pb-2" },
                React.createElement("div", { className: "dis-f a-t brdRadius ov-h" },
                    React.createElement("div", { className: "h-fix-208 w-fix-flex-320 pos-r skeletonBgInner w-perc-100" }),
                    React.createElement("div", { className: "w-perc-100 pl-2" },
                        React.createElement("div", { className: "h-fix-16 mt-1 skeletonBgInner hide dis-b-md w-perc-100" }),
                        React.createElement("div", { className: "h-fix-40 mt-2 skeletonBgInner w-perc-100" }),
                        React.createElement("div", { className: "h-fix-16 mt-1 skeletonBgInner w-perc-100" }),
                        React.createElement("div", { className: "h-fix-40 mt-2 skeletonBgInner w-perc-100" })))))))) : (React.createElement(React.Fragment, null, get(ownerEstimations, 'data', []).map((item, index) => (React.createElement(MarketCardEstimation, { key: `cardFavorites-${index.toString()}`, activeSingleProperty: item, lang: lang }))))))));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    lang: get(state, 'common.language', 'en'),
    ownerEstimations: get(state, 'market.ownerEstimations', {}),
    skeleton: get(state, 'common.skeleton', {}),
});
export default compose(connect(mapStateToProps, null))(EstimationPropertyList);
