import { BrixelButtonText } from '@brixel-io/brixel-components';
import React from 'react';
import get from 'lodash/get';
const ContentCard = (props) => {
    const { hrefOnClick, hrefTarget, hrefTitle, hrefUrl, image, previewCopy, title, } = props;
    return (React.createElement("div", { className: "mb-3 mb-sm-0" },
        image && get(image, 'url', null) && (React.createElement("a", { href: hrefUrl, className: "dis-f ov-h a-b cur-poi", target: "_blank", rel: "noreferrer" },
            React.createElement("img", { loading: "lazy", className: "of-co max-h-fix-sm-120 max-h-fix-lg-144", width: "100%", src: image.url, alt: image.alt }))),
        React.createElement("a", { href: hrefUrl, target: "_blank", rel: "noreferrer" },
            React.createElement("h5", { className: "mt-2 mb-2 mb-sm-3 txtText900 fSizePx18 fweight-600 tt-break-hy" }, title)),
        React.createElement("p", { className: "fsize-300" }, previewCopy),
        React.createElement(BrixelButtonText, { bgTransparent: true, className: "mt-2", rounded: true, label: hrefTitle, onClick: () => hrefOnClick(hrefUrl, hrefTarget) })));
};
export default ContentCard;
