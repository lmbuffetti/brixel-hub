import React from 'react';
import { change } from '@brixel-io/brixel-components/dist/form';
import get from 'lodash/get';
import { BrixelButtonSecondary } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import { connect } from 'react-redux';
import { compose } from 'redux';
// LOGOS
import ubsLogo from '../../../images/Companies/ubsKey4/ubsLogo.svg';
const IntroBuyerUBS = (props) => {
    // PROPS
    const { changeFieldValue, onClick, lang, } = props;
    const onClickForwardContactFlow = (type) => {
        changeFieldValue('type', type);
        onClick();
    };
    return (React.createElement("main", { className: "introScanFlow pt-2 pt-md-4 pb-2 pb-md-4 h-perc-100 txtText900" },
        React.createElement("div", { className: "mb-5 mb-md-10" },
            React.createElement("h2", { className: 'fsize-600 fsize-md-700 fweight-600 max-w-fix-600 ta-c m-a  mb-1' }, translateTo('Your financing with UBS.', lang)),
            React.createElement("h2", { className: 'fsize-600 fsize-md-700 fweight-400 max-w-fix-600 ta-c m-a mb-3 mb-md-6}' }, translateTo('How would you like to be advised?', lang))),
        React.createElement("div", { className: "dis-fl-col" },
            React.createElement("div", { className: "dis-fl-col w-perc-100 w-perc-lg-50 shadow-2dp bgWhite brdRadius p-3 p-md-6 mb-3 mb-md-0 ml-a mr-a" },
                React.createElement("div", { className: "dis-f mb-3" },
                    React.createElement("div", { className: "w-perc-70 w-perc-md-55" },
                        React.createElement("h5", { className: "fweight-600 fSizePx18" }, translateTo('Personal consultation on site or via video call.', lang))),
                    React.createElement("div", { className: "w-perc-30 w-perc-md-45 ta-r" },
                        React.createElement("img", { loading: "lazy", className: "h-fix-24 mt-small-4 ml-a", alt: 'UBS Logo', src: ubsLogo }))),
                React.createElement("div", { className: "bulletPointsStep mb-4" },
                    React.createElement("ul", null,
                        React.createElement("li", { className: "mb-2 txtText700 fsize-300" }, translateTo('Financing offer individually tailored to your needs and goals', lang)),
                        React.createElement("li", { className: "mb-2 txtText700 fsize-300" }, translateTo('Free consultation at a branch office or via video call (including advice on tax implications of buying real estate)', lang)),
                        React.createElement("li", { className: " txtText700 fsize-300" }, translateTo('Attractive and flexible solutions, for example for construction financing or renovation projects', lang)))),
                React.createElement("div", { className: "mt-a" },
                    React.createElement(BrixelButtonSecondary, { onClick: () => onClickForwardContactFlow('ubs'), className: "mt-a", label: translateTo('Arrange personal consultation', lang), rounded: true }))))));
};
const mapStateToProps = (state) => ({
    lang: get(state, 'common.language', 'en'),
});
const mapDispatchToProps = (dispatch) => ({
    changeFieldValue(field, value) {
        dispatch(change('contactFlow', field, value));
    },
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(IntroBuyerUBS);
