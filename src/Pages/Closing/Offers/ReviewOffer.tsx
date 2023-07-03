import React, {useEffect, useState} from 'react';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelIcon,
  Helpers,
} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import {BrixelTextArea, change, destroy, initializeForm, ReduxField} from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import {setSplashType, spinnerSmall} from '../../../actions/CommonActions';
import {saveReviewOffer, setActiveSingleDeal} from '../../../actions/DealActions';
import type {ReviewOfferType} from '../../../@types/Pages/Closing/Offers/ReviewOffer';
import type { DocumentType } from '@brixel-io/brixel-components/dist/@types/Model';

const ReviewOffer = (props: ReviewOfferType) => {
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
    lang,
    setSplashScreen,
  } = props;
  // STATE
  const [success, setSuccess] = useState<null | boolean | string>(null);

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
        newDealData.closing.stageOffer.offer.status = (success || '').toString();
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

  const openDocument = (e, id) => {
    if (e) e.preventDefault();
    if (activeSingleOffer.offer.documents) {
      const currentDoc: DocumentType = activeSingleOffer.offer.documents.find((doc: DocumentType) => doc.id === id) || {};
      if (currentDoc) window.open(currentDoc.loadUrl, '_blank');
    }
  };

  return (
    <>
      {
        activeSingleDeal.id === 'sample' && (
          <div className={`dis-f p-3 pb-2 ${activeSingleDeal.id === 'sample' ? 'jc-b a-c' : 'jc-fe'}`}>
            <div className="ml-2 brdRadiusSmall brdSmall bgPrimary100 txtPrimary400 p-small-4 fsize-200 ex-tag">
              {translateTo('Example only', lang)}
            </div>
          </div>
        )
      }
      {
        get(activeSingleOffer, 'offer.status', null) === 'pending' || success ? (
          <div className="dis-fl-col jc-c pb-2 px-7">
            {
              success ? (
                <>
                  {
                    success === 'accepted' ? (
                      <h3 className="ta-c">{translateTo('Accept offer 👍', lang)}</h3>
                    ) : (
                      <h3 className="ta-c">{translateTo('Decline offer 👎', lang)}</h3>
                    )
                  }

                  <h6 className="fsize-200 pb-1 mt-5">{translateTo('Asking Price', lang)}</h6>
                  {
                    get(activeSingleProperty, 'price.total', 0) > 0 ? (
                      <p className="txtText900 fweight-400">
                        <span className="mr-small-4">{get(activeSingleProperty, 'price.currency', '')}</span>
                        <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))}</span>
                      </p>
                    ) : (
                      <p className="txtText900 fweight-400">{translateTo('On Request', lang)}</p>
                    )
                  }

                  <h6 className="fsize-200 pb-1 pt-3">{translateTo('Offer Price', lang)}</h6>

                  {
                    success === 'accepted' ? (
                      <p className="txtText900 fweight-400 txtGreen400">
                        <span className="mr-small-4">
                          {get(activeSingleOffer, 'offer.currency', '')}
                        </span>
                        <span className="ff-mono fSizePx20">
                          {Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', ''))}
                        </span>
                      </p>
                    ) : (
                      <p className="txtRed400 txtText900 fweight-400">
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
                      placeholder: translateTo('Add comment or note for buyer', lang),
                    }}
                    labels={{
                      label: translateTo('Message', lang),
                    }}
                  />

                  <div className="dis-f mt-3">
                    <BrixelIcon
                      icon="info"
                    />

                    <p className="fsize-300 txtText600 ml-2">
                      {
                        success === 'accepted' ? (
                          <>
                            {translateTo('You hearby accept this offer. Legally this is non-biding but needed for the process to be continued.', lang)}
                          </>
                        ) : (
                          <>
                            {translateTo('You hearby decline this offer. Legally this is non-biding but needed for the process to be continued.', lang)}
                          </>
                        )
                      }
                    </p>

                  </div>

                  <div className="dis-f jc-b a-c mt-5">
                    <BrixelButtonIcon
                      icon="arrow-left-small"
                      theme="text"
                      onClick={() => setSuccess(null)}
                      bgTransparent
                    />
                    <BrixelButtonPrimary
                      rounded
                      label={translateTo('Send', lang)}
                      isLoading={isSmallLoading.saveOffer === true}
                      onClick={() => saveData('saveNote')}
                    />
                  </div>
                </>
              ) : (
                <>
                  <h3 className="ta-c">{translateTo('Review offer', lang)}</h3>
                  <div className="w-perc-100 mt-5">
                    <h6 className="fsize-200 pb-1">{translateTo('Asking Price', lang)}</h6>
                    {
                      get(activeSingleProperty, 'price.total', 0) > 0 ? (
                        <p className="txtText900 fweight-400">
                          <span className="mr-small-4">{get(activeSingleProperty, 'price.currency', '')}</span>
                          <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))}</span>
                        </p>
                      ) : (
                        <p className="txtText900 fweight-400">{translateTo('On Request', lang)}</p>
                      )
                    }

                    <h6 className="fsize-200 pb-1 pt-3">{translateTo('Offer Price', lang)}</h6>

                    <p className="txtText900 fweight-400 txtGreen400">
                      <span className="mr-small-4">{get(activeSingleOffer, 'offer.currency', '')}</span>
                      <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', ''))}</span>
                    </p>

                    {
                      get(activeSingleOffer, 'offer.documents[0].name', null) && (
                        <div
                          onClick={(e) => openDocument(e, get(activeSingleOffer, 'offer.documents[0].id', ''))}
                          className="cur-poi"
                        >
                          <h6 className="fsize-200 pb-1 pt-3">{translateTo('Proof of financing from bank', lang)}</h6>
                          <div className="dis-f a-c">
                            <BrixelIcon
                              className="mr-1"
                              icon="document"
                              background="blue"
                              saturation={100}
                              color="blue"
                              saturationTxt={700}
                            />
                            <p className="txtText900 pl-small-4">{get(activeSingleOffer, 'offer.documents[0].name', '')}</p>
                          </div>
                        </div>
                      )
                    }

                    <h6 className="fsize-200 pb-1 pt-3">{translateTo('Message', lang)}</h6>
                    <p className="txtText900"><i>{get(activeSingleOffer, 'offer.noteByBuyer', '-') || '-'}</i></p>

                    <div className="dis-f mt-5">
                      <BrixelIcon
                        icon="info"
                        color="text"
                        saturationTxt={300}
                      />

                      <p className="txtText500 ml-2">
                        {translateTo('This is a non-binding offer. The buyer will be notified about your decision.', lang)}
                      </p>

                    </div>

                  </div>

                  <div className="dis-f jc-b a-c mt-5">
                    <BrixelButtonSecondary
                      rounded
                      theme="red"
                      label={translateTo('Decline 👎', lang)}
                      onClick={() => saveData('rejected')}
                      isLoading={isSmallLoading.saveOffer === true}
                    />
                    <BrixelButtonSecondary
                      bgTransparent
                      theme="green"
                      rounded
                      label={translateTo('Accept 👍', lang)}
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
                <h3 className="ta-c txtGreen400">{translateTo('Offer accepted 👍', lang)}</h3>
              ) : (
                <h3 className="ta-c txtRed400">{translateTo('Offer declined 👎', lang)}</h3>
              )
            }

            <div className="w-perc-100 mt-5">

              <h6 className="fsize-200 pb-1 pt-3">Offer Price</h6>

              <p className={`txtText900 fweight-400 ${get(activeSingleOffer, 'offer.status', null) === 'accepted' ? 'txtGreen400' : 'txtRed400'}`}>
                <span className="mr-small-4">{get(activeSingleOffer, 'offer.currency', '')}</span>
                <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(activeSingleOffer, 'offer.amount', 0), get(activeSingleOffer, 'offer.currency', ''))}</span>
              </p>

              {
                get(activeSingleOffer, 'offer.documents[0].name', null) && (
                  <div
                    onClick={() => window.open(`${baseByData?.shortPath}${get(activeSingleOffer, 'offer.documents[0].path', '')}`, '_blank')}
                    className="cur-poi"
                  >
                    <h6 className="fsize-200 pb-1 pt-3">{translateTo('Proof of financing from bank', lang)}</h6>
                    <div className="dis-f a-c">
                      <BrixelIcon
                        className="mr-1"
                        icon="document"
                        background="blue"
                        saturation={100}
                        color="blue"
                        saturationTxt={700}
                      />
                      <p className="txtText900 pl-small-4">{get(activeSingleOffer, 'offer.documents[0].name', '')}</p>
                    </div>
                  </div>
                )
              }

              <h6 className="fsize-200 pb-1 pt-3">Note</h6>
              <p className="txtText900"><i>{get(activeSingleOffer, 'offer.noteByBuyer', '-') || '-'}</i></p>

              <div className="ta-r">
                <h6 className="fsize-200 pb-1 pt-3">Answer</h6>
                <p className="txtText900"><i>{get(activeSingleOffer, 'offer.noteBySeller', '-') || '-'}</i></p>
              </div>
              <div className="dis-f mt-5">
                <BrixelIcon
                  className="mr-1"
                  icon="info"
                />
                <p className="fsize-300 txtText600 ml-2">
                  {
                    get(activeSingleOffer, 'offer.status', null) === 'accepted' ? (
                      <>
                        {translateTo('You accepted this non-binding offer. To proceed with the closing continue with identification.', lang)}
                      </>
                    ) : (
                      <>
                        {translateTo('You declined this non-binding offer. The buyer was informed about your decision.', lang)}
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
  );
};

const mapStateToProps = (state) => ({
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleOffer: get(state, 'deal.activeSingleDeal.closing.stageOffer', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  errors: get(state, 'brixelForm.Offer.syncErrors', {}),
  formValue: get(state, 'brixelForm.Offer.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
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
