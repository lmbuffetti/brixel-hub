import React, { useRef } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { BrixelButtonIcon } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import get from 'lodash/get';
import AnalyseImg from '../../../images/scanTrial/analyse.png';
import DeliverImg from '../../../images/scanTrial/deliver.png';
import YourTestImg from '../../../images/scanTrial/your_test.png';
import DecideImg from '../../../images/scanTrial/decide.png';
import { setWindowDimensions } from '../../../actions/CommonActions';
const IntroScanFlow = (props) => {
    // PROPS
    const { lang, windowDimensions, } = props;
    const sliderInstance = useRef(null);
    const settingSlider = () => ({
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        arrows: true,
        slidesToScroll: 1,
        nextArrow: React.createElement(BrixelButtonIcon, { theme: "text", themeSat: 300, ghost: true, bgTransparent: true, icon: "arrow-simple-right" }),
        prevArrow: React.createElement(BrixelButtonIcon, { theme: "text", themeSat: 300, ghost: true, bgTransparent: true, icon: "arrow-simple-left" }),
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    swipeToSlide: true,
                    draggable: true,
                },
            },
        ],
    });
    return (React.createElement("main", { id: "rewards", className: "introScanFlow pb-2 pb-sm-4 h-perc-100 txtText900 mt-3" },
        React.createElement("h2", { className: "mb-0 mb-lg-5 ta-c fweight-600" }, translateTo('How it works', lang)),
        windowDimensions.width < 1024 && (React.createElement(Slider, { ref: sliderInstance, ...settingSlider() },
            React.createElement("div", { className: "" },
                React.createElement("div", { className: "brdRadius ov-h ta-c" },
                    React.createElement("img", { loading: "lazy", className: "w-perc-100 max-w-fix-144 ml-a mr-a", src: AnalyseImg, alt: "text-1" }),
                    React.createElement("div", { className: "pos-r my-1" },
                        React.createElement("hr", { className: "divider-line-mobile max-w-perc-50 pos-a-fix x-r-0" }),
                        React.createElement("div", { className: "roundDot ml-a mr-a" })),
                    React.createElement("h4", { className: "fweight-600 my-3 mb-1" }, translateTo('We analyse', lang)),
                    React.createElement("p", { className: "max-w-fix-280 m-a" }, translateTo('We estimate your property and define the sales process with you.', lang)))),
            React.createElement("div", { className: "" },
                React.createElement("div", { className: "brdRadius ov-h ta-c" },
                    React.createElement("img", { loading: "lazy", className: "w-perc-100 max-w-fix-144 ml-a mr-a", src: DeliverImg, alt: "text-1" }),
                    React.createElement("div", { className: "pos-r my-1" },
                        React.createElement("hr", { className: "divider-line-mobile" }),
                        React.createElement("div", { className: "roundDot ml-a mr-a" })),
                    React.createElement("h4", { className: "fweight-600 my-3 mb-1" }, translateTo('We deliver', lang)),
                    React.createElement("p", { className: "max-w-fix-280 m-a" }, translateTo('We capture your property and create your personal Brixel Page.', lang)))),
            React.createElement("div", { className: "" },
                React.createElement("div", { className: "brdRadius ov-h ta-c" },
                    React.createElement("img", { loading: "lazy", className: "w-perc-100 max-w-fix-144 ml-a mr-a", src: YourTestImg, alt: "text-1" }),
                    React.createElement("div", { className: "pos-r my-1" },
                        React.createElement("hr", { className: "divider-line-mobile" }),
                        React.createElement("div", { className: "roundDot ml-a mr-a" })),
                    React.createElement("h4", { className: "fweight-600 my-3 mb-1" }, translateTo('You test', lang)),
                    React.createElement("p", { className: "max-w-fix-280 m-a" }, translateTo('You review our work and can test our full service on the market.', lang)))),
            React.createElement("div", { className: "" },
                React.createElement("div", { className: "brdRadius ov-h ta-c" },
                    React.createElement("img", { loading: "lazy", className: "w-perc-100 max-w-fix-144 ml-a mr-a", src: DecideImg, alt: "text-1" }),
                    React.createElement("div", { className: "pos-r my-1" },
                        React.createElement("hr", { className: "divider-line-mobile max-w-perc-50 pos-a-fix x-l-0" }),
                        React.createElement("div", { className: "roundDot ml-a mr-a" })),
                    React.createElement("h4", { className: "fweight-600 my-3 mb-1" }, translateTo('You decide', lang)),
                    React.createElement("p", { className: "max-w-fix-280 m-a" }, translateTo('If you are happy, you book one of our service packages or withdraw without any costs.', lang)))))),
        windowDimensions.width >= 1024 && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "trailFlow" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-3 fadeIn" },
                        React.createElement("div", { className: "ov-h ta-c" },
                            React.createElement("img", { loading: "lazy", className: "w-perc-100 max-w-fix-120", src: AnalyseImg, alt: "text-1" }))),
                    React.createElement("div", { className: "col-3 fadeIn" },
                        React.createElement("div", { className: "ov-h ta-c" },
                            React.createElement("img", { loading: "lazy", className: "w-perc-100 max-w-fix-120", src: DeliverImg, alt: "text-1" }))),
                    React.createElement("div", { className: "col-3 fadeIn" },
                        React.createElement("div", { className: "ov-h ta-c" },
                            React.createElement("img", { loading: "lazy", className: "w-perc-100 max-w-fix-120", src: YourTestImg, alt: "text-1" }))),
                    React.createElement("div", { className: "col-3 fadeIn" },
                        React.createElement("div", { className: "ov-h ta-c" },
                            React.createElement("img", { loading: "lazy", className: "w-perc-100 max-w-fix-120", src: DecideImg, alt: "text-1" })))),
                React.createElement("div", { className: "row" },
                    React.createElement("span", { className: "divider-line" }))),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-12 col-sm-3 mb-2 mb-sm-0 fadeIn" },
                    React.createElement("div", { className: "brdRadius ov-h ta-c" },
                        React.createElement("div", { className: "roundDot ml-a mr-a" }),
                        React.createElement("h4", { className: "fweight-600 my-3 mb-1" }, translateTo('We analyse', lang)),
                        React.createElement("p", { className: "max-w-fix-280 m-a" }, translateTo('We estimate your property and define the sales process with you.', lang)))),
                React.createElement("div", { className: "col-12 col-sm-3 mb-2 mb-sm-0 fadeIn" },
                    React.createElement("div", { className: "brdRadius ov-h ta-c" },
                        React.createElement("div", { className: "roundDot ml-a mr-a" }),
                        React.createElement("h4", { className: "fweight-600 my-3 mb-1" }, translateTo('We deliver', lang)),
                        React.createElement("p", { className: "max-w-fix-280 m-a" }, translateTo('We capture your property and create your personal Brixel Page.', lang)))),
                React.createElement("div", { className: "col-12 col-sm-3 mb-2 mb-sm-0 fadeIn" },
                    React.createElement("div", { className: "brdRadius ov-h ta-c" },
                        React.createElement("div", { className: "roundDot ml-a mr-a" }),
                        React.createElement("h4", { className: "fweight-600 my-3 mb-1" }, translateTo('You test', lang)),
                        React.createElement("p", { className: "max-w-fix-280 m-a" }, translateTo('You can review our work before you decide.', lang)))),
                React.createElement("div", { className: "col-12 col-sm-3 mb-2 mb-sm-0 fadeIn" },
                    React.createElement("div", { className: "brdRadius ov-h ta-c" },
                        React.createElement("div", { className: "roundDot ml-a mr-a" }),
                        React.createElement("h4", { className: "fweight-600 my-3 mb-1" }, translateTo('You decide', lang)),
                        React.createElement("p", { className: "max-w-fix-280 m-a" }, translateTo('Start with Brixel One if you are happy with our work or withdraw without any costs.', lang)))))))));
};
const mapStateToProps = (state) => ({
    lang: get(state, 'common.language', 'en'),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
const mapDispatchToProps = (dispatch) => ({
    handleSetWindowsDimension: bindActionCreators(setWindowDimensions, dispatch),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(IntroScanFlow);
