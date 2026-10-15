import React from 'react';
import { connect } from 'react-redux';
import translateTo from '../../../../../utils/translation';
import get from 'lodash/get';
const ProofOfFinancingTermsCondition = ({ activeSingleCompany, lang, }) => {
    return (React.createElement("div", { className: "max-w-fix-768 ml-a mr-a brdRadius bgWhite brdSmall brdText100 p-2 p-sm-4" },
        React.createElement("p", { className: 'fsize-300 txtText700' }, activeSingleCompany.stub === 'baloise' ? (React.createElement(React.Fragment, null, translateTo('I agree that my data (surname, first name, telephone number, email) may be transmitted to Baloise Insurance Ltd, Baloise Life Ltd and Baloise Bank Ltd for the purpose of contacting me for consultation on home financing including risk protection as well as the information that I use the Brixel service for the purpose of evaluating and optimising the service.', lang))) : (React.createElement(React.Fragment, null, translateTo('I agree that my data (surname, first name, address, postal code, telephone number, e-mail address) is transmitted to UBS for reporting and advisory purposes.', lang))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: state?.property?.activeSingleProperty || {},
    activeSingleCompany: state?.companies?.activeSingleCompany || {},
    windowDimensions: get(state, 'common.windowDimensions', {}),
    lang: state?.common?.language || 'en',
});
export default connect(mapStateToProps, null)(ProofOfFinancingTermsCondition);
