import React, { useRef, useEffect, useState } from 'react';
import { BrixelButtonPrimary, BrixelButtonText, } from '@brixel-io/brixel-components';
import Slider from 'react-slick';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { compose } from 'redux';
import translateTo from '../../utils/translation';
import iconFinancingUbs from '../../images/policy/ubs/icon-financing.svg';
import iconLetterUbs from '../../images/policy/ubs/letter.svg';
import iconPiggyUbs from '../../images/policy/ubs/piggy-bank.svg';
import iconExclusiveUbs from '../../images/policy/ubs/exclusive.svg';
const TermsConditionUBS = (props) => {
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
                React.createElement("img", { src: iconFinancingUbs, alt: "Icon Financing", width: 154 })),
            React.createElement("p", { className: "pt-2 fsize-400 fsize-md-500 max-w-fix-136 max-w-fix-md-192 ml-a mr-a ta-c" }, translateTo('Support on all financial questions', arg))),
        React.createElement("div", { className: "icon-wrap dis-fl-col a-c px-2 ", key: "2" },
            React.createElement("div", { className: "icon-circle brdCircle as-fc dis-f jc-c" },
                React.createElement("img", { loading: "lazy", width: 154, src: iconLetterUbs, alt: "Icon Calendar" })),
            React.createElement("p", { className: "pt-2 fsize-400 fsize-md-500 max-w-fix-136 max-w-fix-md-192 ml-a mr-a ta-c" }, translateTo('Receive a free property appraisal', arg))),
        React.createElement("div", { className: "icon-wrap dis-fl-col a-c px-2 ", key: "3" },
            React.createElement("div", { className: "icon-circle brdCircle as-fc dis-f jc-c" },
                React.createElement("img", { loading: "lazy", width: 154, src: iconPiggyUbs, alt: "Icon offer" })),
            React.createElement("p", { className: "pt-2 fsize-400 fsize-md-500 max-w-fix-136 max-w-fix-md-192 ml-a mr-a ta-c" }, translateTo('Benefit from a 0.30% interest rate reduction', arg))),
        React.createElement("div", { className: "icon-wrap dis-fl-col a-c px-2 ", key: "4" },
            React.createElement("div", { className: "icon-circle brdCircle as-fc dis-f jc-c" },
                React.createElement("img", { loading: "lazy", width: 154, src: iconExclusiveUbs, alt: "Finance" })),
            React.createElement("p", { className: "pt-2 fsize-400 fsize-md-500 max-w-fix-136 max-w-fix-md-192 ml-a mr-a ta-c" }, translateTo('Get access to the exclusive UBS pre-market', arg))),
    ]);
    const optInTitle = () => (React.createElement(React.Fragment, null,
        React.createElement("h2", { className: "fsize-600 fsize-md-800 fweight-600 mb-2" }, translateTo('Activate your UBS advantages now', lang)),
        React.createElement("h4", { className: "fsize-500 fsize-md-600 mb-3 mb-md-4 fweight-400" }, translateTo('Our partner UBS provides you support on all financial questions and access to exclusive benefits.', lang))));
    return (React.createElement("div", null,
        React.createElement("div", { className: "row dis-fl-col-rev dis-fl-row-md bgWhite brdRadius max-w-fix-1200 px-0 mx-1 mr-a-sm ml-a-sm py-3 p-md-6 p-lg-9" },
            React.createElement("div", { className: "col-12 col-md-6 max-w-fix-md-456 px-3 px-md-0" },
                React.createElement("div", { className: "hide dis-b-md" }, optInTitle()),
                React.createElement("span", { className: "txtText700" },
                    React.createElement("span", { className: 'dis-b fsize-200 lh-20' }, translateTo('UBS\'s financing offers are only available to Swiss residents.', lang)),
                    React.createElement("span", { className: 'dis-b fsize-200 lh-20 my-1' }, translateTo('I agree that my data (surname, first name, address, postal code, telephone number, e-mail address) is transmitted to UBS for reporting and advisory purposes. UBS will have access to the status assigned by Brixel for the properties that I am interested in (e.g. "interested", "reserved", "purchased"). UBS may also contact me for advisory purposes.', lang)),
                    React.createElement("span", { className: 'dis-b fsize-200 lh-20' }, translateTo('This consent can be revoked at any time, it being understood that such revocation may only be effective for the future. The revocation does not affect any data processing carried out prior to such revocation.', lang))),
                React.createElement("div", { className: "mt-4 mt-md-6" },
                    React.createElement(BrixelButtonPrimary, { label: translateTo('Accept &amp; continue', lang), rounded: true, className: 'mb-1', onClick: () => onSaveData('accept'), isLoading: isSmallLoading.sendData }),
                    React.createElement(BrixelButtonText, { label: translateTo('Skip', lang), rounded: true, theme: 'text', themeSat: 800, onClick: () => onSaveData() }))),
            React.createElement("div", { className: "col-12 col-md-6 px-0 px-md-2 max-w-fix-md-480 ml-a-md centerSliderUbs" }, isDesktop ? (React.createElement("div", { className: "two-col-grid w-perc-100" }, SignupDescription(lang))) : (React.createElement(React.Fragment, null,
                React.createElement("div", { className: 'px-3' }, optInTitle()),
                React.createElement("div", { className: "centerSlider w-perc-100 mb-4" },
                    React.createElement(Slider, { ref: sliderInstance, ...settingSlider }, SignupDescription(lang)))))))));
};
const mapStateToProps = (state) => ({
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language', 'en'),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
export default compose(connect(mapStateToProps))(TermsConditionUBS);
