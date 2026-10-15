import translateTo from '../utils/translation';
import React from 'react';
const DealsTitle = (props) => {
    const { className = '', lang, title = '', total = 0, } = props;
    return (React.createElement("div", { className: `title dis-fl-row a-c py-2 ${className}` },
        React.createElement("span", { className: "fweight-500 fsize-500 txtText900 mr-1 tt-c" }, translateTo(title, lang)),
        React.createElement("span", { className: "notranslate" },
            "(",
            total,
            ")")));
};
export default DealsTitle;
