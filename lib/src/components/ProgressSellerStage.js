import React from 'react';
import { BrixelIcon, FactsOptions } from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
const { factsOptions } = FactsOptions;
const ProgressSellerStage = (props) => {
    const { className = '', lang, smallLayout = false, stepIndexProgress, xSmallMobile = false, } = props;
    const convertLabel = (progress) => {
        switch (progress.value) {
            case 'sales-lead':
                return translateTo('Onboarding', lang);
            case 'advertising':
                return translateTo('Marketing', lang);
            default:
                return translateTo(progress.label, lang);
        }
    };
    return (React.createElement("div", { className: `progress-stage dis-f a-c pos-r ${className}` }, factsOptions.progressBarOptions.map((progress, i) => (React.createElement("div", { className: `step-item ${stepIndexProgress === i ? 'active' : ''} ${xSmallMobile ? 'xsmall' : ''} ${stepIndexProgress > i ? 'done' : ''}`, key: `fctOpts_${i.toString()}` },
        React.createElement("div", { className: `wrap-step ${xSmallMobile ? 'xsmallStep' : ''} ${smallLayout ? 'smallStep' : ''}` },
            React.createElement("div", { className: "circle" }, stepIndexProgress > i ? (React.createElement(BrixelIcon, { iconWidth: "w-fix-flex-24 pos-r zIndex2", icon: "check", color: "primary" })) : (React.createElement("span", { className: "stepNumber fsize-300" }, i + 1))),
            (!smallLayout || stepIndexProgress === i) && !xSmallMobile && (React.createElement("span", { className: "fsize-300 stepLabel ff-mono" }, convertLabel(progress)))))))));
};
export default ProgressSellerStage;
