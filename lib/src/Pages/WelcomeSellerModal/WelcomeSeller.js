import React, { useEffect } from 'react';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { FactsOptions } from '@brixel-io/brixel-components';
import { getActiveSingleProperty } from '../../actions/PropertyActions';
import { setPageData, spinnerOff } from '../../actions/CommonActions';
import WelecomeOnboardingStage from './WelecomeOnboardingStage';
const { factsOptions } = FactsOptions;
const WelcomeSeller = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    // PROPS
    const { handleGetActiveSingleProperty, handleSetPageData, handleSpinnerOff, lang, } = props;
    // GET URL PARAMS
    const propID = get(match, 'propID', null);
    const currentScreen = get(history, 'location.pathname', '').replace(/\/$/, '').split('/')[get(history, 'location.pathname', '').replace(/\/$/, '').split('/').length - 1];
    const changeStep = (e) => {
        if (e)
            e.preventDefault();
    };
    useEffect(() => {
        // eslint-disable-next-line no-console
        const path = get(history, 'location.pathname', '').replace(/\/$/, '');
        const currentStep = path.split('/')[path.split('/').length - 1];
        handleSpinnerOff();
        handleSetPageData({ stage: factsOptions.progressBarOptions[0].value });
        if (propID) {
            handleGetActiveSingleProperty({ id: propID });
        }
        if (factsOptions.progressBarOptions[0].value !== currentStep)
            history.push(`/packageFlow/${propID}/welcomeSeller/${factsOptions.progressBarOptions[0].value}/step1`);
        return () => {
            handleSetPageData(null);
        };
    }, []);
    return (React.createElement("div", { id: "bodyModalWrapper", className: "withHeader getStarted " },
        React.createElement("div", { className: `bodyModal welcomeSellerBody ${currentScreen === 'step1' ? 'bgPrimary50' : ''}` },
            React.createElement("form", { id: "multiStepForm", autoComplete: "off", className: "interactive dis-fl-col jc-b", onSubmit: (e) => changeStep(e) },
                React.createElement("div", { className: "multiStepSlides" },
                    React.createElement("div", { className: "singleStep pt-6 jc-c" },
                        React.createElement("div", { className: "subcontainer m-a" },
                            React.createElement("div", { id: "step-1", className: "dis-f flex-wrap" },
                                React.createElement("div", { className: `m-a max-w-fix-880 w-perc-100 ${currentScreen === 'step2' ? 'ta-sm-c' : 'ta-c'}` },
                                    React.createElement(WelecomeOnboardingStage, { lang: lang }))))))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    lang: get(state, 'common.language', 'en'),
});
const mapDispatchToProps = (dispatch) => ({
    handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
    handleSetPageData: bindActionCreators(setPageData, dispatch),
    handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(WelcomeSeller);
