import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import { bindActionCreators, compose } from 'redux';
import { Helpers } from '@brixel-io/brixel-components';
import translateTo from '../../utils/translation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getEstimation, saveActiveSingleProperty } from '../../actions/PropertyActions';
import { createEstimation, generateEstimation } from '../../actions/EstimationActions';
function ResumeBestimate(props) {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { activeSingleCompany, activeSingleProperty, condition, estimation, handleCreateEstimation, handleGenerateBestimate, handleGetEstimation, lang, } = props;
    // URL PARAMS
    const propID = get(match, 'propID', null);
    // LOAD THE MARKET DATA
    useEffect(() => {
        if (get(activeSingleProperty, 'location.countryCode', null) !== 'CH' &&
            !get(estimation, 'result.value', null)) {
            const data = {
                owner: get(activeSingleProperty, 'owner.id', activeSingleProperty.owner),
                page: activeSingleProperty.id,
                generate: false,
            };
            handleCreateEstimation(data);
            history.push(`/${activeSingleProperty.id}/home/bestimate`);
        }
        else if (propID && (get(activeSingleProperty, 'location.countryCode', null) === 'CH'))
            handleGetEstimation(propID);
    }, [activeSingleProperty]);
    // LOAD THE ESTIMATION
    useEffect(() => {
        if (get(estimation, 'result.higherValue', 0) === 0 && activeSingleProperty.id) {
            if (!has(estimation, 'result') && get(estimation, 'status', null) !== 'pending') {
                const payload = {
                    reloadOnwProperties: true,
                    type: 'market',
                    id: activeSingleProperty.id,
                    generate: true,
                };
                handleGetEstimation(payload);
            }
            else if (has(estimation, 'result') && !has(estimation, 'result.value') && estimation.id) {
                handleGenerateBestimate(estimation.id);
            }
        }
    }, [estimation, activeSingleProperty]);
    return (React.createElement("main", { id: "rewards", className: "pb-4 h-perc-100 txtText900" },
        React.createElement(React.Fragment, null,
            get(estimation, 'result.value', null) ? (React.createElement(React.Fragment, null,
                React.createElement("h5", { className: "ta-c mb-5" }, translateTo('We proudly present you your Bestimate<sup>&reg;</sup>.', lang)),
                condition && condition.higherValue && (React.createElement(React.Fragment, null,
                    React.createElement("p", { className: "ta-c mb-1 txtText900" }, translateTo('Your property is worth', lang)),
                    React.createElement("p", { className: "heading4 ff-mono txtGreen400 fweight-600 ta-c mb-1" },
                        get(activeSingleCompany, 'country.currency', ''),
                        " ",
                        Helpers.formatNumberValue(condition.value, get(activeSingleCompany, 'country.currency', 'CHF'))),
                    React.createElement("p", { className: "body2 ta-c mb-5 txtText900" }, translateTo('Based on similar transactions.', lang)),
                    React.createElement("p", { className: "fweight-400 ta-c mb-1 txtText900" }, translateTo('Similar properties are currently worth between', lang)),
                    React.createElement("div", { className: "ta-c mb-5" },
                        React.createElement("p", { className: "ff-mono txtPrimary700 fweight-600 ta-c" },
                            get(activeSingleCompany, 'country.currency', ''),
                            " ",
                            Helpers.formatNumberValue(condition.lowerValue, get(activeSingleCompany, 'country.currency', 'CHF')),
                            " - ",
                            get(activeSingleCompany, 'country.currency', ''),
                            " ",
                            Helpers.formatNumberValue(condition.higherValue, get(activeSingleCompany, 'country.currency', 'CHF')))),
                    React.createElement("p", { className: "fweight-400 ta-c txtText900" }, translateTo('Your Bestimate<sup>&reg;</sup> compared to local market data', lang)))))) : (React.createElement(React.Fragment, null,
                React.createElement("h5", { className: "ta-c mb-5" }, translateTo('We proudly present you your Bestimate<sup>&reg;</sup>.', lang)),
                React.createElement("p", null, translateTo('We Will contact you', lang)))),
            React.createElement("p", { className: "body2 mt-5 txtText900" }, translateTo('The Bestimate<sup>&reg;</sup> is your free price indication. <br /> It is based on comparable transaction data. Due to the few inputs it does not replace any professional estimation but just gives you a quick orientation.', lang))),
        ")"));
}
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    condition: get(state, 'property.estimation.result', {}),
    estimation: get(state, 'property.estimation', {}),
    lang: get(state, 'common.language', 'en'),
});
const mapDispatchToProps = (dispatch) => ({
    handleCreateEstimation: bindActionCreators(createEstimation, dispatch),
    handleGenerateBestimate: bindActionCreators(generateEstimation, dispatch),
    handleGetEstimation: bindActionCreators(getEstimation, dispatch),
    handleSaveActiveSingleProperty: bindActionCreators(saveActiveSingleProperty, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(ResumeBestimate);
