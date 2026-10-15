import { BrixelButtonPrimary, Helpers } from '@brixel-io/brixel-components';
import get from 'lodash/get';
import React from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { compose } from 'redux';
import testDrive from '../images/dashboard/testDrive.png';
import testdriveLarge from '../images/Market/testdrive.jpeg';
import translateTo from '../utils/translation';
const BoxTrialTestDirve = (props) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const { activeSingleCompany, activeSingleProperty, className = '', isLarge = false, lang, windowDimensions, } = props;
    const bookNow = () => {
        if (activeSingleProperty.id) {
            localStorage.setItem('backUrl', history.location.pathname);
            history.push(`/${activeSingleProperty.id}/trialRequest`);
        }
    };
    return (React.createElement("div", { onClick: () => bookNow(), className: `testDrive cur-poi dis-f-sm a-c brdRadius bgWhite ${isLarge ? 'w-perc-100 jc-c' : 'p-2'} ${className}` },
        isLarge ? (React.createElement("div", { className: "max-w-fix-144 min-h-fix-200 min-h-fix-sm-360 max-w-fix-sm-264 w-perc-100 ml-a mr-a mr-md-0 mb-2 mb-md-0" },
            React.createElement("img", { loading: "lazy", src: testdriveLarge, alt: "" }))) : (React.createElement("img", { loading: "lazy", className: windowDimensions.width <= 590 ? 'dis-b mx-a' : '', width: 300, src: testDrive, alt: "" })),
        React.createElement("div", { className: `${isLarge ? 'pl-0 pl-md-3 mr-a' : ''} ta-c ta-l-md` },
            React.createElement("h3", { className: `${isLarge ? 'fsize-700 pb-2' : 'fsize-500 pb-1'} txtText900 fweight-600 ` }, translateTo('Test drive our service. No strings attached.', lang)),
            React.createElement("p", { className: `txtText900 ${isLarge ? 'fSizePx18 fsize-sm-500 fweight-400 mb-3 px-2 px-sm-0' : ''}` },
                React.createElement("span", null, translateTo('Get the full Brixel experience worth', lang)),
                React.createElement("span", { className: "ml-small-4" },
                    React.createElement("span", { className: "mr-small-4" }, activeSingleCompany && get(activeSingleCompany, 'meta.teaserPackage.currency', '')),
                    React.createElement("span", null, Helpers.formatNumberValue(+get(activeSingleCompany, 'meta.teaserPackage.price', ''), get(activeSingleCompany, 'meta.teaserPackage.currency', ''))))),
            React.createElement("div", { className: "dis-f jc-c jc-fs-md" },
                React.createElement(BrixelButtonPrimary, { onClick: () => bookNow(), rounded: true, theme: "red", label: translateTo('Book Now', lang), className: `${isLarge ? 'mt-1' : 'mt-3'}` })))));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    windowDimensions: get(state, 'common.windowDimensions', {}),
});
export default compose(connect(mapStateToProps, null))(BoxTrialTestDirve);
