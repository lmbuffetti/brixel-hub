/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import { compose } from 'redux';
import get from 'lodash/get';
import isNaN from 'lodash/isNaN';
import isObject from 'lodash/isObject';
import { connect } from 'react-redux';
import {
  BrixelButtonIcon,
  BrixelButtonPrimary,
  BrixelButtonText,
  BrixelIcon,
} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import {
  BrixelCheckbox,
  ReduxField,
} from '@brixel-io/brixel-components/dist/form';
import { DateTime } from 'luxon';
import EditBuyerData from './EditBuyerData';
import { IdentificationQuestions } from '../../../resources/Deals/Identification';
import type {IdentificationBuyerResumeType} from '../../../@types/Pages/Closing/Identification/IdentificationBuyerResume';

const IdentificationBuyerResume = (props: IdentificationBuyerResumeType) => {
  // PROPS
  const {
    cardInput = [],
    dealID,
    formValue,
    isSmallLoading,
    lang,
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

  const getBuyerData = IdentificationQuestions(true, userType, lang).find((quest) => quest.history === 'userData') || {inputs: []};

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

  const formatTextForm = (txt, name) => {
    if (getBuyerData?.inputs) {
      const inputBuyerData: any = get(getBuyerData, 'inputs', []) || [];
      // TODO check
      //@ts-ignore
      const getField = inputBuyerData.find((fld) => fld.name === name);
      if (getField && getField.options) {
        const txtData = getField.options.find((fld) => fld.value === txt);
        if (txtData) return txtData.label;
      }
    }
    return txt;
  };

  return (
    <div className="idFlow">
      <>
        {
          stepResume === 'editProfile' && (
            <>
              <EditBuyerData
                dealID={dealID}
                forceStep={stepForm}
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
                      theme="text"
                      themeSat={300}
                      ghost
                    />
                    <BrixelButtonPrimary
                      rounded
                      onClick={stepForm === 0 ? () => setStepForm(1) : () => setStepResume('resume')}
                      rightIcon="arrow-right-small"
                      className="ml-a mr-a noWrap"
                      disabled={!validateInput()}
                      label={translateTo('Next', lang)}
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
                {translateTo(`Who is the ${userType} of the property?`, lang)}
              </h2>
              <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50">
                <div className="p-2 p-sm-5">
                  <p className="mb-1">
                    {translateTo('Please fill in the full name as it is stated in your ID. Add all people who are legally buying the property, e.g. your spouse or an investment partner.', lang)}
                  </p>
                  {
                    get(formValue, 'persons', []).map((buyer, i) => (
                      <div
                        className="mt-2 bgBlue50x25 brdRadius p-2 dis-f a-c jc-b"
                        key={`frm_${i.toString()}`}
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
                          {
                            buyer.fullName && (
                              <span className="txtGreen400">{buyer.fullName}</span>
                            )
                          }
                        </div>
                        <div className="dis-f a-c">
                          <BrixelIcon
                            className="mr-2"
                            color="green"
                            icon={get(buyer, 'document[0].id', null) || get(buyer, 'document[0].file', null) ? 'identity-card' : 'upload'}
                            onClick={() => onClickEdit(i, 1)}
                          />
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
                    label={translateTo('Add another person', lang)}
                    leftIcon="plus"
                    onClick={() => onClickEdit(get(formValue, 'persons', []).length)}
                  />
                  <hr className="brdText50" />

                  <p className="mt-3">
                    {translateTo('Please give us your bank details to simplify the reservation process.', lang)}
                  </p>

                  <div className="w-perc-100">
                    {
                      cardInput.map((field, i) => (
                        <div
                          className={`${field.classWidthBox ? field.classWidthBox : 'w-perc-100'} ${field.classBoxWrapper || 'mt-3'}`}
                          key={`crd_${i.toString()}`}
                        >
                          <ReduxField
                            form="Identification"
                            component={field.component}
                            design={{
                              cardLayout: field.cardLayout,
                              cardSmall: field.cardSmall,
                              className: field.className || '',
                              classNameParent: field.classNameParent || '',
                              fluid: field.fluid,
                              iconClass: field.iconClass,
                              inputClassName: field.className || '',
                              isHorizontal: field.isHorizontal,
                              pdClass: field.pdClass,
                              large: field.large,
                              svgSupport: field.svgSupport,
                              svgWidth: field.svgWidth,
                            }}
                            input={{
                              name: field.name,
                              options: field.options,
                              placeholder: field.placeholder || '',
                              validate: field.validation,
                            }}
                            labels={{
                              icons: field.icons,
                              label: translateTo(get(field, 'label', ''), lang),
                              labelLeft: translateTo(get(field, 'labelLeft', ''), lang),
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
                      theme="text"
                      themeSat={300}
                      ghost
                    />
                    <BrixelButtonPrimary
                      rounded
                      disabled={!validateInput()}
                      onClick={() => setStepResume('checkData')}
                      rightIcon="arrow-right-small"
                      className="ml-a mr-a noWrap"
                      label={translateTo('Next', lang)}
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
                {translateTo(`Who is the ${userType} of the property?`, lang)}
              </h2>
              <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50">
                <div className="p-2 p-sm-5">
                  <h6 className="fweight-400">
                    {translateTo('Great, thank you.', lang)}
                  </h6>
                  <h6 className="fweight-400">
                    {translateTo('Are all these details correct? Please review all inputs as they will be later used for the notary.', lang)}
                  </h6>

                  {
                    get(formValue, 'persons', []).map((buyer, i) => (
                      <div
                        className="mt-2 bgBlue50x25 brdRadius py-2 px-4"
                        key={`frm_${i.toString()}`}
                      >
                        <div className="dis-f a-c jc-b">
                          {
                            buyer.fullName && (
                              <span className="txtGreen400">{buyer.fullName}</span>
                            )
                          }
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
                            get(getBuyerData, 'inputs', []).map((data, f) => (
                              <div
                                className="w-perc-50 mt-2"
                                key={`byrDt_${f.toString()}`}
                              >
                                {
                                  data.name.includes('currentLivingAddress.address') ? (
                                    <>
                                      <span className="fsize-300 txtText400">
                                        {translateTo('Address', lang)}
                                      </span>
                                      <p className="fsize-300">
                                        <span>{get(formValue, `persons[${i}].currentLivingAddress.address`, '')}</span>
                                        {
                                          get(formValue, `persons[${i}].currentLivingAddress.zipCode`, '') && (
                                            <span>, {get(formValue, `persons[${i}].currentLivingAddress.zipCode`, '')}</span>
                                          )
                                        }
                                        {
                                          get(formValue, `persons[${i}].currentLivingAddress.city`, '') && (
                                            <span className="ml-small-4">
                                              {get(formValue, `persons[${i}].currentLivingAddress.city`, '')}
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
                                            {
                                              get(formValue, data.name.replace('[0]', `[${i}]`)) && (
                                                <>
                                                  <span className="fsize-300 txtText400">{data.label}</span>
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
                                                        {formatTextForm(get(formValue, data.name.replace('[0]', `[${i}]`), ''), data.name)}
                                                      </p>
                                                    )
                                                  }
                                                </>
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
                      label: translateTo('I hereby confirm that all the informations are correct to proceed with the sales process.', lang),
                      value: 'true',
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
                      theme="text"
                      themeSat={300}
                      ghost
                    />
                    <BrixelButtonPrimary
                      rounded
                      onClick={() => onClick()}
                      rightIcon="arrow-right-small"
                      className="ml-a mr-a noWrap"
                      label={translateTo('Save', lang)}
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

const mapStateToProps = (state) => ({
  syncErrors: get(state, 'brixelForm.Identification.syncErrors', {}),
  formValue: get(state, 'brixelForm.Identification.values', {}),
  lang: get(state, 'common.language', 'en'),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(IdentificationBuyerResume);
