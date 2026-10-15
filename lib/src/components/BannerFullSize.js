import React from 'react';
import translateTo from '../utils/translation';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';
import BrixelButtonSecondary from '@brixel-io/brixel-components/dist/components/BrixelButtonSecondary';
import { setWindowDimensions } from '../actions/CommonActions';
import get from 'lodash/get';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const BannerFullSize = ({ button, className, description, image, lang, smallIcon, smallSize, title, type, windowDimensions, }) => {
    let bannerClass = type === 'green' ? 'bgGreen50 brdGreen100 brdSmall' : 'bgWhite brdText100 brdSmall';
    if (type === 'red') {
        bannerClass = 'bgRed50 brdRed100 brdSmall';
    }
    return (React.createElement("div", { className: `${bannerClass} ${className} dis-fl-col dis-fl-row-xl a-t a-c-xl mr-a jc-b p-2 p-xl-3 brdRadius` },
        image && (React.createElement("img", { src: image, alt: title, className: `${smallIcon ? 'w-fix-40' : 'w-fix-40 w-fix-lg-64'}  mr-2` })),
        React.createElement("div", { className: "dis-fl-col dis-fl-row-xl w-perc-100" },
            React.createElement("div", { className: `mr-a ${button ? 'mb-2 mb-xl-0' : ''}` },
                title && (React.createElement("h6", { className: "fweight-600 fsize-500 mt-2 mt-xl-0" }, translateTo(title, lang))),
                description && (React.createElement("div", { className: '' }, description.map((desc, index) => (React.createElement("p", { className: `txtText800 ${smallSize ? '' : 'mt-1'} pr-2 pr-sm-4 mb-xl-0 ${smallIcon ? 'fsize-300' : 'fsize-300'}`, key: index }, translateTo(desc, lang))))))),
            button && (React.createElement("div", { className: 'no-wrap' },
                button.type === 'primary' && (React.createElement(BrixelButtonPrimary, { label: translateTo(button.label, lang), rounded: true, onClick: () => button.onClick(), leftIcon: button.iconLeft, rightIcon: button.iconRight, fullWidth: windowDimensions.width <= 1024 })),
                button.type === 'secondary' && (React.createElement(BrixelButtonSecondary, { bgTransparent: true, label: translateTo(button.label, lang), rounded: true, onClick: () => button.onClick(), leftIcon: button.iconLeft, rightIcon: button.iconRight })))))));
};
const mapStateToProps = (state) => ({
    windowDimensions: get(state, 'common.windowDimensions', { width: 0, height: 0 }),
});
const mapDispatchToProps = (dispatch) => ({
    handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(BannerFullSize);
