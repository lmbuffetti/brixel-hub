import React from 'react';
import { connect } from 'react-redux';
import translateTo from '../../../../utils/translation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import get from 'lodash/get';
const ProofOfFinancingTermsCondition = ({ activeSingleCompany, lang, }) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const propID = get(match, 'propID', null);
    if (activeSingleCompany?.stub && activeSingleCompany?.stub !== 'ubs')
        history.push(`/buyer/${propID}/home`);
    return (React.createElement("div", { className: "max-w-fix-768 ml-a mr-a brdRadius bgWhite brdSmall brdText50 p-3 p-sm-5" },
        React.createElement("p", null, activeSingleCompany.stub === 'baloise' ? (React.createElement(React.Fragment, null, translateTo('I agree that my data (surname, first name, telephone number, email) may be transmitted to Baloise Insurance Ltd, Baloise Life Ltd and Baloise Bank Ltd for the purpose of contacting me for consultation on home financing including risk protection as well as the information that I use the Brixel service for the purpose of evaluating and optimising the service.', lang))) : (React.createElement(React.Fragment, null, translateTo('I agree that my data (surname, first name, address, postal code, telephone number, e-mail address) is transmitted to UBS for reporting and advisory purposes.', lang))))));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: state?.property?.activeSingleProperty || {},
    activeSingleCompany: state?.companies?.activeSingleCompany || {},
    windowDimensions: get(state, 'common.windowDimensions', {}),
    lang: state?.common?.language || 'en',
});
export default connect(mapStateToProps, null)(ProofOfFinancingTermsCondition);
