/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { get, isNaN, isObject } from 'lodash';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonSecondary,
  BrixelButtonText,
  BrixelCheckbox,
  BrixelIcon,
  ReduxField,
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
    syncErrors,
    userType,
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

  const validateInput = () => {
    if (stepResume === 'editProfile' && stepForm === 0) {
      let isValid = true;
      if (get(syncErrors, `persons[${editProfile}]`, null)) {
        Object.keys(syncErrors.persons[editProfile]).forEach((key) => {
          if (isObject(syncErrors.persons[editProfile][key])) {
            Object.keys(syncErrors.persons[editProfile][key]).forEach((subkey) => {
              if (isValid) isValid = syncErrors.persons[editProfile][key][subkey] !== 'Required';
            });
          } else if (isValid) isValid = syncErrors.persons[editProfile][key] !== 'Required';
        });
      }
      return isValid;
    }
    if (stepResume === 'resume') {
      let isValid = true;
      if (syncErrors) {
        Object.keys(syncErrors).forEach((key) => {
          if (isObject(syncErrors[key])) {
            Object.keys(syncErrors[key]).forEach((subkey) => {
              if (isValid) isValid = syncErrors[key][subkey] !== 'Required' && syncErrors[key][subkey] !== 'Invalid IBAN';
            });
          } else if (isValid) isValid = syncErrors[key] !== 'Required' && syncErrors[key] !== 'Invalid IBAN';
        });
      }
      return isValid;
    }
    return true;
  };

  const getBuyerData = IdentificationQuestions(true).find((quest) => quest.history === 'buyerData');

  return (
    <div className="idFlow">
      <>
        {
          stepResume === 'editProfile' && (
            <>
              <EditBuyerData
                dealID={dealID}
                forceStep={stepForm}
                onCloseEdit={() => setStepResume('resume')}
                profileId={editProfile}
                userType={userType}
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
                      disabled={!validateInput(validateInput)}
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
                Who is the {userType} of the property?
              </h2>
              <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100">
                <div className="p-2 p-sm-5">
                  <p className="mb-1">
                    Please fill in the full name as it is stated in your ID. Add all people who are legally buying the property, e.g. your spouse
                    or an investment partner.
                  </p>
                  {
                    get(formValue, 'persons', []).map((buyer, i) => (
                      <div
                        className="mt-2 bgBlue100x25 brdRadius p-2 dis-f a-c jc-b"
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
                              <BrixelIcon
                                className="mr-2"
                                color="green"
                                icon="upload"
                                onClick={() => onClickEdit(i, 1)}
                              />
                            ) : (
                              <BrixelButtonSecondary
                                className="mr-2"
                                rounded
                                ghost
                                label="1 document uploaded"
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
                  <hr className="brdAltGrey100" />

                  <p className="mt-3">
                    Please give us your bank details to simplify the reservation process.
                  </p>

                  <div className="w-perc-100">
                    {
                      cardInput.map((field, i) => (
                        <div
                          className={`${field.classWidthBox ? field.classWidthBox : 'w-perc-100'} ${field.classBoxWrapper || 'mt-3'}`}
                          key={i.toString()}
                        >
                          <ReduxField
                            form="Identification"
                            component={field.component}
                            design={{
                              cardLayout: field.cardLayout,
                              cardSmall: field.cardSmall,
                              className: field.className || '',
                              classNameParent: field.classNameParent || '',
                              compact: field.compact,
                              fluid: field.fluid,
                              formatText: field.formatText,
                              iconClass: field.iconClass,
                              inputClassName: field.className || '',
                              isHorizontal: field.isHorizontal,
                              pdClass: field.pdClass,
                              large: field.large,
                              section: field.section,
                              showCountCharacters: field.showCountCharacters,
                              stretched: field.stretched,
                              svgSupport: field.svgSupport,
                              svgWidth: field.svgWidth,
                              wrapClass: field.wrapClass || '',
                            }}
                            input={{
                              name: field.name,
                              options: field.options,
                              placeholder: field.placeholder || '',
                              validate: field.validation,
                            }}
                            labels={{
                              icons: field.icons,
                              label: field.label,
                              labelLeft: field.labelLeft,
                              labelType: field.labelType,
                            }}
                          />
                        </div>
                      ))
                    }
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
                      disabled={!validateInput()}
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
              <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100">
                <div className="p-2 p-sm-5">
                  <h6 className="fweight-400">Great, thank you.</h6>
                  <h6 className="fweight-400">
                    Are all these details correct? Please review all inputs as they will be later used for the notary.
                  </h6>

                  {
                    get(formValue, 'persons', []).map((buyer, i) => (
                      <div
                        className="mt-2 bgBlue100x25 brdRadius py-2 px-4"
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
                                      <span className="fsize-300 txtAltGrey400">Address</span>
                                      <p className="fsize-300">
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
                                            <span className="fsize-300 txtAltGrey400">{data.label}</span>
                                            {
                                              data.name.includes('date') ? (
                                                <p className="fsize-300">
                                                  {
                                                    !isNaN(+get(formValue, data.name.replace('[0]', `[${i}]`), '')) ? (
                                                      DateTime.fromMillis(get(formValue, data.name.replace('[0]', `[${i}]`), '')).toFormat('d/MM/yyyy')
                                                    ) : (
                                                      ''
                                                    )
                                                  }
                                                </p>
                                              ) : (
                                                <p className="fsize-300">
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
                    className="mt-4"
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
  syncErrors: PropTypes.object.isRequired,
  userType: PropTypes.string.isRequired,
};

IdentificationFlow.defaultProps = {
  cardInput: [],
};

const mapStateToProps = (state) => ({
  syncErrors: get(state, 'brixelForm.Identification.syncErrors', {}),
  formValue: get(state, 'brixelForm.Identification.values', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(IdentificationFlow);
