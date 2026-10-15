import React from 'react';
import logoNorm from '@brixel-io/brixel-components/dist/configuration/images/logo_colors_icon_new.svg';
// COMPONENT FOR THE FULL SCREEN SPINNER
function Loading(props) {
    const { isLoading = false, isSmall = false, skeleton = false, } = props;
    if (isLoading) {
        return (React.createElement(React.Fragment, null, skeleton ? (React.createElement("div", { className: "max-w-fix-1024" },
            React.createElement("p", { className: "h-fix-32 mb-3 skeletonBg w-fix-56" }, " "),
            React.createElement("div", { className: 'w-perc-100 brdRadius skeletonBg h-fix-304' }),
            React.createElement("div", { className: "dis-f mt-4" },
                React.createElement("div", { className: 'w-perc-50 brdRadius skeletonBg mr-2 h-fix-304' }),
                React.createElement("div", { className: 'w-perc-50 brdRadius skeletonBg ml-2 h-fix-304' })))) : (React.createElement("div", { className: `elem-loader elem-overlay ${isSmall ? 'small' : 'large'}` },
            React.createElement("div", { className: "loader" },
                React.createElement("img", { loading: "lazy", className: "logo dis-b", src: logoNorm, alt: "Brixel Logo", id: "header-logo" }),
                React.createElement("svg", { className: "circular", viewBox: "25 25 50 50" },
                    React.createElement("circle", { className: "path", cx: "50", cy: "50", r: "20", fill: "none", strokeWidth: "2", strokeMiterlimit: "10" })))))));
    }
    return null;
}
export default Loading;
