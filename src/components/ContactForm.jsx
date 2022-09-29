/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { BrixelIcon } from '@brixel/brixel-components';
import { translateTo } from '../utils/translation';
import {
  BrixelTextArea,
  BrixelInputText,
  Validation,
  ReduxField,
  initializeForm,
  change,
  destroy,
} from '@brixel/brixel-components/dist/form';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { createPropertyVisitBooking } from '../actions/PropertyActions';
import { sendMessage, spinnerSmall } from '../actions/CommonActions';

function ContactForm(props) {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  // PROPS
  const {
    action,
    activeSingleCompany,
    activeSingleProperty,
    changeFieldValue,
    destroyForm,
    errorValue,
    formValue,
    handleCreatePropertyVisitBooking,
    handleSendMessage,
    handleSpinnerSmall,
    initialValues,
    isSmallLoading,
    lang,
    loggedInUser,
    onChangeAction,
    resetAction,
    scheduleVisit,
    type,
  } = props;
  // STATE
  const [step, setStep] = useState('form');
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    setStep('form');
    return () => {
      setStep('form');
      destroyForm();
    };
  }, []);

  useEffect(() => {
    if (isSmallLoading.sendMessage === 'sentMessage') {
      setStep('success');
      changeFieldValue('userMessage', '');
      handleSpinnerSmall({ sendMessage: false });
      // history.push({state: { step: 'success' }});
      // handleResetSendMessage();
    }
  }, [isSmallLoading]);

  useEffect(() => {
    if (!formValue.userEmail && loggedInUser.email) {
      changeFieldValue('userName', loggedInUser.name);
      changeFieldValue('userPhone', get(loggedInUser, 'phone', { }));
      changeFieldValue('userEmail', loggedInUser.email);
    }
  }, [initialValues, loggedInUser, activeSingleCompany.id]);

  const checkField = () => {
    let isValid = true;
    const currentError = cloneDeep(errorValue);
    delete currentError.location;
    delete currentError.reset;
    if (scheduleVisit) delete currentError.userMessage;
    Object.keys(currentError).forEach((item) => {
      if (isValid) isValid = currentError[item] === true;
    });
    return isValid;
  };

  const submitContactForm = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    resetAction();
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
        smallLoader: 'sendMessage',
      };
      handleCreatePropertyVisitBooking(data);
      onChangeAction('isLoading');
    } else {
      const data = {
        messageType: type ? baseByData.messageTypeID[type] : 0,
        page: activeSingleProperty.id,
        title: 'Page',
        message: formValue.userMessage,
        senderName: formValue.userName,
        senderEmail: formValue.userEmail,
        senderPhone: formValue.userPhone,
        language: lang,
        smallLoader: 'sendMessage',
      };
      handleSendMessage(data);
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
                        label: translateTo('Name', lang),
                      }}
                      meta={{
                        dirty: get(formValue, 'userName', null),
                        invalid: get(errorValue, 'userName', true) !== true,
                        message: {
                          error: translateTo('Please insert a name', lang),
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
                            label: translateTo('Phone', lang),
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
                            placeholder: translateTo('Your email address', lang),
                          }}
                          labels={{
                            label: translateTo('Email', lang),
                          }}
                          meta={{
                            dirty: get(formValue, 'userEmail', null),
                            invalid: get(errorValue, 'userEmail', true) !== true,
                            message: {
                              error: translateTo('Please insert a valid email', lang),
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
                        placeholder: translateTo(scheduleVisit ? 'Let us know about important schedule information' : 'Let us know how we can help you', lang),
                        validate: scheduleVisit ? null : [Validation.required],
                      }}
                      labels={{
                        label: translateTo('Message', lang),
                      }}
                      meta={{
                        dirty: get(formValue, 'userMessage', null),
                        invalid: get(errorValue, 'userMessage', true) !== true,
                        message: {
                          error: translateTo('Please insert a valid message', lang),
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
                {translateTo('YOUR MESSAGE WAS SENT', lang)}
              </h6>
              <h4 className="mb-2 txtDark700">{translateTo('Thank you', lang)}</h4>
              <h5 className="heading6 txtDark700">{translateTo('We will contact you as soon as possible.', lang)}</h5>
            </section>
            <section className="bodySection mx-2-neg px-2 bgWhite shadow-1dp brdRadiusTop pt-2 pb-4 mx-sm-5-neg px-sm-5 mb-1-neg">
              <p className="mb-2"><b>{translateTo('Here are 3 tips for a smooth process', lang)}</b></p>

              <ul>
                <li>
                  <BrixelIcon icon="tour" color="green" background="green" saturation={200} saturationTxt={700} />
                  <div>
                    <span>{translateTo('Make sure you visited the', lang)}</span>&nbsp;
                    <span className="txtPrimary400 cur-poi" onClick={() => history.push('../explore/tour')}>
                      <span>{translateTo('3D Tour', lang)}</span>
                    </span>
                  </div>
                </li>
                <li className="redIcon">
                  <BrixelIcon icon="favorite-house" color="green" background="green" saturation={200} saturationTxt={700} />
                  {translateTo('Do not forget to favorite the property to keep all the information in one place', lang)}
                </li>
                <li className="redIcon">
                  <BrixelIcon icon="money" color="green" background="green" saturation={200} saturationTxt={700} />
                  {translateTo('Get in touch with your bank about financing before you visit', lang)}
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
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  destroyForm: PropTypes.func.isRequired,
  errorValue: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  handleCreatePropertyVisitBooking: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  handleSpinnerSmall: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  onChangeAction: PropTypes.func.isRequired,
  resetAction: PropTypes.func,
  scheduleVisit: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.string,
};

ContactForm.defaultProps = {
  action: null,
  resetAction: () => '',
  scheduleVisit: null,
  type: null,
};

const mapStateToProps = (state) => {
  const loggedInUser = get(state, 'user.loggedInUser.user', {});
  return ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    configUrl: get(state, 'common.configUrl', {}),
    errorValue: get(state, 'brixelForm.ContactForm.syncErrors', {}),
    formValue: get(state, 'brixelForm.ContactForm.values', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lang: get(state, 'common.language.code', 'de'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
    initialValues: {
      userName: get(loggedInUser, 'name', {}),
      userPhone: get(loggedInUser, 'phone', {}),
      userEmail: get(loggedInUser, 'email', {}),
    },
  });
};

const mapDispatchToProps = (dispatch) => ({
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
  handleSpinnerSmall: bindActionCreators(spinnerSmall, dispatch),
  handleSendMessage: bindActionCreators(sendMessage, dispatch),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(ContactForm);
