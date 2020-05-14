/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { translateTo } from '../utils/translation';
import { change } from 'redux-form';
import { BrixelCheckbox, BrixelInputText, Validation, ReduxField } from '@brixel/brixel-components';
import get from 'lodash/get';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

const LoginSignup = (props) => {
  // PROPS
  const {
    changeFieldValue,
    formName,
    formValue,
    onChangeLogin,
    errorValue,
    lang,
    loggedInUser,
    showErrors,
  } = props;
  // STATE
  const [loginPage, setLoginPage] = useState(false);

  useEffect(() => {
    if (typeof loggedInUser.token === 'undefined') {
      changeFieldValue(formName, 'signup', !loginPage);
    }
    changeFieldValue(formName, 'signupScreen', loginPage ? 'login' : 'register');
    onChangeLogin(loginPage)
  }, [loginPage]);

  if (!formValue) {
    return (
      <div />
    )
  }

  return (
    <>
      {console.log(props)}
      {
        loginPage ? (
          <>
            <p className="mb-md-9">
              <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(false)}>
                {translateTo(lang, "You don't have a profile?")}
              </span>
            </p>
            <ReduxField
              input={{
                name: "email",
                placeholder: "",
                type: "email",
                validate: [Validation.required],
                asyncValidate: [Validation.required],
                asyncBlurFields: ['username'],
              }}
              labels={{
                label: translateTo(lang, "Email address"),
              }}
              design={{
                className: "mt-2",
              }}
              form={formName}
              component={BrixelInputText}
              meta={{
                dirty: (showErrors || formValue.email),
                invalid: get(errorValue, 'email', true) !== true,
                message: {
                  error: translateTo(lang, "Please insert a valid email")
                },
              }}
            />
            <ReduxField
              input={{
                name: "password",
                placeholder: "",
                type: "password",
                validate: [Validation.required],
              }}
              labels={{
                label: translateTo(lang, "Password"),
              }}
              design={{
                className: "mt-2",
              }}
              form={formName}
              component={BrixelInputText}
              meta={{
                dirty: (showErrors || formValue.password),
                invalid: get(errorValue, 'password', true) !== true,
                message: {
                  error: translateTo(lang, "Please insert a valid password")
                },
              }}
            />
            <p className="mt-1">
              <a
                className="txtPrimary400 cur-poi"
                href={`${baseByData.loginBasePath}/recover`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {translateTo(lang, "Forgot password?")}
              </a>
            </p>

          </>
        ) : (
          <>
            <p className="mb-md-9">
              <span className="txtPrimary400 cur-poi" onClick={() => setLoginPage(true)}>
                {translateTo(lang, "You already have a profile?")}
              </span>
            </p>
            <div className="dis-f">
              <ReduxField
                input={{
                  name: "firstName",
                  placeholder: "",
                  type: "text",
                  validate: [Validation.required],
                }}
                labels={{
                  label: translateTo(lang, "First name"),
                }}
                design={{
                  className: "mt-2",
                }}
                form={formName}
                component={BrixelInputText}
                meta={{
                  dirty: (showErrors || formValue.email),
                  invalid: get(errorValue, 'firstName', true) !== true,
                  message: {
                    error: translateTo(lang, "Please insert a valid email")
                  },
                }}
              />
              <ReduxField
                form={formName}
                design={{
                  className: "mt-2 w-perc-100 ml-2"

                }}
                input={{
                  name: "lastName",
                  placeholder: "",
                  type: "text",
                  validate: [Validation.required],
                }}
                labels={{
                  label: translateTo(lang, "Last name"),
                }}
                component={BrixelInputText}
                meta={{
                  dirty: (showErrors || formValue.lastName),
                  invalid: (showErrors || formValue.lastName) && errorValue.lastName !== true,
                  message: {
                    error: translateTo(lang, "Please insert a valid last name")
                  },
                }}
              />
            </div>
            <ReduxField
              form={formName}
              design={{
                className: "mt-2",

              }}
              input={{
                name: "email",
                type: "email",
                placeholder: "",
                validate: [Validation.isEmail, Validation.required],
              }}
              labels={{
                label: translateTo(lang, "Email address")

              }}
              component={BrixelInputText}
              meta={{
                dirty: (showErrors || formValue.email),
                invalid: (showErrors || formValue.email) && errorValue.email !== true,
                message: {
                  error: translateTo(lang, "Please insert a valid email")
                },
              }}
            />
            <ReduxField
              form={formName}
              design={{
                className: "mt-2",
              }}
              input={{
                name: "phone",
                placeholder: "",
                type: "text",
              }}
              inputFormat={{
                formatType: 'tel'
              }}
              labels={{
                label: translateTo(lang, "Phone number"),
              }}
              component={BrixelInputText}
            />
            <div className="mt-2">
              <ReduxField
                form={formName}
                component={BrixelCheckbox}
                design={{
                  className: "body2 w-perc-100 max-w-perc-100"
                }}
                input={{
                  name: "privacy",
                  options: [
                    {
                      label: translateTo(lang, `I hereby confirm that I have read, understand and accept the <a href="https://gobrixel.nl/voorwaarden/" target="_blank">terms</a> and <a href="https://gobrixel.nl/privacybeleid/" target="_blank">privacy policy</a> of Brixel.`),
                      value: 'privacy'
                    }
                  ],
                  validate: [Validation.required],
                }}
                meta={{
                  dirty: (showErrors || formValue.privacy),
                  invalid: (showErrors || formValue.privacy) && errorValue.privacy !== true,
                  message: {
                    error: translateTo(lang, "Please accept terms and privacy policy")
                  }
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
  changeFieldValue: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  formName: PropTypes.string.isRequired,
  lang: PropTypes.string,
  loggedInUser: PropTypes.object.isRequired,
  showErrors: PropTypes.bool,
  onChangeLogin: PropTypes.func.isRequired,
};

LoginSignup.defaultProps = {
  redirectTo: null,
  showErrors: false,
  onChangeLogin: () => '',
};

const mapStateToProps = (state, props) => ({
  errorValue: get(state, `form.${props.formName}.syncErrors`, {}),
  formValue: get(state, `form.${props.formName}.values`, {}),
  lang: get(state, 'common.language', {}),
  loggedInUser: get(state, 'user.loggedInUser', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(formName, field, value) {
    dispatch(change(formName, field, value));
  },
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(LoginSignup);

