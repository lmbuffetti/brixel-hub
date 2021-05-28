import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelIcon,
  BrixelInputText,
  BrixelTextArea,
  BrixelUploadFile,
  change,
  Helpers,
  initializeForm,
  destroy,
  ReduxField,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { DateTime } from 'luxon';
import SplashScreen from '../../components/SplashScreen';
import { setSplashType } from '../../actions/CommonActions';
import { saveMakeOffer } from '../../actions/DealActions';
import { uploadDocument } from '../../actions/UploadActions';

const AddNewOffer = (props) => {
  const {
    activeSingleDeal,
    activeSingleCompany,
    activeSingleOffer,
    activeSingleProperty,
    changeFieldValue,
    destroyForm,
    handleSaveMakeOffer,
    handleUploadDocument,
    formValue,
    initForm,
    initialValue,
    isSmallLoading,
    loggedInUser,
    setSplashScreen,
    userLang,
  } = props;
  // STATE
  const [success, setSuccess] = useState(false);
  const [errorMessagePrice, setErrorMessagePrice] = useState(false);

  useEffect(() => () => destroyForm(), []);

  useEffect(() => {
    initForm(initialValue);
  }, [activeSingleProperty]);

  useEffect(() => {
    if (activeSingleProperty.id && activeSingleCompany.id) {
      changeFieldValue('currency', get(activeSingleProperty, 'price.currency', get(activeSingleCompany, 'country.currency', 'CHF')));
    }
  }, [activeSingleProperty, activeSingleCompany]);

  useEffect(() => {
    if (isSmallLoading === 'done') {
      setSuccess(true);
    }
  }, [isSmallLoading]);

  const closeOverlay = () => {
    setSplashScreen('');
  };

  const saveData = () => {
    if (+get(formValue, 'amount', 0) <= 0 || !get(formValue, 'amount', 0)) {
      setErrorMessagePrice('Please insert a value');
      return false;
    }
    setErrorMessagePrice(null);

    const dataForm = cloneDeep(formValue);
    dataForm.id = activeSingleDeal.id;
    dataForm.smallLoader = 'saveMakeOffer';
    if (get(formValue, 'file', null)) {
      dataForm.docs = dataForm.file;
      dataForm.docs.user = get(loggedInUser, 'id', null);
      dataForm.saveAction = 'makeOffer';
      delete dataForm.file;
      handleUploadDocument(dataForm);
    } else {
      handleSaveMakeOffer(dataForm);
    }
    return null;
  };

  return (
    <SplashScreen
      closeOutside={false}
      type="marketOverlay"
      className="manageOffer"
    >
      <div className="dis-f jc-fe p-3 pb-2">
        <BrixelButtonIcon
          ghost
          theme="dark"
          icon="close-small"
          onClick={() => closeOverlay()}
        />
      </div>
      <div className="dis-fl-col jc-c pb-2 px-7">
        {
          success ? (
            <>
              <h3 className="ta-c">Offer sent ⏳</h3>

              <h5 className="ta-c fsize-400 fweight-400 txtDark100">
                {DateTime.now({ locale: userLang }).toFormat('dd LLL yyyy HH:mm')}
              </h5>

              <p className="mt-5 txtDark700">Your offer was transmitted to the owner. You will get feedback via e-mail.</p>

              <h6 className="fsize-200 pb-1 mt-3">Asking Price</h6>
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

              <h6 className="fsize-200 pb-1 mt-3">Offer Price</h6>

              <p className="txtPrimary700 fweight-600">
                <span className="pr-small-4 fsize-400 dis-ib pt-small-2">{get(activeSingleProperty, 'price.currency', '')}</span>
                <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(formValue, 'amount', 0), get(activeSingleProperty, 'price.currency', ''))}</span>
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
              <p className="txtDark700">{get(formValue, 'note', '-') || '-'}</p>

              <div className="dis-f mt-3">
                <BrixelIcon
                  icon="info"
                  theme="dark100"
                />

                <p className="txtDark700 ml-2">
                  This is a non-binding offer. The seller will be notified and will give feedback to you as soon as possible.
                </p>

              </div>

              <div className="dis-f jc-c a-c">
                <BrixelButtonPrimary
                  className="mt-5 mx-a"
                  rounded
                  label="Close"
                  onClick={() => closeOverlay()}
                />
              </div>
            </>
          ) : (
            <>
              <h3 className="ta-c">Add offer</h3>
              <div className="w-perc-100 mt-5">
                <h6 className="fsize-200 pb-1 mt-3">Asking Price</h6>
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
              </div>
              <form className="offer-inputs">

                <ReduxField
                  component={BrixelInputText}
                  form="Offer"
                  initCheckValidation
                  design={{
                    className: 'mt-3',
                  }}
                  forceToShowError={!Helpers.isEmpty(errorMessagePrice)}
                  input={{
                    name: 'amount',
                    placeholder: 'Input amount',
                    unit: get(formValue, 'currency', ''),
                  }}
                  meta={{
                    showErrors: errorMessagePrice,
                    message: {
                      error: errorMessagePrice,
                    },
                  }}
                  labels={{
                    label: 'Your offer',
                  }}
                  inputFormat={{
                    currency: get(formValue, 'currency', ''),
                    formatType: 'price',
                  }}
                />

                <ReduxField
                  component={BrixelUploadFile}
                  form="Offer"
                  initCheckValidation
                  design={{
                    className: 'mt-3',
                  }}
                  input={{
                    acceptedFile: ['application/pdf'],
                    name: 'file',
                  }}
                  labels={{
                    label: 'Proof of financing from bank',
                  }}
                />

                <ReduxField
                  component={BrixelTextArea}
                  form="Offer"
                  initCheckValidation
                  design={{
                    className: 'mt-3',
                  }}
                  input={{
                    name: 'note',
                    placeholder: 'Add comment or note for seller',
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

                  <p className="txtDark700 ml-2">
                    This is a non-binding offer. The seller will be notified and will give feedback to you as soon as possible.
                  </p>

                </div>

                <div className="dis-f jc-c a-c">
                  <BrixelButtonPrimary
                    className="mt-5 mx-a"
                    rounded
                    label="Send offer"
                    onClick={() => saveData()}
                    isLoading={isSmallLoading === 'saveMakeOffer'}
                  />
                </div>

              </form>
            </>
          )
        }
      </div>
    </SplashScreen>
  );
};

AddNewOffer.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleDeal: PropTypes.object.isRequired,
  activeSingleOffer: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  destroyForm: PropTypes.func.isRequired,
  formValue: PropTypes.object.isRequired,
  handleSaveMakeOffer: PropTypes.func.isRequired,
  handleUploadDocument: PropTypes.func.isRequired,
  initForm: PropTypes.func,
  initialValue: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
  userLang: PropTypes.string.isRequired,
};

AddNewOffer.defaultProps = {
  initForm: () => '',
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleDeal: get(state, 'deal.activeSingleDeal', {}),
  activeSingleOffer: get(state, 'deal.activeSingleDeal.closing.stageOffer', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  errors: get(state, 'brixelForm.Offer.syncErrors', {}),
  formValue: get(state, 'brixelForm.Offer.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  initialValue: {
    currency: 'CHF',
    documents: [],
    amount: '',
    note: '',
  },
  userLang: get(state, 'user.loggedInUser.language', 'en'),
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
  handleSaveMakeOffer: bindActionCreators(saveMakeOffer, dispatch),
  handleUploadDocument: bindActionCreators(uploadDocument, dispatch),
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AddNewOffer);
