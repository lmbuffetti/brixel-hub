import React, { useRef, useEffect, useState } from 'react';
import { BrixelButtonPrimary, BrixelButtonText, } from '@brixel-io/brixel-components';
import Slider from 'react-slick';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { compose } from 'redux';
import translateTo from '../../utils/translation';
import iconFinancing from '../../images/policy/baloise/icon-financing-baloise.svg';
import iconLetter from '../../images/policy/baloise/letter-baloise.svg';
import iconPiggy from '../../images/policy/baloise/piggy-bank-baloise.svg';
import iconExclusive from '../../images/policy/baloise/exclusive-baloise.svg';
const TermsConditionBaloise = (props) => {
    const { isSmallLoading, lang, onSaveData, windowDimensions, } = props;
    // STATE
    const [isDesktop, setIsDesktop] = useState(false);
    const sliderInstance = useRef(null);
    const settingSlider = {
        centerMode: true,
        slidesToShow: 1,
        speed: 500,
        autoPlay: true,
        arrows: false,
        focusOnSelect: true,
        dots: false,
        infinite: true,
        variableWidth: true,
        draggable: true,
        centerPadding: '8px',
    };
    useEffect(() => {
        if (get(windowDimensions, 'width', 0) > 768)
            setIsDesktop(true);
        else
            setIsDesktop(false);
    }, [get(windowDimensions, 'width', 0)]);
    const SignupDescription = (arg) => ([
        React.createElement("div", { className: "icon-wrap dis-fl-col a-c px-2 ", key: "1" },
            React.createElement("div", { className: "icon-circle brdCircle as-fc dis-f jc-c" },
                React.createElement("img", { src: iconFinancing, alt: "Icon Financing", width: 154 })),
            React.createElement("p", { className: "pt-2 fsize-400 max-w-fix-136 max-w-fix-md-224 ml-a mr-a ta-c" }, translateTo('Support on all financial questions', arg))),
        React.createElement("div", { className: "icon-wrap dis-fl-col a-c px-2 ", key: "2" },
            React.createElement("div", { className: "icon-circle brdCircle as-fc dis-f jc-c" },
                React.createElement("img", { loading: "lazy", width: 154, src: iconLetter, alt: "Icon Calendar" })),
            React.createElement("p", { className: "pt-2 fsize-400 max-w-fix-136 max-w-fix-md-224 ml-a mr-a ta-c" }, translateTo('Receive a free Financing Certificate', arg))),
        React.createElement("div", { className: "icon-wrap dis-fl-col a-c px-2 ", key: "3" },
            React.createElement("div", { className: "icon-circle brdCircle as-fc dis-f jc-c" },
                React.createElement("img", { loading: "lazy", width: 154, src: iconPiggy, alt: "Icon offer" })),
            React.createElement("p", { className: "pt-2 fsize-400 max-w-fix-136 max-w-fix-md-224 ml-a mr-a ta-c" }, translateTo('Benefit from 0.15% discount on your online mortgage', arg))),
        React.createElement("div", { className: "icon-wrap dis-fl-col a-c px-2 ", key: "4" },
            React.createElement("div", { className: "icon-circle brdCircle as-fc dis-f jc-c" },
                React.createElement("img", { loading: "lazy", width: 154, src: iconExclusive, alt: "Finance" })),
            React.createElement("p", { className: "pt-2 fsize-400 max-w-fix-136 max-w-fix-md-224 ml-a mr-a ta-c" }, translateTo('Get 10-days of exclusive access to new properties', arg))),
    ]);
    const optInTitle = () => (React.createElement(React.Fragment, null,
        React.createElement("h2", { lang: lang, className: `fsize-600 fsize-md-800 fweight-600 mb-2 ${lang === 'de' ? 'hyphens' : ''}` }, translateTo('Benefit from the consulting services of our partner Baloise', lang))));
    return (React.createElement("div", null,
        React.createElement("div", { className: "row dis-fl-col-rev dis-fl-row-md bgWhite brdRadius max-w-fix-1200 px-0 mx-1 mr-a-sm ml-a-sm py-3 p-md-6 p-lg-9" },
            React.createElement("div", { className: "col-12 col-md-6 max-w-fix-md-456 px-3 px-md-0" },
                React.createElement("div", { className: "hide dis-b-md" }, optInTitle()),
                React.createElement("div", { className: "" },
                    React.createElement("span", { className: 'dis-b fweight-600 txtText900 fsize-300 lh-20 pb-small-4' }, translateTo('Transmission of data to Baloise.', lang)),
                    React.createElement("span", { className: 'dis-b fsize-300 lh-20' }, translateTo('I hereby agree that my data (surname, first name, phone number, e-mail) is transmitted to Baloise Insurance Ltd and to Baloise Bank Ltd so that I can get contacted regarding the financing of my self-occupied real estate incl. risk protection.', lang)),
                    React.createElement("span", { className: 'dis-b fsize-300 lh-20 pt-2' }, translateTo('You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing carried out on the basis of the consent until revocation.', lang))),
                React.createElement("div", { className: "mt-4 mt-md-6" },
                    React.createElement(BrixelButtonPrimary, { label: translateTo('Accept &amp; continue', lang), rounded: true, className: 'mb-1', onClick: () => onSaveData('accept'), isLoading: isSmallLoading.sendData }),
                    React.createElement(BrixelButtonText, { label: translateTo('Skip', lang), rounded: true, theme: 'text', themeSat: 800, onClick: () => onSaveData() }))),
            React.createElement("div", { className: "col-12 col-md-6 px-0 px-md-2 max-w-fix-md-480 ml-a-md centerSliderbaloise-1" }, isDesktop ? (React.createElement("div", { className: "two-col-grid w-perc-100" }, SignupDescription(lang))) : (React.createElement(React.Fragment, null,
                React.createElement("div", { className: 'px-3' }, optInTitle()),
                React.createElement("div", { className: "centerSlider w-perc-100 mb-4" },
                    React.createElement(Slider, { ref: sliderInstance, ...settingSlider }, SignupDescription(lang)))))))));
};
const mapStateToProps = (state) => ({
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
export default compose(connect(mapStateToProps))(TermsConditionBaloise);
