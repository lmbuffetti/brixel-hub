import React, { useEffect, useState } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  BrixelTextArea,
  change,
  destroy,
  Helpers,
  initializeForm,
  ReduxField,
} from '@brixel/brixel-components';
import cloneDeep from 'lodash/cloneDeep';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import SplashScreen from '../../components/SplashScreen';
import { setSplashType, spinnerSmall } from '../../actions/CommonActions';
import { saveReviewOffer, setActiveSingleDeal } from '../../actions/DealActions';

const ReviewOffer = (props) => {
  const {
    activeSingleDeal,
    activeSingleOffer,
    activeSingleProperty,
    destroyForm,
    formValue,
    handleReviewOffer,
    handleSetActiveSingleDeal,
    handleSmallSpinner,
    isSmallLoading,
    setSplashScreen,
  } = props;
  // STATE
  const [success, setSuccess] = useState(null);

  const closeOverlay = () => {
    setSplashScreen('');
    handleSmallSpinner({ saveOffer: false });
  };

  useEffect(() => () => destroyForm(), []);

  useEffect(() => {
    if (isSmallLoading.saveOffer === 'done') {
      setSuccess(false);
    }
    if (isSmallLoading.saveOffer === 'close') {
      setSuccess(false);
    }
  }, [isSmallLoading]);

  const saveData = (action) => {
    if (action) {
      const dataForm = cloneDeep(formValue);
      dataForm.status = action;
      dataForm.id = activeSingleDeal.id;
      const newDealData = cloneDeep(activeSingleDeal);
      dataForm.action = action;
      if (action === 'saveNote') {
        dataForm.smallLoader = 'saveOffer';
        dataForm.status = success;
        newDealData.closing.stageOffer.offer.noteBySeller = dataForm.note;
        newDealData.closing.stageOffer.offer.status = success;
        handleSetActiveSingleDeal(newDealData);
        if (dataForm.id === 'sample') {
          setSuccess(false);
          return false;
        }
        handleReviewOffer(dataForm);
      } else if (action === 'accepted') dataForm.smallLoader = 'saveOffer';
      else dataForm.smallLoader = 'saveOffer';
      if (action !== 'saveNote') setSuccess(action);
    } else {
      closeOverlay();
    }
    return null;
  };

  return (
    <SplashScreen
      closeOutside={false}
      type="marketOverlay"
      className="manageOffer"
    >
      <>
        <div className={`dis-f p-3 pb-2 ${activeSingleDeal.id === 'sample' ? 'jc-b a-c' : 'jc-fe'}`}>
          {
            activeSingleDeal.id === 'sample' && (
              <div className="ml-2 brdRadiusSmall brdSmall bgPrimary200 txtPrimary400 p-small-4 fsize-200 ex-tag">
                Example only
              </div>
            )
          }
          <BrixelButtonIcon
            ghost
            theme="dark"
            icon="close-small"
            onClick={() => closeOverlay()}
          />
        </div>
        {
          get(activeSingleOffer, 'offer.status', null) === 'pending' || success ? (
            <div className="dis-fl-col jc-c pb-2 px-7">
              {
                success ? (
                  <>
                    {
                      success === 'accepted' ? (
                        <h3 className="ta-c">Accept offer 👍</h3>
                      ) : (
                        <h3 className="ta-c">Decline offer 👎</h3>
                      )
                    }

                    {/*   <h5 className=" ta-c fsize-400 fweight-400 txtDark100 mt-1">{moment(new Date()).format('DD MMM YYYY HH:mm')}</h5>

                <p className="mt-5">Your offer was transmitted to the owner. You will get feedback via e-mail.</p> */}

                    <h6 className="fsize-200 pb-1 mt-5">Asking Price</h6>
                    {
                      get(activeSingleProperty, 'price.total', 0) > 0 ? (
                        <p className="txtDark700 fweight-400">
                          <span className="mr-small-4">{get(activeSingleProperty, 'price.currency', '')}</span>
                          <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))}</span>
                        </p>
                      ) : (
                        <p className="txtDark700 fweight-400">On Request</p>
                      )
                    }

                    <h6 className="fsize-200 pb-1 pt-3">Offer Price</h6>

                    {
                      success === 'accepted' ? (
                        <p className="txtDark700 fweight-400 txtGreen400">
                          <span className="mr-small-4">
                            {get(activeSingleOffer, 'offer.currency', '')}
                          </span>
                          <span className="ff-mono fSizePx20">
                            {Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', ''))}
                          </span>
                        </p>
                      ) : (
                        <p className="txtRed400 txtDark700 fweight-400">
                          <span className="mr-small-4">{get(activeSingleOffer, 'offer.currency', '')}</span>
                          <span
                            className="ff-mono fSizePx20"
                          >{Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', ''))}
                          </span>
                        </p>
                      )
                    }

                    <ReduxField
                      component={BrixelTextArea}
                      form="Offer"
                      design={{
                        className: 'mt-3',
                      }}
                      input={{
                        name: 'note',
                        placeholder: 'Add comment or note for buyer',
                      }}
                      labels={{
                        label: 'Message',
                      }}
                    />

                    <div className="dis-f mt-3">
                      <BrixelIcon
                        icon="info"
                        theme="dark100"
                      />

                      <p className="fsize-300 txtDark200 ml-2">
                        {
                          success === 'accepted' ? (
                            <>
                              You hearby accept this offer. Legally this is non-biding but needed for the process to be continued.
                            </>
                          ) : (
                            <>
                              You hearby decline this offer. Legally this is non-biding but needed for the process to be
                              continued.
                            </>
                          )
                        }
                      </p>

                    </div>

                    <div className="dis-f jc-b a-c mt-5">
                      <BrixelButtonIcon
                        icon="arrow-left-small"
                        theme="dark"
                        onClick={() => setSuccess(null)}
                        ghost
                      />
                      <BrixelButtonPrimary
                        rounded
                        label="Send"
                        isLoading={isSmallLoading.saveOffer === true}
                        onClick={() => saveData('saveNote')}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="ta-c">Review offer</h3>
                    <div className="w-perc-100 mt-5">
                      <h6 className="fsize-200 pb-1">Asking Price</h6>
                      {
                        get(activeSingleProperty, 'price.total', 0) > 0 ? (
                          <p className="txtDark700 fweight-400">
                            <span className="mr-small-4">{get(activeSingleProperty, 'price.currency', '')}</span>
                            <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))}</span>
                          </p>
                        ) : (
                          <p className="txtDark700 fweight-400">On Request</p>
                        )
                      }

                      <h6 className="fsize-200 pb-1 pt-3">Offer Price</h6>

                      <p className="txtDark700 fweight-400 txtGreen400">
                        <span className="mr-small-4">{get(activeSingleOffer, 'offer.currency', '')}</span>
                        <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', ''))}</span>
                      </p>

                      {
                        get(activeSingleOffer, 'offer.documents[0].name', null) && (
                          <div
                            onClick={() => window.open(`${baseByData.shortPath}${get(activeSingleOffer, 'offer.documents[0].path', '')}`, '_blank')}
                            className="cur-poi"
                          >
                            <h6 className="fsize-200 pb-1 pt-3">Proof of financing from bank</h6>
                            <div className="dis-f a-c">
                              <BrixelIcon
                                className="mr-1"
                                icon="document"
                                background="blue"
                                saturation={100}
                                color="blue"
                                saturationTxt={700}
                              />
                              <p className="txtDark700 pl-small-4">{get(activeSingleOffer, 'offer.documents[0].name', '')}</p>
                            </div>
                          </div>
                        )
                      }

                      <h6 className="fsize-200 pb-1 pt-3">Message</h6>
                      <p className="txtDark700"><i>{get(activeSingleOffer, 'offer.noteByBuyer', '-') || '-'}</i></p>

                      <div className="dis-f mt-5">
                        <BrixelIcon
                          icon="info"
                          color="Light"
                          saturationTxt={700}
                        />

                        <p className="txtLight700 ml-2">
                          This is a non-binding offer. The buyer will be notified about your decision.
                        </p>

                      </div>

                    </div>

                    <div className="dis-f jc-b a-c mt-5">
                      <BrixelButtonSecondary
                        rounded
                        theme="red"
                        label="Decline 👎"
                        onClick={() => saveData('rejected')}
                        isLoading={isSmallLoading.saveOffer === true}
                      />
                      <BrixelButtonSecondary
                        ghost
                        theme="green"
                        rounded
                        label="Accept 👍"
                        onClick={() => saveData('accepted')}
                        isLoading={isSmallLoading.saveOffer === true}
                      />
                    </div>

                  </>
                )
              }
            </div>
          ) : (
            <div className="dis-fl-col jc-c pb-2 px-7">
              {
                get(activeSingleOffer, 'offer.status', null) === 'accepted' ? (
                  <h3 className="ta-c txtGreen400">Offer accepted 👍</h3>
                ) : (
                  <h3 className="ta-c txtRed400">Offer declined 👎</h3>
                )
              }

              <div className="w-perc-100 mt-5">

                <h6 className="fsize-200 pb-1 pt-3">Offer Price</h6>

                <p className={`txtDark700 fweight-400 ${get(activeSingleOffer, 'offer.status', null) === 'accepted' ? 'txtGreen400' : 'txtRed400'}`}>
                  <span className="mr-small-4">{get(activeSingleOffer, 'offer.currency', '')}</span>
                  <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.amount', ''))}</span>
                </p>

                {
                  get(activeSingleOffer, 'offer.documents[0].name', null) && (
                    <div
                      onClick={() => window.open(`${baseByData.shortPath}${get(activeSingleOffer, 'offer.documents[0].path', '')}`, '_blank')}
                      className="cur-poi"
                    >
                      <h6 className="fsize-200 pb-1 pt-3">Proof of financing from bank</h6>
                      <div className="dis-f a-c">
                        <BrixelIcon
                          className="mr-1"
                          icon="document"
                          background="blue"
                          saturation={100}
                          color="blue"
                          saturationTxt={700}
                        />
                        <p className="txtDark700 pl-small-4">{get(activeSingleOffer, 'offer.documents[0].name', '')}</p>
                      </div>
                    </div>
                  )
                }

                <h6 className="fsize-200 pb-1 pt-3">Note</h6>
                <p className="txtDark700"><i>{get(activeSingleOffer, 'offer.noteByBuyer', '-') || '-'}</i></p>

                <div className="ta-r">
                  <h6 className="fsize-200 pb-1 pt-3">Answer</h6>
                  <p className="txtDark700"><i>{get(activeSingleOffer, 'offer.noteBySeller', '-') || '-'}</i></p>
                </div>
                <div className="dis-f mt-5">
                  <BrixelIcon
                    className="mr-1"
                    icon="info"
                    theme="dark100"
                  />
                  <p className="fsize-300 txtDark200 ml-2">
                    {
                      get(activeSingleOffer, 'offer.status', null) === 'accepted' ? (
                        <>
                          You accepted this non-binding offer. To proceed with the closing continue with identification.
                        </>
                      ) : (
                        <>
                          You declined this non-binding offer. The buyer was informed about your decision.
                        </>
                      )
                    }
                  </p>
                </div>

              </div>

              <div className="dis-f jc-c a-c mt-5">
                <BrixelButtonPrimary
                  rounded
                  label="Close"
                  onClick={() => closeOverlay()}
                />
              </div>
            </div>
          )
        }
      </>
    </SplashScreen>
  );
};

ReviewOffer.propTypes = {
  activeSingleDeal: PropTypes.object.isRequired,
  activeSingleOffer: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  destroyForm: PropTypes.func.isRequired,
  handleReviewOffer: PropTypes.func.isRequired,
  handleSetActiveSingleDeal: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSmallSpinner: PropTypes.func.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleOffer: get(state, 'deal.activeSingleDeal.closing.stageOffer', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  errors: get(state, 'brixelForm.Offer.syncErrors', {}),
  formValue: get(state, 'brixelForm.Offer.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Offer', field, value));
  },
  destroyForm() {
    dispatch(destroy('Offer'));
  },
  initForm(value) {
    dispatch(initializeForm('Offer', value));
  },
  handleSetActiveSingleDeal: bindActionCreators(setActiveSingleDeal, dispatch),
  handleSmallSpinner: bindActionCreators(spinnerSmall, dispatch),
  handleReviewOffer: bindActionCreators(saveReviewOffer, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ReviewOffer);
