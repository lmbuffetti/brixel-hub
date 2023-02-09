import React, {useEffect, useState} from 'react';
import get from 'lodash/get';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {BrixelButtonPrimary} from '@brixel/brixel-components';
import {BrixelInputText} from '@brixel/brixel-components/dist/form';
import {spinnerOff} from '../actions/CommonActions';
import {checkToken} from '../actions/UserActions';
import {setCookie} from '../utils/helpers';
import type {InsertTokenType} from '../@types/Pages/InsertToken';

function TokenInput(props: InsertTokenType) {
  const [token, setToken] = useState('');
  const {
    handleCheckToken,
    handleSpinnerOff,
  } = props;

  useEffect(() => {
    handleSpinnerOff();
  }, []);

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
                  name: 'token',
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

const mapStateToProps = (state) => ({
  user: get(state, 'user.loggedInUser', []),
});

const mapDispatchToProps = (dispatch) => ({
  handleCheckToken: bindActionCreators(checkToken, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenInput);
