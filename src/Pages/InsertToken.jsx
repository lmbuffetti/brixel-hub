/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BrixelInputText, BrixelButtonPrimary } from '@brixel/brixel-components';
import { resetRequest } from '../actions/CommonActions';
import { checkToken } from '../actions/UserActions';
import { setCookie } from '../utils/helpers';

function TokenInput(props) {
  const [token, setToken] = useState('');
  const { handleCheckToken } = props;

  const tokenInput = (e) => {
    e.preventDefault();
    setCookie('brixelToken', token);
    handleCheckToken(token);
  };

  return (
    <div>
      <div className="tokeninput" style={{ textAlign: 'center' }}>
        <h1 className="title text-center">Token Input</h1>
        <div className="container">
          <div className="max-w-fix-400 m-a">
            <div className="group">
              <BrixelInputText
                label="Enter token here"
                placeholder=""
                input={{
                  name: "token",
                  value: token,
                  onChange: (val) => setToken(val),
                }}
              />
            </div>
            <BrixelButtonPrimary
              className="mt-2 m-a"
              label="Submit Token"
              onClick={(e) => tokenInput(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

TokenInput.propTypes = {
  history: PropTypes.object.isRequired,
  handleCheckToken: PropTypes.func.isRequired,
  request: PropTypes.bool,
  user: PropTypes.object,
  handleResetRequest: PropTypes.func.isRequired,
};

TokenInput.defaultProps = {
  request: false,
  user: {},
};

const mapStateToProps = (state) => ({
  user: get(state, 'user.loggedUser', []),
  request: get(state, 'common.requestDone', false),
});

const mapDispatchToProps = (dispatch) => ({
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleResetRequest: bindActionCreators(resetRequest, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TokenInput));
