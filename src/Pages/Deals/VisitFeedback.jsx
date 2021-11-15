/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
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
  initializeForm,
} from '@brixel/brixel-components';
import queryString from 'query-string';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { spinnerOff } from '../../actions/CommonActions';
import { sendVisitFeedback } from '../../actions/DealActions';
import { getActiveSingleProperty } from '../../actions/PropertyActions';

const VisitFeedback = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    formValue,
    handleUpdateError,
    handleSendVisitFeedback,
    handleGetActiveSingleProperty,
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

  const checkPriceReason = get(formValue, 'reasons', null) && get(formValue, 'reasons', []).findIndex((val) => val === 'price') > -1;

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
      handleInitForm(initialValues);
      saveData();
    }
  }, [activeSingleProperty]);

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
      id: pageID,
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
                  (status || successMessage) ? (
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
                              <p>
                                You can contact us if you have any specific questions to the owner.
                              </p>

                              <h6>Do you want to make an offer?</h6>
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
                                    <p>
                                      Do you want to share any specific reasons or a comment to the owner?
                                    </p>

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
  formValue: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleInitForm: PropTypes.func.isRequired,
  handleSendVisitFeedback: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleUpdateError: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
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
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSendVisitFeedback: bindActionCreators(sendVisitFeedback, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(VisitFeedback);
