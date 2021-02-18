/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  BrixelTextArea, BrixelInputText, Validation, BrixelIcon, ReduxField, initializeForm, change, destroy,
} from '@brixel/brixel-components';
import { createPropertyVisitBooking } from '../actions/PropertyActions';

function ContactForm(props) {
  // PROPS
  const {
    action,
    activeSingleProperty,
    changeFieldValue,
    destroyForm,
    errorValue,
    formValue,
    handleCreatePropertyVisitBooking,
    history,
    initForm,
    initialValues,
    lang,
    loggedInUser,
    messageSent,
    onChangeAction,
    scheduleVisit,
    type,
  } = props;
  // STATE
  const [step, setStep] = useState('form');
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => () => destroyForm(), []);

  useEffect(() => {
    if (messageSent) {
      setStep('success');
      changeFieldValue('userMessage', '');
      // history.push({state: { step: 'success' }});
      // handleResetSendMessage();
    }
  }, [messageSent]);

  useEffect(() => {
    initForm(initialValues);
  }, []);

  const checkField = () => {
    let isValid = true;
    Object.keys(errorValue).forEach((item) => {
      if (isValid) isValid = errorValue[item] === true;
    });
    return isValid;
  };

  const submitContactForm = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!checkField()) {
      setShowErrors(true);
      return false;
    }
    onChangeAction(null);
    if (scheduleVisit) {
      const data = {
        page: activeSingleProperty.id,
        slots: scheduleVisit,
        buyer: {
          name: formValue.userName,
          phone: formValue.userPhone,
          email: formValue.userEmail,
          language: lang,
        },
        getByUser: loggedInUser.id,
        message: formValue.userMessage,
      };
      handleCreatePropertyVisitBooking(data);
      onChangeAction('isLoading');
    }
    return null;
  };

  useEffect(() => {
    if (action === 'send') {
      submitContactForm();
    }
  }, [action]);

  return (
    <>
      {
        step === 'form' && (
          <div className="dis-fl-col">
            <section className="bodySection mt-2 pb-8 pb-lg-0">
              <form onSubmit={(e) => submitContactForm(e)} name="form" className="contactForm" id="formAsk">
                <div className="">
                  <div>
                    <ReduxField
                      form="ContactForm"
                      component={BrixelInputText}
                      design={{
                        className: 'mb-1',
                      }}
                      input={{
                        name: 'userName',
                        type: 'text',
                        validate: [Validation.required],
                        placeholder: 'Your full name',
                      }}
                      labels={{
                        label: 'Name',
                      }}
                      meta={{
                        dirty: get(formValue, 'userName', null),
                        invalid: get(errorValue, 'userName', true) !== true,
                        message: {
                          error: 'Please insert a name',
                        },
                        showErrors,
                      }}
                    />
                    <div className="row">
                      <div className="col-12">
                        <ReduxField
                          form="ContactForm"
                          component={BrixelInputText}
                          design={{
                            className: 'mb-1',
                          }}
                          input={{
                            name: 'userPhone',
                            type: 'text',
                            placeholder: '',
                          }}
                          inputFormat={{
                            formatType: 'tel',
                          }}
                          labels={{
                            label: 'Phone',
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <ReduxField
                          form="ContactForm"
                          component={BrixelInputText}
                          design={{
                            className: 'mb-1',
                          }}
                          input={{
                            name: 'userEmail',
                            type: 'email',
                            validate: [Validation.isEmail, Validation.required],
                            placeholder: 'Your email address',
                          }}
                          labels={{
                            label: 'Email',
                          }}
                          meta={{
                            dirty: get(formValue, 'userEmail', null),
                            invalid: get(errorValue, 'userEmail', true) !== true,
                            message: {
                              error: 'Please insert a valid email',
                            },
                            showErrors,
                          }}
                        />
                      </div>
                    </div>

                    <ReduxField
                      form="ContactForm"
                      component={BrixelTextArea}
                      design={{
                        className: 'mb-1',
                      }}
                      input={{
                        name: 'userMessage',
                        placeholder: type === 'schedule' ? 'Let us know about important schedule information' : 'Let us know how we can help you',
                      }}
                      labels={{
                        label: 'Message',
                      }}
                      meta={{
                        dirty: get(formValue, 'userMessage', null),
                        invalid: get(errorValue, 'userMessage', true) !== true,
                        message: {
                          error: 'Please insert a valid message',
                        },
                        showErrors,
                      }}
                    />
                  </div>
                </div>
              </form>
            </section>
          </div>
        )
      }
      {
        step === 'success' && ( // SUCCESS SENT MESSAGE
          <div id="messageSent" className="dis-fl-col jc-b h-perc-100 mb-2-neg">
            <section className="titleSection">
              <h6 className="mb-1 txtGreen400 dis-f a-bl">
                YOUR MESSAGE WAS SENT
              </h6>
              <h4 className="mb-2 txtDark700">Thank you</h4>
              <h5 className="heading6 txtDark700">We will contact you as soon as possible.</h5>
            </section>
            <section className="bodySection mx-2-neg px-2 bgWhite shadow-1dp brdRadiusTop pt-2 pb-4 mx-sm-5-neg px-sm-5 mb-1-neg">
              <p className="mb-2"><b>Here are 3 tips for a smooth process</b></p>

              <ul>
                <li>
                  <BrixelIcon icon="tour" color="green" background="green" saturation={200} saturationTxt={700} />
                  <div>
                    <span>Make sure you visited the</span>&nbsp;
                    <span className="txtPrimary400 cur-poi" onClick={() => history.push('../explore/tour')}>
                      <span>3D Tour</span>
                    </span>
                  </div>
                </li>
                <li className="redIcon">
                  <BrixelIcon icon="favorite-house" color="green" background="green" saturation={200} saturationTxt={700} />
                  Do not forget to favorite the property to keep all the information in one place
                </li>
                <li className="redIcon">
                  <BrixelIcon icon="money" color="green" background="green" saturation={200} saturationTxt={700} />
                  Get in touch with your bank about financing before you visit
                </li>
              </ul>
            </section>
          </div>
        )
      }
    </>
  );
}

ContactForm.propTypes = {
  action: PropTypes.string,
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  destroyForm: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreatePropertyVisitBooking: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  messageSent: PropTypes.bool,
  onChangeAction: PropTypes.func.isRequired,
  scheduleVisit: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.string,
};

ContactForm.defaultProps = {
  action: null,
  messageSent: false,
  scheduleVisit: null,
  type: null,
};

const mapStateToProps = (state) => {
  const loggedInUser = get(state, 'user.loggedInUser.user', {});
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    configUrl: get(state, 'common.configUrl', {}),
    errorValue: get(state, 'brixelForm.ContactForm.syncErrors', {}),
    formValue: get(state, 'brixelForm.ContactForm.values', {}),
    lang: get(state, 'common.language.code', 'de'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    messageSent: get(state, 'common.messageSent', false),
    initialValues: {
      userName: get(loggedInUser, 'name', {}),
      userPhone: get(loggedInUser, 'phone', {}),
      userEmail: get(loggedInUser, 'email', {}),
    },
  });
};

const mapPropsToState = (dispatch) => ({
  destroyForm() {
    dispatch(destroy('ContactForm'));
  },
  initForm(value) {
    dispatch(initializeForm('ContactForm', value));
  },
  changeFieldValue(field, value) {
    dispatch(change('ContactForm', field, value));
  },
  handleCreatePropertyVisitBooking: bindActionCreators(createPropertyVisitBooking, dispatch),
});

export default compose(connect(mapStateToProps, mapPropsToState), withRouter)(ContactForm);
