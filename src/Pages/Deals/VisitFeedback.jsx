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
    formValue,
    handleUpdateError,
    handleSendVisitFeedback,
    handleGetActiveSingleProperty,
    history,
    handleSpinnerOff,
    match,
  } = props;
  // GET URL PARAMS
  const dealID = get(match, 'params.dealID', null);
  const pageID = get(match, 'params.pageID', null);
  const [disabledSend, setDisabledSend] = useState(true);
  const urlParams = queryString.parse(get(history, 'location.search', ''));
  const status = urlParams.status === 'true';

  const onUpdateError = () => {
    const validateField = ['visitFeedback.reasons'];
    const checkReason = get(formValue, 'visitFeedback.reasons', []).findIndex((val) => val === 'price');
    if (checkReason > -1) validateField.push('visitFeedback.priceChangeAlert');
    let isValid = true;
    validateField.forEach((key) => {
      const checkError = Validation.required(get(formValue, key, ''));
      if ((checkError !== true && checkError !== null) && isValid) isValid = false;
      console.log(checkError, isValid);
      handleUpdateError(key, checkError);
    });
    setDisabledSend(!isValid);
  };

  useEffect(() => {
    onUpdateError();
  }, [formValue]);

  useEffect(() => {
    const data = {
      fullVersion: false,
      smallLoader: 'property',
      id: pageID,
    };
    handleGetActiveSingleProperty(data);
    onUpdateError();
  }, []);

  const saveData = () => {
    const data = {
      id: dealID,
      smallLoader: 'sendData',
      ...formValue,
      visitFeedback: {
        ...formValue.visitFeedback,
        isInterested: status,
      },
    };
    handleSendVisitFeedback(data);
  };

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
                    <div id="step-0" className="dis-fl-col flex-wrap undefined ">
                      <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 mb-sm-6">
                        Imposta il prezzo
                      </h2>
                      <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5 w-perc-100">
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
                    </div>
                  ) : (
                    <div id="step-0" className="dis-fl-col flex-wrap undefined ">
                      <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 mb-sm-6">
                        Imposta il prezzo
                      </h2>
                      <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5 w-perc-100">
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
                                  name: 'visitFeedback.reasons',
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
                                  name: 'visitFeedback.otherReason',
                                }}
                              />

                              <ReduxField
                                component={BrixelRadioButton}
                                form="visitFeedback"
                                labels={{
                                  label: 'Do you want to get noticed if the price changes?',
                                }}
                                input={{
                                  name: 'visitFeedback.priceChangeAlert',
                                  options: [
                                    { label: 'Yes', value: true },
                                    { label: 'No', value: false },
                                  ],
                                }}
                              />
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
  formValue: PropTypes.object.isRequired,
  handleSendVisitFeedback: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  handleUpdateError: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.visitFeedback.values', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdateError(name, value) {
    dispatch(changeSyncError('visitFeedback', name, value));
  },
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSendVisitFeedback: bindActionCreators(sendVisitFeedback, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(VisitFeedback);
