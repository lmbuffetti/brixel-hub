import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { BrixelButtonPrimary, Helpers } from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
import has from 'lodash/has';
import { setModal } from '../actions/CommonActions';
import Loading from './Loading';
import { setCookie } from '../utils/helpers';
import { setEstimation } from '../actions/PropertyActions';
import startBestimate from '../images/Bestimate/startBestimate.svg';
const BestimateCardOverlay = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const { bestimate, clearEstimation = true, handleSetModal, lang, setBestimateMessage, setPropertyEstimation, } = props;
    const onCloseBestimateResult = () => {
        setCookie('brixelMarketBestimate', true);
        if (setBestimateMessage)
            setBestimateMessage(true);
        if (clearEstimation)
            setPropertyEstimation({});
        handleSetModal({});
    };
    const openSupport = (e) => {
        e.preventDefault();
        handleSetModal({});
        history.push(history.location.pathname, { state: { openSupport: true } });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "result-popup centered" },
            React.createElement("div", { className: "dis-fl-col jc-c a-c pb-2 pos-r" },
                !has(bestimate, 'higherValue') && (React.createElement(React.Fragment, null,
                    React.createElement(Loading, { isLoading: true }))),
                get(bestimate, 'higherValue', 0) !== 0 ? (React.createElement(React.Fragment, null,
                    React.createElement("h3", null, translateTo('Bestimate® is missing 🙁', lang)),
                    React.createElement("span", { className: "max-w-fix-448 ta-c txtText900 py-2" }, translateTo('We could not calculate your Bestimate®. No problem. Our support team will do it for you manually.', lang)),
                    React.createElement("img", { loading: "lazy", src: startBestimate, alt: "Generating Bestimate", className: "w-fix-96 my-5" }),
                    React.createElement("div", { className: "dis-fl-col dis-fl-row-sm jc-c a-c pos-r w-perc-100" },
                        React.createElement("span", { className: "pos-a-fix-sm mb-2 mb-sm-0 x-l-0 txtPrimary400 fweight-500 cur-poi", onClick: () => {
                                onCloseBestimateResult();
                            } },
                            React.createElement("span", null, translateTo('Thanks, not now', lang))),
                        React.createElement(BrixelButtonPrimary, { rounded: true, label: translateTo('Contact support', lang), className: "m-a", onClick: (e) => openSupport(e), rightIcon: "arrow-right" })))) : (React.createElement(React.Fragment, null,
                    React.createElement("h3", { dangerouslySetInnerHTML: { __html: translateTo('This is your Bestimate<sup>®</sup>', lang) } }),
                    React.createElement(React.Fragment, null,
                        React.createElement("p", { className: "ta-c mt-2 txtText900" }, translateTo('Your property is worth up to', lang)),
                        React.createElement("p", { className: "fsize-600 ff-mono txtPrimary700 fweight-600 mb-3 mt-2" },
                            get(bestimate, 'currency', ''),
                            " ",
                            bestimate.higherValue ? Helpers.formatNumberValue(+get(bestimate, 'higherValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-')),
                    React.createElement("span", { className: "txtText900" }, translateTo('Similar transactions were sold within this price range.', lang)),
                    React.createElement("div", { className: "pt-2 pb-3 max-w-fix-480 w-perc-100" },
                        React.createElement("div", { className: "ff-mono txtPrimary700 fsize-300 ta-c bestimate-range dis-f jc-c" },
                            React.createElement("span", null,
                                " ",
                                get(bestimate, 'currency', ''),
                                " ",
                                bestimate.lowerValue ? Helpers.formatNumberValue(+get(bestimate, 'lowerValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-',
                                " "),
                            React.createElement("span", { className: "w-fix-120" }),
                            React.createElement("span", null,
                                " ",
                                get(bestimate, 'currency', ''),
                                " ",
                                bestimate.higherValue ? Helpers.formatNumberValue(+get(bestimate, 'higherValue', 0).toFixed(0), get(bestimate, 'currency', '')) : '-')),
                        React.createElement("span", { className: "bestimate-bar" }, " ")),
                    get(bestimate, 'alfredo', false) === true && (React.createElement("span", { dangerouslySetInnerHTML: { __html: translateTo('Bestimate<sup>®</sup> is a first price indication calculated with a few inputs. It is based on real property transactions, as well as an average of current market values. For a more accurate and complete estimation, we suggest booking an on-site appointment with one of our experts (limited to specific areas).', lang) }, className: "txtText600 max-w-fix-480 mb-5" })),
                    get(bestimate, 'iazi', null) === true && (React.createElement("span", { className: "txtText600 max-w-fix-480 mb-5", dangerouslySetInnerHTML: { __html: translateTo('Bestimate<sup>®</sup> is calculated based on similar transactions. This is a first price indication calculated with few inputs. To have a more accurate estimation we suggest to book our free on-site estimation.', lang) } })),
                    React.createElement(BrixelButtonPrimary, { label: translateTo('ok, got it!', lang), rounded: true, className: "w-perc-100 max-w-fix-192", onClick: () => onCloseBestimateResult() })))))));
};
const mapStateToProps = (state) => ({
    bestimate: get(state, 'property.estimation.result', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleSetModal: bindActionCreators(setModal, dispatch),
    setPropertyEstimation: bindActionCreators(setEstimation, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(BestimateCardOverlay);
