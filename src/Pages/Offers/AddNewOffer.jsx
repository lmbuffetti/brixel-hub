import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelIcon,
  BrixelInputText,
  BrixelTextArea,
  BrixelUploadFile, change,
  Helpers, initializeForm,
  ReduxField,
  Validation,
} from '@brixel/brixel-components';
import SplashScreen from '../../components/SplashScreen';
import { setSplashType } from '../../actions/CommonActions';

const AddNewOffer = (props) => {
  const {
    activeSingleProperty,
    changeFieldValue,
    errors,
    formValue,
    initalValue,
    setSplashScreen,
  } = props;
  // STATE
  const [success, setSuccess] = useState(false);
  const [errorMessagePrice, setErrorMessagePrice] = useState(false);

  const closeOverlay = () => {
    setSplashScreen('');
  };

  const saveData = () => {
    if (get(formValue, 'offerPrice', 0) === 0) {
      setErrorMessagePrice('Please insert a value');
      return false;
    }

    return setSuccess(true);
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

              <h5 className="ta-c fsize-400 fweight-400 txtDark100">{moment(new Date()).format('DD MMM YYYY HH:mm')}</h5>

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
                <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(formValue, 'offerPrice', 0), get(activeSingleProperty, 'price.currency', ''))}</span>
              </p>

              {
                get(formValue, 'file.name', null) && (
                  <>
                    <h6 className="fsize-200 pb-1 mt-3">Proof of financing from bank</h6>
                    <div className="dis-f a-c">
                      <BrixelIcon
                        icon="document"
                        background="blue"
                        saturation={100}
                        color="blue"
                        saturationTxt={700}
                      />
                      <p className="txtDark700 pl-small-4">{get(formValue, 'file.name', '')}</p>
                    </div>
                  </>
                )
              }

              <h6 className="fsize-200 pb-1 pt-3">Message</h6>
              <p className="txtDark700">{get(formValue, 'message', '')}</p>

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
                  forceToShowError={errorMessagePrice}
                  input={{
                    name: 'offerPrice',
                    placeholder: 'Input amount',
                    unit: get(activeSingleProperty, 'price.currency', ''),
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
                    currency: get(activeSingleProperty, 'price.currency', ''),
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
                    name: 'message',
                    placeholder: 'Add comment or note for seller',
                  }}
                  labels={{
                    label: 'Message',
                  }}
                />

                <div className="dis-f jc-c a-c">
                  <BrixelButtonPrimary
                    className="mt-5 mx-a"
                    rounded
                    label="Send offer"
                    onClick={() => saveData()}
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
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func,
  errors: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  initForm: PropTypes.func,
  initalValue: PropTypes.object.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  errors: get(state, 'brixelForm.Offer.syncErrors', {}),
  formValue: get(state, 'brixelForm.Offer.values', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Offer', field, value));
  },
  initForm(value) {
    dispatch(initializeForm('Offer', value));
  },
  setSplashScreen: bindActionCreators(setSplashType, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AddNewOffer);
