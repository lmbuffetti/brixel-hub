import React from 'react';
import { BrixelProgressBar, } from '@brixel-io/brixel-components';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { setModal } from '../../../actions/CommonActions';
import learMoreImg1 from '../../../images/Market/learMoreImg1.svg';
import learMoreImg2 from '../../../images/Market/learMoreImg2.svg';
// import learMoreImg3 from '../../../images/Market/learMoreImg3.svg';
import learMoreImg4 from '../../../images/Market/learMoreImg4.svg';
import learMoreImg5 from '../../../images/Market/learMoreImg5.svg';
import translateTo from '../../../utils/translation';
export const stepLearnMoreListingsProperty = 4;
const LearnMoreListingsProperty = (props) => {
    const { lang, step, } = props;
    return (React.createElement("div", { className: "px-1 px-sm-0" },
        React.createElement("div", { className: 'mt-7-neg' },
            React.createElement("p", { className: "fsize-300 txtText700" },
                React.createElement("span", null, translateTo('Step', lang)),
                React.createElement("span", { className: "mx-small-4" }, step),
                React.createElement("span", null, translateTo('of', lang)),
                React.createElement("span", { className: "ml-small-4" }, stepLearnMoreListingsProperty)),
            React.createElement("div", { className: "mt-3 mb-5" },
                React.createElement(BrixelProgressBar, { barBackground: "text", rounded: true, progressValue: (step * 100) / stepLearnMoreListingsProperty }))),
        React.createElement("div", { className: "" },
            React.createElement("div", { style: { display: step === 1 ? 'block' : 'none' } },
                React.createElement("img", { className: "mb-5 w-perc-100", src: learMoreImg1, alt: "Pre Image Published" }),
                React.createElement("h5", { className: "mb-2 fweight-600" }, translateTo('Welcome 👋', lang)),
                React.createElement("p", null,
                    React.createElement("span", null, translateTo('This is your Brixel Hub space.', lang)),
                    React.createElement("span", { className: "dis-b" }, translateTo('A place where you can do great things and find your dream home.', lang))),
                React.createElement("p", { className: "pt-1" }, translateTo('Let’s find out what you can do here! 🚀', lang))),
            React.createElement("div", { style: { display: step === 2 ? 'block' : 'none' } },
                React.createElement("img", { className: "mb-5 w-perc-100", src: learMoreImg2, alt: "Pre Image Published" }),
                React.createElement("h5", { className: "mb-2 fweight-600" }, translateTo('Search Profile', lang)),
                React.createElement("p", null, translateTo('To find exactly what you’re looking for you can first create a Search Profile.', lang)),
                React.createElement("p", null, translateTo('By telling us your preferences, we can show you the right properties so you’re more likely to find your dream house!', lang))),
            React.createElement("div", { style: { display: step === 3 ? 'block' : 'none' } },
                React.createElement("img", { className: "mb-5 w-perc-100", src: learMoreImg4, alt: "Pre Image Published" }),
                React.createElement("h5", { className: "mb-2 fweight-600" }, translateTo('Published properties', lang)),
                React.createElement("p", null, translateTo('Explore our properties that are already on sale with 3D tour, real pictures, documentation and verified informations.', lang)),
                React.createElement("p", null, translateTo('You found your dream house? You can already start an offer!', lang))),
            React.createElement("div", { style: { display: step === 4 ? 'block' : 'none' } },
                React.createElement("img", { className: "mb-5 w-perc-100", src: learMoreImg5, alt: "Pre Image Published" }),
                React.createElement("h5", { className: "mb-2 fweight-600" }, translateTo('Property card actions', lang)),
                React.createElement("ul", { className: "pl-3" },
                    React.createElement("li", null, translateTo('Easily see property location;', lang)),
                    React.createElement("li", { className: "my-1" }, translateTo('Hide a property if you’re not interested;', lang)),
                    React.createElement("li", null, translateTo('Like properties to add them to your saved list.', lang)))))));
};
const mapDispatchToProps = (dispatch) => ({
    handleSetModal: bindActionCreators(setModal, dispatch),
});
export default compose(connect(null, mapDispatchToProps))(LearnMoreListingsProperty);
