/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { get, isNaN } from 'lodash';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonText,
  BrixelCheckbox,
  BrixelIcon,
  MultiFileldsReduxForm,
} from '@brixel/brixel-components';
import { DateTime } from 'luxon';
import EditBuyerData from './EditBuyerData';
import { IdentificationQuestions } from '../../../resources/Identification';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';

const IdentificationFlow = (props) => {
  /* const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams(); */
  // PROPS
  const {
    cardInput,
    dealID,
    formValue,
    isSmallLoading,
    onBack,
    onClick,
  } = props;
  // STATE
  const [editProfile, setEditProfile] = useState(-1);
  const [stepResume, setStepResume] = useState('resume');
  const [stepForm, setStepForm] = useState(0);
  const [agreeToProceed, setAgreeToProceed] = useState([]);

  const onClickEdit = (id, formStep = 0) => {
    setStepResume('editProfile');
    setStepForm(formStep);
    setEditProfile(id);
  };

  const getBuyerData = IdentificationQuestions(true).find((quest) => quest.history === 'buyerData');

  return (
    <div>
      <>
        {
          stepResume === 'editProfile' && (
            <>
              <EditBuyerData
                dealID={dealID}
                forceStep={stepForm}
                onCloseEdit={() => setStepResume('resume')}
                profileId={editProfile}
              />
              <div
                className="footerAction flowFooter"
              >
                <div className="pos-r mt-3">
                  <div className="w-perc-100 max-w-fix-600 a-c dis-fl-row m-a flex-wrap jc-c mb-3">
                    <BrixelButtonIcon
                      className="backBtn ml-0"
                      icon="arrow-left-small"
                      onClick={stepForm === 1 ? () => setStepForm(0) : () => setStepResume('resume')}
                      theme="light"
                      secondary
                    />
                    <BrixelButtonPrimary
                      rounded
                      onClick={stepForm === 0 ? () => setStepForm(1) : () => setStepResume('resume')}
                      rightIcon="arrow-right-small"
                      className="ml-a mr-a noWrap"
                      label="Next"
                    />
                  </div>
                </div>
              </div>
            </>
          )
        }
        {
          stepResume === 'resume' && (
            <>
              <h2 className="fweight-600 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
                Who is the buyer of the property?
              </h2>
              <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite">
                <div className="p-5">
                  <h6 className="mb-1">
                    Please fill in the full name as it is stated in your ID. Add all people who are legally buying the property, e.g. your spouse
                    or an investment partner.
                  </h6>
                  {
                    get(formValue, 'persons', []).map((buyer, i) => (
                      <div
                        className="mt-2 bgBlue100 brdRadius p-2 dis-f a-c jc-b"
                        key={i.toString()}
                      >
                        <div className="dis-f a-c">
                          <BrixelIcon
                            className="mr-1"
                            rounded
                            background="white"
                            saturation={0}
                            color="green"
                            icon="account"
                          />
                          <span className="txtGreen400">{buyer.fullName}</span>
                        </div>
                        <div className="dis-f a-c">
                          {
                            get(buyer, 'document.id', null) ? (
                              <BrixelButtonSecondary
                                className="mr-2"
                                rounded
                                ghost
                                label="1 document uploaded"
                                onClick={() => onClickEdit(i, 1)}
                              />
                            ) : (
                              <BrixelIcon
                                className="mr-2"
                                color="green"
                                icon="upload-document"
                                onClick={() => onClickEdit(i, 1)}
                              />
                            )
                          }
                          <BrixelIcon
                            color="green"
                            icon="pencil"
                            onClick={() => onClickEdit(i)}
                          />
                        </div>
                      </div>
                    ))
                  }
                  <BrixelButtonText
                    className="mt-2 mb-2"
                    label="Add another person"
                    leftIcon="plus"
                    onClick={() => onClickEdit(get(formValue, 'persons', []).length)}
                  />
                  <hr />

                  <h6 className="mt-3">
                    Please give us your bank details to simplify the reservation process.
                  </h6>

                  <div className="w-perc-100">
                    <MultiFileldsReduxForm
                      form="Identification"
                      disableNextBtn={false}
                      formValue={formValue}
                      inputs={cardInput}
                      onClick={() => ''}
                      onCloseGoBack={() => ''}
                      // onClickDisabled={!checkValidateField()}
                      // onSubmit={() => changeStep()}
                      showSendButton={false}
                      // showErrors={showError}
                      disableDelay
                    />
                  </div>

                </div>
              </div>
              <div
                className="footerAction flowFooter"
              >
                <div className="pos-r mt-3">
                  <div className="w-perc-100 max-w-fix-600 a-c dis-fl-row m-a flex-wrap jc-c mb-3">
                    <BrixelButtonIcon
                      className="backBtn ml-0"
                      icon="arrow-left-small"
                      onClick={() => onBack()}
                      theme="light"
                      secondary
                    />
                    <BrixelButtonPrimary
                      rounded
                      onClick={() => setStepResume('checkData')}
                      rightIcon="arrow-right-small"
                      className="ml-a mr-a noWrap"
                      label="Next"
                    />
                  </div>
                </div>
              </div>
            </>
          )
        }
        {
          stepResume === 'checkData' && (
            <>
              <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
                Who is the buyer of the property?
              </h2>
              <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite">
                <div className="p-5">
                  <h6 className="fweight-400">Great, thank you.</h6>
                  <h6 className="fweight-400">
                    Are all these details correct? Please review all inputs as they will be later used for the notary.
                  </h6>

                  {
                    get(formValue, 'persons', []).map((buyer, i) => (
                      <div
                        className="mt-2 bgBlue100 brdRadius py-2 px-4"
                        key={i.toString()}
                      >
                        <div className="dis-f a-c jc-b">
                          <span className="txtGreen400">{buyer.fullName}</span>
                          <div>
                            <BrixelIcon
                              color="green"
                              icon="pencil"
                              onClick={() => onClickEdit(i)}
                            />
                          </div>
                        </div>
                        <div className="dis-f a-t flex-wrap">
                          {
                            getBuyerData.inputs.map((data, f) => (
                              <div
                                className="w-perc-50 mt-2"
                                key={f.toString()}
                              >
                                {
                                  data.name.includes('currentLivingAddress.address') ? (
                                    <>
                                      <h6>Address</h6>
                                      <p>
                                        <span>{get(formValue, `persons[${i}].currentLivingAddress.street`, '')}</span>
                                        {
                                          get(formValue, `persons[${i}].currentLivingAddress.zipCode`, '') && (
                                            <span>, {get(formValue, `persons[${i}].currentLivingAddress.zipCode`, '')}</span>
                                          )
                                        }
                                        {
                                          get(formValue, `persons[${i}].location.city`, '') && (
                                            <span className="ml-small-4">
                                              {get(formValue, `persons[${i}].location.city`, '')}
                                            </span>
                                          )
                                        }
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      {
                                        !data.name.includes('currentLivingAddress') && (
                                          <>
                                            <h6>{data.label}</h6>
                                            {
                                              data.name.includes('date') ? (
                                                <p>
                                                  {
                                                    !isNaN(+get(formValue, data.name.replace('[0]', `[${i}]`), '')) ? (
                                                      DateTime.fromMillis(get(formValue, data.name.replace('[0]', `[${i}]`), '')).toFormat('d/MM/yyyy')
                                                    ) : (
                                                      ''
                                                    )
                                                  }
                                                </p>
                                              ) : (
                                                <p>
                                                  {get(formValue, data.name.replace('[0]', `[${i}]`), '')}
                                                </p>
                                              )
                                            }
                                          </>
                                        )
                                      }
                                    </>
                                  )
                                }
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    ))
                  }

                  <BrixelCheckbox
                    className="mt-2"
                    input={{
                      name: 'agreeToProceed',
                      onChange: (val) => setAgreeToProceed(val),
                      value: agreeToProceed,
                    }}
                    options={[{
                      label: 'I hereby confirm that all the informations are correct to proceed with the sales process.',
                      value: true,
                    }]}
                  />

                </div>
              </div>

              <div
                className="footerAction flowFooter"
              >
                <div className="pos-r mt-3">
                  <div className="w-perc-100 max-w-fix-600 a-c dis-fl-row m-a flex-wrap jc-c mb-3">
                    <BrixelButtonIcon
                      className="backBtn ml-0"
                      icon="arrow-left-small"
                      onClick={() => setStepResume('resume')}
                      theme="light"
                      secondary
                    />
                    <BrixelButtonPrimary
                      rounded
                      onClick={() => onClick()}
                      rightIcon="arrow-right-small"
                      className="ml-a mr-a noWrap"
                      label="Save"
                      disabled={!agreeToProceed[0]}
                      isLoading={isSmallLoading.sendData}
                    />
                  </div>
                </div>
              </div>

            </>
          )
        }
      </>
    </div>
  );
};

IdentificationFlow.propTypes = {
  cardInput: PropTypes.arrayOf(PropTypes.object),
  dealID: PropTypes.string.isRequired,
  formValue: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

IdentificationFlow.defaultProps = {
  cardInput: [],
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.Identification.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(IdentificationFlow);
