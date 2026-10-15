import React from 'react';
import BuyerBannerData from './BannerBuyerData';
import translateTo from '../../utils/translation';
import { BrixelButtonPrimary, } from '@brixel-io/brixel-components';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
const BannerBuyerByStatus = ({ className, customDescription, history, isLoading, lang, propID, type, status, }) => {
    const bannerData = BuyerBannerData(propID, customDescription)[type][status];
    return (React.createElement("button", { className: `shadow-2dp brdRadius dis-f jc-b pt-2 pl-2 pl-sm-2 pl-sm-3 ${className} pb-3 w-perc-100 mb-2 mb-sm-0 w-perc-sm-50 cur-poi ta-l ${bannerData.bg}` },
        (isLoading) && (React.createElement("div", { className: "dis-fl-col w-perc-100 pr-2 pr-sm-3" },
            React.createElement("div", { className: "skeletonh4" }),
            React.createElement("div", { className: "skeletonh4 mt-1" }),
            React.createElement("div", { className: "skeletonSmall mt-2" }))),
        React.createElement("div", { className: "cardWithBg rightPosBg", style: { backgroundImage: `url(${bannerData.backgroundImg})` } },
            React.createElement("div", { className: "dis-fl-col max-w-perc-100" },
                React.createElement("h5", { className: "fweight-600 max-w-perc-90" }, translateTo(bannerData.title, lang)),
                React.createElement("div", { className: "dis-f a-c max-w-perc-70 max-w-perc-sm-80 mt-1" },
                    React.createElement("p", { className: "pr-2 mb-3" }, bannerData.description.map((desc, index) => (React.createElement("span", { key: index, className: "dis-b" }, translateTo(desc, lang)))))),
                React.createElement("div", { className: "mt-a" }, bannerData.buttonType === 'secondary' ? (React.createElement(BrixelButtonSecondary, { bgTransparent: true, label: translateTo(bannerData.buttonLabel, lang), rounded: true, leftIcon: bannerData.buttonIcon, onClick: () => history.push(bannerData.buttonLink) })) : (React.createElement(BrixelButtonPrimary, { label: translateTo(bannerData.buttonLabel, lang), rounded: true, leftIcon: bannerData.buttonIcon, onClick: () => history.push(bannerData.buttonLink) })))))));
};
export default BannerBuyerByStatus;
