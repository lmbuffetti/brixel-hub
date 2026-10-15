import React, { useEffect, useState } from 'react';
import get from 'lodash/get';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BrixelButtonPrimary } from '@brixel-io/brixel-components';
import { BrixelInputText } from '@brixel-io/brixel-components/dist/form';
import { spinnerOff } from '../actions/CommonActions';
import { checkToken } from '../actions/UserActions';
import { setCookie } from '../utils/helpers';
function TokenInput(props) {
    const [token, setToken] = useState('');
    const { handleCheckToken, handleSpinnerOff, } = props;
    useEffect(() => {
        handleSpinnerOff();
    }, []);
    const tokenInput = (e) => {
        e.preventDefault();
        setCookie('brixelToken', token);
        handleCheckToken(token);
    };
    return (React.createElement("div", null,
        React.createElement("div", { className: "tokeninput", style: { textAlign: 'center' } },
            React.createElement("h1", { className: "title text-center" }, "Token Input"),
            React.createElement("div", { className: "container" },
                React.createElement("div", { className: "max-w-fix-400 m-a" },
                    React.createElement("div", { className: "group" },
                        React.createElement(BrixelInputText, { label: "Enter token here", placeholder: "", input: {
                                name: 'token',
                                value: token,
                                onChange: (val) => setToken(val),
                            } })),
                    React.createElement(BrixelButtonPrimary, { className: "mt-2 m-a", label: "Submit Token", onClick: (e) => tokenInput(e) }))))));
}
const mapStateToProps = (state) => ({
    user: get(state, 'user.loggedInUser', []),
});
const mapDispatchToProps = (dispatch) => ({
    handleCheckToken: bindActionCreators(checkToken, dispatch),
    handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(TokenInput);
