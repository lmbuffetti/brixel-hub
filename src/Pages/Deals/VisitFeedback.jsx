/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* global Transifex */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  BrixelCheckbox,
  BrixelInputText,
  BrixelRadioButton,
  ReduxField,
  BrixelButtonPrimary,
  Validation,
  changeSyncError,
  initializeForm, Helpers, BrixelIcon,
} from '@brixel/brixel-components';
import queryString from 'query-string';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import { spinnerOff } from '../../actions/CommonActions';
import { sendVisitFeedback } from '../../actions/DealActions';
import { getActiveSingleProperty } from '../../actions/PropertyActions';
import { setActiveSingleCompany } from '../../actions/CompanyActions';
import { setCookie } from '../../utils/helpers';

const VisitFeedback = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    contacts,
    formValue,
    handleUpdateError,
    handleSendVisitFeedback,
    handleGetActiveSingleProperty,
    handleSetActiveSingleCompany,
    history,
    handleInitForm,
    initialValues,
    isSmallLoading,
    match,
  } = props;
  // GET URL PARAMS
  const dealID = get(match, 'params.dealID', null);
  const pageID = get(match, 'params.pageID', null);
  const [disabledSend, setDisabledSend] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);
  const urlParams = queryString.parse(get(history, 'location.search', ''));
  const status = urlParams.status === 'true';
  const { lang } = urlParams;

  const checkPriceReason = get(formValue, 'reasons', null) && get(formValue, 'reasons', []).findIndex((val) => val === 'price') > -1;

  useEffect(() => {
    setCookie('brixelLang', lang);
    if (typeof Transifex !== 'undefined') Transifex.live.translateTo(lang);
  }, [lang]);

  const onUpdateError = () => {
    const validateField = ['reasons'];
    if (checkPriceReason) validateField.push('priceChangeAlert');
    let isValid = true;
    validateField.forEach((key) => {
      const checkError = Validation.required(get(formValue, key, ''));
      if ((checkError !== true && checkError !== null) && isValid) isValid = false;
      handleUpdateError(key, checkError);
    });
    setDisabledSend(!isValid);
  };

  const saveData = () => {
    const data = {
      ...formValue,
      id: dealID,
      smallLoader: 'sendVisit',
      sendSlack: false,
      isInterested: status,
    };
    handleSendVisitFeedback(data);
  };

  useEffect(() => {
    if (activeSingleProperty.id) {
      const data = {
        ...initialValues,
        status,
      };
      handleInitForm(data);
      handleSetActiveSingleCompany(activeSingleProperty.company);
    }
  }, [activeSingleProperty]);

  useEffect(() => {
    if (has(formValue, 'status')) saveData();
  }, [formValue.status]);

  useEffect(() => {
    onUpdateError();
  }, [formValue]);

  useEffect(() => {
    if (!disabledSend && isSmallLoading.sendDataSent === true) {
      setSuccessMessage(true);
    }
  }, [isSmallLoading]);

  useEffect(() => {
    const data = {
      fullVersion: false,
      smallLoader: 'property',
      stub: pageID,
    };
    handleGetActiveSingleProperty(data);
    onUpdateError();
  }, []);

  // REF
  const singleStepRef = useRef(null);
  const multiStepSlidesRef = useRef(null);

  return (
    <div id="bodyModalWrapper" className="withHeader getStarted visitFeedback">

      <div className="bodyModal dis-fl-col upgradeModal container">
        <form
          id="multiStepForm"
          autoComplete="off"
          className="interactive dis-fl-col jc-b"
        >
          <div ref={multiStepSlidesRef} className="multiStepSlides">
            <div ref={singleStepRef} className="singleStep zIndex1 pt-5 jc-c fade-enter-active fade-enter">
              <div className="subcontainer m-a">
                {
                  status ? (
                    <div id="step-0" className="dis-fl-col flex-wrap">
                      <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 mb-sm-6">
                        Visit Feedback
                      </h2>
                      <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5 w-perc-100 mb-5">
                        <div className=" multiFieldWrap w-perc-100 ">
                          <div className="dis-f jc-b h-perc-100 a-t">
                            <div className="ml-0 mr-a pr-10 dis-f-col jc-b w-perc-100 pos-r" tabIndex="-1">
                              <p>
                                We are happy to hear that you are still interested in the property.
                              </p>
                              <p className="mt-1">
                                You can contact us if you have any specific questions to the owner.
                              </p>

                              <div className="mt-3">
                                {
                                  contacts.phone && (
                                    <a href={`tel:${Helpers.telephoneFormat(contacts.phone)}`} className="dis-f a-c mb-2">
                                      <BrixelIcon
                                        color="altBlue"
                                        saturationTxt={400}
                                        icon="phone"
                                      />
                                      <p className="ml-2">
                                        <span className="txtDark700">{Helpers.telephoneFormat(contacts.phone)}</span>
                                      </p>
                                    </a>
                                  )
                                }
                                {
                                  contacts.email && (
                                    <a href={`mailto: ${contacts.email}`} className="dis-f a-c mb-2">
                                      <BrixelIcon
                                        color="altRed"
                                        saturationTxt={400}
                                        icon="mail"
                                      />
                                      <p className="ml-2">
                                        <span className="txtDark700">{contacts.email}</span>
                                      </p>
                                    </a>
                                  )
                                }
                              </div>

                              <h6 className="mt-5">Do you want to make an offer?</h6>
                              <p>Make your offer online and have a proof of financing ready.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <BrixelButtonPrimary
                        onClick={() => history.push(`/packageFlow/${pageID}/makeOffer`)}
                        rounded
                        theme="altGreen"
                        themeSat={300}
                        className="w-fit m-a"
                        label="Make an offer"
                      />
                    </div>
                  ) : (
                    <div id="step-0" className="dis-fl-col flex-wrap">
                      {
                        successMessage ? (
                          <div id="step-0" className="dis-fl-col flex-wrap">
                            <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 mb-sm-6">
                              Visit Feedback
                            </h2>
                            <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5 w-perc-100 mb-5">
                              <div className=" multiFieldWrap w-perc-100 ">
                                <div className="dis-f jc-b h-perc-100 a-t">
                                  <div className="ml-0 mr-a pr-10 dis-f-col jc-b w-perc-100 pos-r" tabIndex="-1">
                                    <p>
                                      Thank you for your feedback.
                                    </p>
                                    <p className="mt-1">
                                      Do you want to share any specific reasons or a comment to the owner?
                                    </p>

                                    <div className="mt-3">
                                      {
                                        contacts.phone && (
                                          <a href={`tel:${Helpers.telephoneFormat(contacts.phone)}`} className="dis-f a-c mb-2">
                                            <BrixelIcon
                                              color="altBlue"
                                              saturationTxt={400}
                                              icon="phone"
                                            />
                                            <p className="ml-2">
                                              <span className="txtDark700">{Helpers.telephoneFormat(contacts.phone)}</span>
                                            </p>
                                          </a>
                                        )
                                      }
                                      {
                                        contacts.email && (
                                          <a href={`mailto: ${contacts.email}`} className="dis-f a-c mb-2">
                                            <BrixelIcon
                                              color="altRed"
                                              saturationTxt={400}
                                              icon="mail"
                                            />
                                            <p className="ml-2">
                                              <span className="txtDark700">{contacts.email}</span>
                                            </p>
                                          </a>
                                        )
                                      }
                                    </div>

                                    <h6>Still looking for your dream home?</h6>
                                    <p>Check your Brixel market to find other properties.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <BrixelButtonPrimary
                              onClick={() => history.push('/buy')}
                              rounded
                              theme="altGreen"
                              themeSat={300}
                              className="w-fit m-a"
                              label="Login to your market"
                            />
                          </div>
                        ) : (
                          <>
                            <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 mb-sm-6">
                              Visit Feedback
                            </h2>
                            <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5 w-perc-100 mb-5">
                              <div className=" multiFieldWrap w-perc-100 ">
                                <div className="dis-f jc-b h-perc-100 a-t">
                                  <div className="ml-0 mr-a pr-10 dis-f-col jc-b w-perc-100 pos-r" tabIndex="-1">
                                    <ReduxField
                                      component={BrixelCheckbox}
                                      form="visitFeedback"
                                      labels={{
                                        label: 'What was the main reason?',
                                      }}
                                      input={{
                                        name: 'reasons',
                                        options: [
                                          { label: 'Price', value: 'price' },
                                          { label: 'Location', value: 'location' },
                                          { label: 'Floor plan', value: 'floorPlan' },
                                          { label: 'Condition', value: 'condition' },
                                          { label: 'Better alternative', value: 'betterAlternative' },
                                          { label: 'Other', value: 'other' },
                                        ],
                                      }}
                                    />

                                    <ReduxField
                                      design={{
                                        className: 'mt-2',
                                      }}
                                      component={BrixelInputText}
                                      form="visitFeedback"
                                      labels={{
                                        label: 'Do you want to add anything (Optional)',
                                      }}
                                      input={{
                                        name: 'otherReason',
                                      }}
                                    />

                                    {
                                      checkPriceReason && (
                                        <ReduxField
                                          component={BrixelRadioButton}
                                          design={{
                                            className: 'mt-3',
                                          }}
                                          form="visitFeedback"
                                          labels={{
                                            label: 'Do you want to get noticed if the price changes?',
                                          }}
                                          input={{
                                            name: 'priceChangeAlert',
                                            options: [
                                              { label: 'Yes', value: true },
                                              { label: 'No', value: false },
                                            ],
                                          }}
                                        />
                                      )
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                            <BrixelButtonPrimary
                              onClick={() => saveData()}
                              disabled={disabledSend}
                              rounded
                              theme="altGreen"
                              themeSat={300}
                              className="w-fit m-a"
                              label="Send"
                            />
                          </>
                        )
                      }
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

VisitFeedback.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  contacts: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleInitForm: PropTypes.func.isRequired,
  handleSetActiveSingleCompany: PropTypes.func.isRequired,
  handleSendVisitFeedback: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleUpdateError: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  contacts: get(state, 'property.activeSingleProperty.contacts[0]', {}),
  formValue: get(state, 'brixelForm.visitFeedback.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  initialValues: {
    reasons: null,
    otherReason: '',
    priceChangeAlert: null,
  },
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdateError(name, value) {
    dispatch(changeSyncError('visitFeedback', name, value));
  },
  handleInitForm(value) {
    dispatch(initializeForm('visitFeedback', value));
  },
  handleSetActiveSingleCompany: bindActionCreators(setActiveSingleCompany, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSendVisitFeedback: bindActionCreators(sendVisitFeedback, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(VisitFeedback);
