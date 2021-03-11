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
  BrixelButtonSecondary,
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

const ReviewOffer = (props) => {
  const {
    activeSingleOffer,
    activeSingleProperty,
    errors,
    formValue,
    initalValue,
    setSplashScreen,
  } = props;
  // STATE
  const [success, setSuccess] = useState(null);

  const closeOverlay = () => {
    setSplashScreen(null);
  };

  const saveData = (action) => {
    if (action) {
      setSuccess(action);
    } else {
      console.log(formValue);
      closeOverlay();
    }
  };

  return (
    <SplashScreen
      closeOutside={false}
      type="marketOverlay"
      className="manageOffer"
    >
      <div className="dis-f jc-fe mb-2">
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
              {
                success === 'accept' ? (
                  <h3 className="ta-c">Accept offer 👍</h3>
                ) : (
                  <h3 className="ta-c">Decline offer 👎</h3>
                )
              }

              <h5 className=" ta-c fsize-400 fweight-400 txtDark100 mt-1">{moment(new Date()).format('DD MMM YYYY HH:mm')}</h5>

              <p className="mt-5">Your offer was transmitted to the owner. You will get feedback via e-mail.</p>

              <h6 className="fsize-100 txtDark500 pb-small-4 mt-3">Asking Price</h6>
              {
                get(activeSingleProperty, 'price.total', 0) > 0 ? (
                  <p>
                    <span className="mr-small-4">{get(activeSingleProperty, 'price.currency', '')}</span>
                    <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))}</span>
                  </p>
                ) : (
                  <p>On Request</p>
                )
              }

              <h6 className="fsize-100 txtDark500 pb-small-4 mt-3">Offer Price</h6>

              {
                success === 'accept' ? (
                  <p className="txtGreen400">
                    <span className="mr-small-4 fweight-700">{get(activeSingleProperty, 'price.currency', '')}</span>
                    <span
                      className="ff-mono fweight-700 fSizePx20"
                    >{Helpers.formatNumberValue(get(activeSingleOffer, 'offerPrice', 0), get(activeSingleProperty, 'price.currency', ''))}
                    </span>
                  </p>
                ) : (
                  <p className="txtRed400">
                    <span className="mr-small-4 fweight-700">{get(activeSingleProperty, 'price.currency', '')}</span>
                    <span
                      className="ff-mono fweight-700 fSizePx20"
                    >{Helpers.formatNumberValue(get(activeSingleOffer, 'offerPrice', 0), get(activeSingleProperty, 'price.currency', ''))}
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
                  name: 'message',
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

                {
                  success === 'accept' ? (
                    <p className="pl-1 txtDark100">
                      You hearby accept this offer. Legally this is non-biding but needed for the process to be continued.
                    </p>
                  ) : (
                    <p className="pl-1 txtDark100">
                      You hearby decline this offer. Legally this is non-biding but needed for the process to be
                      continued.
                    </p>
                  )
                }

              </div>

              <div className="dis-f jc-b a-c mt-5">
                <BrixelButtonIcon
                  icon="arrow-left-small"
                  theme="dark700"
                  onClick={() => setSuccess(null)}
                  ghost
                />
                <BrixelButtonPrimary
                  rounded
                  label="Save"
                  onClick={() => saveData()}
                />
              </div>
            </>
          ) : (
            <>
              <h3>Review offer</h3>
              <div className="w-perc-100 mt-5">
                <h6 className="fsize-100 txtDark500 pb-small-4">Asking Price</h6>
                {
                  get(activeSingleProperty, 'price.total', 0) > 0 ? (
                    <p>
                      <span className="mr-small-4">{get(activeSingleProperty, 'price.currency', '')}</span>
                      <span className="ff-mono fSizePx20">{Helpers.formatNumberValue(get(activeSingleProperty, 'price.total', 0), get(activeSingleProperty, 'price.currency', ''))}</span>
                    </p>
                  ) : (
                    <p>On Request</p>
                  )
                }

                <h6 className="fsize-100 txtDark500 pb-small-4 mt-3">Offer Price</h6>

                <p>
                  <span className="mr-small-4 fweight-700 txtPrimary700">{get(activeSingleProperty, 'price.currency', '')}</span>
                  <span className="ff-mono fweight-700 fSizePx20 txtPrimary700">{Helpers.formatNumberValue(get(activeSingleOffer, 'offerPrice', 0), get(activeSingleProperty, 'price.currency', ''))}</span>
                </p>

                {
                  get(activeSingleOffer, 'file.name', null) && (
                    <>
                      <h6 className="fsize-100 txtDark500 pb-small-4 mt-3">Proof of financing from bank</h6>
                      <div className="dis-f a-c">
                        <BrixelIcon
                          className="mr-1"
                          icon="document"
                          background="blue"
                          saturation={100}
                          color="blue"
                          saturationTxt={700}
                        />
                        <p>{get(activeSingleOffer, 'file.name', '')}</p>
                      </div>
                    </>
                  )
                }

                <h6 className="fsize-100 txtDark500 pb-small-4 mt-3">Message</h6>
                <p><i>{get(activeSingleOffer, 'message', '')}</i></p>

                <div className="dis-f mt-3">
                  <BrixelIcon
                    icon="info"
                    theme="dark100"
                  />

                  <p className="pl-1 txtDark100">
                    This is a non-binding offer. The buyer will be notified about your decision.
                  </p>

                </div>

              </div>

              <div className="dis-f jc-b a-c mt-5">
                <BrixelButtonSecondary
                  rounded
                  theme="red"
                  label="Decline 👎"
                  onClick={() => saveData('decline')}
                />
                <BrixelButtonSecondary
                  ghost
                  theme="green"
                  rounded
                  label="Accept 👍"
                  onClick={() => saveData('accept')}
                />
              </div>

            </>
          )
        }
      </div>
    </SplashScreen>
  );
};

ReviewOffer.propTypes = {
  activeSingleOffer: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func,
  errors: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  initForm: PropTypes.func,
  initalValue: PropTypes.object.isRequired,
  setSplashScreen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleOffer: get(state, 'deal.activeSingleOffer', {}),
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
)(ReviewOffer);
