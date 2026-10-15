import React, { useEffect, useRef, useState } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { UpgradeQuestions } from '../../resources/SingleProperty/Upgrade';
import { getActiveSingleCompanyPackages } from '../../actions/CompanyActions';
const Upgrade = (props) => {
    // PROPS
    const { activeSingleCompany, handleGetActiveSingleCompanyPackages, lang, } = props;
    // STATE
    const [quest] = useState(UpgradeQuestions()[0]);
    // REF
    const singleStepRef = useRef(null);
    const multiStepSlidesRef = useRef(null);
    useEffect(() => {
        if (activeSingleCompany.id) {
            handleGetActiveSingleCompanyPackages({ id: activeSingleCompany.id, smallLoader: 'getPackages' });
        }
    }, [activeSingleCompany.id]);
    return (React.createElement("div", { id: "bodyModalWrapper", className: 'withHeader getStarted' },
        React.createElement("div", { className: 'bodyModal dis-fl-col' },
            React.createElement("form", { id: "multiStepForm", autoComplete: "off", className: 'interactive dis-fl-col jc-b' },
                React.createElement("div", { ref: multiStepSlidesRef, className: "multiStepSlides" },
                    React.createElement("div", { ref: singleStepRef, className: 'singleStep zIndex1 jc-c' },
                        React.createElement("div", { className: "subcontainer m-a" },
                            get(quest, 'inputs', null) && !get(quest, 'cardType', null) && (React.createElement("div", { className: 'dis-fl-col flex-wrap' }, quest.title && (React.createElement("h2", { className: `fweight-600 max-w-fix-464 ta-c m-a ${quest.subtitle ? 'mb-1' : 'mb-3 mb-sm-6'}`, dangerouslySetInnerHTML: { __html: quest.title } })))),
                            get(quest, 'cardType', null) === 'loadComponent' && (React.createElement(quest.component, {
                                ...quest,
                                lang,
                            })))))))));
};
const mapStateToProps = (state) => {
    return ({
        activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
        activeSingleProperty: get(state, 'property.activeSingleProperty', null),
        lang: get(state, 'common.language', 'en'),
        isSmallLoading: get(state, 'common.isSmallLoading', {}),
    });
};
const mapDispatchToProps = (dispatch) => ({
    handleGetActiveSingleCompanyPackages: bindActionCreators(getActiveSingleCompanyPackages, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(Upgrade);
