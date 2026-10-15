/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { BrixelButtonIcon, BrixelButtonPrimary } from '@brixel-io/brixel-components';
import translateTo from '../utils/translation';
const BrixelModalFullScreen = (props) => {
    // PROPS
    const { children, lang, onClose, title, } = props;
    // STATE
    return (React.createElement("div", { id: "bodyModalWrapper", className: "modalFlow" },
        React.createElement("div", { className: "bodyModal" },
            React.createElement("header", { className: "max-w-fix-760 w-perc-100 m-a" },
                React.createElement("div", { className: "container p-1 p-lg-2 dis-f jc-fe a-c" },
                    React.createElement("div", { className: "dis-f a-c" },
                        React.createElement(BrixelButtonIcon, { icon: "close-small", theme: "text", bgTransparent: true, className: "as-c", onClick: () => onClose() })))),
            React.createElement("form", { id: "multiStepForm", onSubmit: (e) => e.preventDefault(), autoComplete: "off", className: "dis-fl-col jc-b" },
                React.createElement("div", { className: "multiStepSlides" },
                    React.createElement("div", { className: "singleStep jc-c fade-enter-active" },
                        React.createElement("div", { className: "subcontainer m-a" },
                            React.createElement("div", null,
                                React.createElement("h3", { className: "mb-5 ta-c" }, translateTo(title, lang)),
                                React.createElement("div", null, children))))),
                React.createElement("div", { className: "footerAction max-w-fix-760 m-a p-1 p-lg-2 shadow-1dp-top normStep staticFooter" },
                    React.createElement("div", { className: "pos-r" },
                        React.createElement("div", { className: "w-perc-100 a-c dis-fl-row jc-b m-a jc-c" },
                            React.createElement(BrixelButtonPrimary, { className: "noWrap", rounded: true, label: "Ok, got it", rightIcon: "arrow-right-small", onClick: () => onClose() }))))))));
};
export default BrixelModalFullScreen;
