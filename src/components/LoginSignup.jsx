import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { translateTo } from '../utils/translation';
import { Field } from 'redux-form';
import { BrixelCheckbox, BrixelInputText, Validation } from '@brixel/brixel-components';
import get from 'lodash/get';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const LoginSignup = (props) => {
  // PROPS
  const {
    formValue,
    errorValue,
    lang,
    showErrors,
  } = props;
  // STATE
  const [loginPage, setLoginPage] = useState(false);
  return (
    <>
      {
        loginPage ? (
          <>
            <p className="mb-md-9">
              <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(false)}>
                {translateTo(lang, "You don't have a profile?")}
              </span>
            </p>
            <Field
              className="mt-2"
              component={BrixelInputText}
              label={translateTo(lang, "Email address")}
              name="email"
              placeholder=""
              type="email"
              validate={[Validation.required]}
              meta={{
                dirty: (showErrors || formValue.email) && errorValue.email !== true,
                invalid: (showErrors || formValue.email) && errorValue.email !== true,
              }}
              message={{
                error: translateTo(lang, "Please insert a valid email")
              }}
            />
            <Field
              className="mt-2"
              component={BrixelInputText}
              label={translateTo(lang, "Password")}
              name="password"
              placeholder=""
              type="password"
              validate={[Validation.required]}
              meta={{
                dirty: (showErrors || formValue.password) && errorValue.password !== true,
                invalid: (showErrors || formValue.password) && errorValue.password !== true,
              }}
              message={{
                error: translateTo(lang, "Please insert a valid password")
              }}
            />
          </>
        ) : (
          <>
            <p className="mb-md-9">
              <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(true)}>
                {translateTo(lang, "You already have a profile?")}
              </span>
            </p>
            <div className="dis-f">
              <Field
                className="mt-2 w-perc-100 mr-2"
                component={BrixelInputText}
                label={translateTo(lang, "First name")}
                name="firstName"
                placeholder=""
                type="text"
                validate={[Validation.required]}
                meta={{
                  dirty: (showErrors || formValue.firstName) && errorValue.firstName !== true,
                  invalid: (showErrors || formValue.firstName) && errorValue.firstName !== true,
                }}
                message={{
                  error: translateTo(lang, "Please insert a valid first name")
                }}
              />
              <Field
                className="mt-2 w-perc-100 ml-2"
                component={BrixelInputText}
                label={translateTo(lang, "Last name")}
                name="lastName"
                placeholder=""
                type="text"
                validate={[Validation.required]}
                meta={{
                  dirty: (showErrors || formValue.lastName) && errorValue.lastName !== true,
                  invalid: (showErrors || formValue.lastName) && errorValue.lastName !== true,
                }}
                message={{
                  error: translateTo(lang, "Please insert a valid last name")
                }}
              />
            </div>
            <Field
              className="mt-2"
              component={BrixelInputText}
              label={translateTo(lang, "Email address")}
              name="email"
              placeholder=""
              type="email"
              validate={formValue.email ? [Validation.isEmail] : [Validation.required]}
              meta={{
                dirty: (showErrors || formValue.email) && errorValue.email !== true,
                invalid: (showErrors || formValue.email) && errorValue.email !== true,
              }}
              message={{
                error: translateTo(lang, "Please insert a valid email")
              }}
            />
            <Field
              className="mt-2"
              component={BrixelInputText}
              label={translateTo(lang, "Phone number")}
              name="phone"
              placeholder=""
              type="text"
            />
            <div className="mt-2">
              <Field
                component={BrixelCheckbox}
                options={[{label: translateTo(lang, `I hereby confirm that I have read, understand and accept the <a href="https://gobrixel.nl/voorwaarden/" target="_blank">terms</a> and <a href="https://gobrixel.nl/privacybeleid/" target="_blank">privacy policy</a> of Brixel.`), value: 'privacy'}]}
                name="privacy"
                className="body2 w-perc-100 max-w-perc-100"
                validate={[Validation.required]}
                meta={{
                  dirty: (showErrors || formValue.privacy) && errorValue.privacy !== true,
                  invalid: (showErrors || formValue.privacy) && errorValue.privacy !== true,
                }}
                message={{
                  error: translateTo(lang, "Please accept terms and privacy policy")
                }}
              />
            </div>
          </>
        )
      }
    </>
  )
};

LoginSignup.propTypes = {
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  lang: PropTypes.string,
  loggedUser: PropTypes.object.isRequired,
  showErrors: PropTypes.bool,
};

LoginSignup.defaultProps = {
  redirectTo: null,
  showErrors: false,
};

const mapStateToProps = (state, props) => ({
  errorValue: get(state, 'form.GetStarted.syncErrors', {}),
  formValue: get(state, 'form.GetStarted.values', {}),
  lang: get(state, 'common.language', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(LoginSignup);

