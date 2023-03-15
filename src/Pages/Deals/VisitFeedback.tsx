import React, {useEffect, useRef, useState} from 'react';
import {BrixelButtonPrimary, BrixelIcon, Helpers} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import {
  BrixelCheckbox,
  BrixelRadioButton,
  BrixelTextArea,
  initializeForm,
  ReduxField,
  Validation,
} from '@brixel/brixel-components/dist/form';
import queryString from 'query-string';
import {bindActionCreators, compose} from 'redux';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {setLanguage, spinnerOff} from '../../actions/CommonActions';
import {sendVisitFeedback} from '../../actions/DealActions';
import {getActiveSingleProperty} from '../../actions/PropertyActions';
import {setActiveSingleCompany} from '../../actions/CompanyActions';
import {setCookie} from '../../utils/helpers';
import type {VisitFeedbackType} from '../../@types/Pages/Deals/VisitFeedback';

const VisitFeedback = (props: VisitFeedbackType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    activeSingleProperty,
    contacts,
    errorValue,
    formValue,
    handleGetActiveSingleProperty,
    handleInitForm,
    handleSendVisitFeedback,
    handleSetActiveSingleCompany,
    handleSetLanguage,
    initialValues,
    isSmallLoading,
    lng,
  } = props;
  // GET URL PARAMS
  const dealID = get(match, 'dealID', null);
  const pageID = get(match, 'pageID', null);
  const [disabledSend, setDisabledSend] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);
  const urlParams = queryString.parse(get(history, 'location.search', ''));
  const status = urlParams.status === 'true';
  const { lang } = urlParams;

  const checkPriceReason = get(formValue, 'reasons', null) && get(formValue, 'reasons', []).findIndex((val) => val === 'price') > -1;

  useEffect(() => {
    if (lang) {
      const defLang = (lang || 'en').toString();
      handleSetLanguage(defLang);
      setCookie('brixelLang', defLang);
    }
  }, [lang]);

  const onUpdateError = () => {
    let isValid = true;
    Object.keys(errorValue).forEach((key) => {
      const err = get(errorValue, key, null);
      if (err !== true && err !== false && isValid) isValid = false;
    });
    setDisabledSend(!isValid);
  };

  const saveData = () => {
    const data = {
      ...formValue,
      id: dealID,
      smallLoader: 'sendVisit',
      sendSlack: !formValue.reasons,
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
      if (typeof activeSingleProperty.company === 'string') handleSetActiveSingleCompany(activeSingleProperty.company);
    }
  }, [activeSingleProperty]);

  useEffect(() => {
    onUpdateError()
  }, [formValue]);

  useEffect(() => {
    if (!disabledSend && isSmallLoading.sendVisitSent === true) {
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
                      <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
                        {translateTo('We\'re glad you are still interested.', (lng).toString())}
                      </h2>
                      <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50 p-2 p-sm-5 w-perc-100 mb-5">
                        <div className=" multiFieldWrap w-perc-100 ">
                          <div className="dis-f jc-b h-perc-100 a-t">
                            <div className="ml-0 mr-a dis-f-col jc-b w-perc-100 pos-r" tabIndex={-1}>

                              <div>
                                <h6>{translateTo('Do you want to make an offer?', (lng))}</h6>
                                <p>{translateTo('Make your offer online and have a proof of financing ready.', lng)}</p>
                                <BrixelButtonPrimary
                                  onClick={() => history.push(`/packageFlow/${activeSingleProperty.id}/makeOffer`)}
                                  rounded
                                  className="w-fit mx-a mt-3"
                                  label="Make an offer"
                                />
                              </div>

                              <p className="mt-5">
                                {translateTo('You can contact us if you have any specific questions to the owner.',lng)}
                              </p>

                              <div className="my-3">
                                {
                                  contacts.phone && (
                                    <a href={`tel:${Helpers.telephoneFormat(contacts.phone)}`} className="dis-f a-c mb-2">
                                      <BrixelIcon
                                        color="blue"
                                        saturationTxt={700}
                                        icon="phone"
                                      />
                                      <p className="ml-2">
                                        <span className="txtText900">{Helpers.telephoneFormat(contacts.phone)}</span>
                                      </p>
                                    </a>
                                  )
                                }
                                {
                                  contacts.email && (
                                    <a href={`mailto: ${contacts.email}`} className="dis-f a-c mb-2">
                                      <BrixelIcon
                                        color="red"
                                        saturationTxt={400}
                                        icon="mail"
                                      />
                                      <p className="ml-2">
                                        <span className="txtText900">{contacts.email}</span>
                                      </p>
                                    </a>
                                  )
                                }
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div id="step-0" className="dis-fl-col flex-wrap">
                      {
                        successMessage ? (
                          <div id="step-0" className="dis-fl-col flex-wrap">
                            <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
                              {translateTo('Thank you. Your feedback has been sent.', lng)}
                            </h2>
                            <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50 p-2 p-sm-5 w-perc-100 mb-5">
                              <div className=" multiFieldWrap w-perc-100 ">
                                <div className="dis-f jc-b h-perc-100 a-t">
                                  <div className="ml-0 mr-a pr-10 dis-f-col jc-b w-perc-100 pos-r" tabIndex={-1}>
                                    <p>
                                      {translateTo('Thank you for your feedback.', lng)}
                                    </p>
                                    <p className="mt-1">
                                      {translateTo('Do you want to share any specific reasons or a comment to the owner?', lng)}
                                    </p>

                                    <div className="mt-3">
                                      {
                                        contacts.phone && (
                                          <a href={`tel:${Helpers.telephoneFormat(contacts.phone)}`} className="dis-f a-c mb-2">
                                            <BrixelIcon
                                              color="blue"
                                              saturationTxt={700}
                                              icon="phone"
                                            />
                                            <p className="ml-2">
                                              <span className="txtText900">{Helpers.telephoneFormat(contacts.phone)}</span>
                                            </p>
                                          </a>
                                        )
                                      }
                                      {
                                        contacts.email && (
                                          <a href={`mailto: ${contacts.email}`} className="dis-f a-c mb-2">
                                            <BrixelIcon
                                              color="red"
                                              saturationTxt={400}
                                              icon="mail"
                                            />
                                            <p className="ml-2">
                                              <span className="txtText900">{contacts.email}</span>
                                            </p>
                                          </a>
                                        )
                                      }
                                    </div>

                                    <h6>{translateTo('Still looking for your dream home?', lng)}</h6>
                                    <p>{translateTo('Check your Brixel market to find other properties.', lng)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <BrixelButtonPrimary
                              onClick={() => history.push('/buy')}
                              rounded
                              className="w-fit m-a"
                              label="Login to your market"
                            />
                          </div>
                        ) : (
                          <>
                            <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
                              {translateTo('Thank you for your feedback.', lng)}
                            </h2>
                            <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50 p-2 p-sm-5 w-perc-100 mb-5">
                              <div className=" multiFieldWrap w-perc-100 ">
                                <div className="dis-f jc-b h-perc-100 a-t">
                                  <div className="ml-0 mr-a dis-f-col jc-b w-perc-100 pos-r" tabIndex={-1}>
                                    <ReduxField
                                      component={BrixelCheckbox}
                                      form="visitFeedback"
                                      labels={{
                                        label: translateTo('What is the main reason for your refusal?', lng),
                                      }}
                                      input={{
                                        name: 'reasons',
                                        options: [
                                          { label: translateTo('Price', lng), value: 'price' },
                                          { label: translateTo('Location', lng), value: 'location' },
                                          { label: translateTo('Floor plan', lng), value: 'floorPlan' },
                                          { label: translateTo('Condition', lng), value: 'condition' },
                                          { label: translateTo('Better alternative', lng), value: 'betterAlternative' },
                                          { label: translateTo('Other', lng), value: 'other' },
                                        ],
                                        validate: [Validation.required],
                                      }}
                                    />

                                    <ReduxField
                                      design={{
                                        className: 'mt-2',
                                      }}
                                      component={BrixelTextArea}
                                      form="visitFeedback"
                                      labels={{
                                        label: translateTo('Do you want to add anything (Optional)', lng),
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
                                            label: translateTo('Do you want to get noticed if the price changes?', lng),
                                          }}
                                          input={{
                                            name: 'priceChangeAlert',
                                            options: [
                                              { label: translateTo('Yes', lng), value: true },
                                              { label: translateTo('No', lng), value: false },
                                            ],
                                            validate: [Validation.required],
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
                              isLoading={isSmallLoading.sendVisit}
                              rounded
                              className="w-fit m-a"
                              label={translateTo('Send', lng)}
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

const mapStateToProps = (state) => {
  const initialValues = {
    reasons: [],
    otherReason: '',
    priceChangeAlert: null,
  };
  return ({
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    contacts: get(state, 'property.activeSingleProperty.contacts[0]', {}),
    formValue: get(state, 'brixelForm.visitFeedback.values', {}),
    errorValue: get(state, 'brixelForm.visitFeedback.syncErrors', {}),
    isSmallLoading: get(state, 'common.isSmallLoading', {}),
    lng: get(state, 'common.language', 'en'),
    initialValues,
  });
};

const mapDispatchToProps = (dispatch) => ({
  handleInitForm(value) {
    dispatch(initializeForm('visitFeedback', value));
  },
  handleSetActiveSingleCompany: bindActionCreators(setActiveSingleCompany, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSendVisitFeedback: bindActionCreators(sendVisitFeedback, dispatch),
  handleSetLanguage: bindActionCreators(setLanguage, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(VisitFeedback);
