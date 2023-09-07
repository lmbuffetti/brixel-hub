import React from 'react';
import {
  BrixelButtonPrimary,
} from '@brixel-io/brixel-components';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {compose} from 'redux';
import translateTo from '../../utils/translation';
import type {TermsContidionSwitchType} from '../../@types/Pages/PackageFlow/TermConditionSwitch';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import {BrixelSwitchButton, ReduxField, Validation} from '@brixel-io/brixel-components/dist/form';

const TermsContidionSwitch = (props: TermsContidionSwitchType) => {

  const {
    activeSingleCompany,
    activeSingleProperty,
    formValue,
    syncErrors,
    lang,
    onSaveData,
  } = props;

  const isSaveDisabled = () => {
    let isDisabled = false;
    Object.keys(syncErrors).forEach((key) => {
      if (syncErrors[key] !== true || formValue[key] !== true) {
        isDisabled = true;
      }
    });
    return isDisabled;
  }

  // FUNCTION TO GO TO PREVIEW OR LIVE PAGE
  const getPreviewUrl = () => {
    const baseUrl = baseByData?.pageUrl || '';
    if (activeSingleProperty.published) {
      return `${baseUrl}${activeSingleProperty.stub}`;
    } else {
      const currentLocation = get(window, 'location.href', '');
      return `${baseUrl}preview/${activeSingleProperty.stub}?hubUrl=${currentLocation}`;
    }
  }

  const termLinks = (stub) => {
    const links = {
      'baloise': 'https://baloise.brixel.ch/allgemeine-bedingungen-brixel-one',
      'ubs': 'https://ubs.brixel.ch/allgemeine-bedingungen-brixel-one',
      'brixel_zurich': 'https://brixel.ch/allgemeine-bedingungen-brixel-one',
    };

    return links[stub] || ''; // returns the link for the given stub or an empty string if stub not found
  }

  // STATE
  return (
    <div className="max-w-fix-632 ml-a mr-a">
      <div className="brdRadius bgWhite brdSmall brdText100 p-4">
        <div className="dis-f jc-b a-t">
          <ReduxField
            component={BrixelSwitchButton}
            form="TermsCondition"
            input={{
              name: 'termsPage',
              validate: [Validation.required],
            }}
          />
          <div className="ml-3">
            <p className="dis-f a-c jc-fs fsize-400 fweight-600 mb-1">
              <span>
                {translateTo('Confirm the content on the', lang)}
              </span>
              <a
                target='_blank'
                href={getPreviewUrl()}
                className="fsize-400 ml-small-4 fweight-600 txtGreen400 link" rel="noreferrer"
              >
                {translateTo('Brixel Page', lang)}
              </a>
              <span className="txtRed400">*</span>
            </p>
            <p>
              {translateTo('I hereby confirm that I agree with the content of the property website and the publication of the property website on Brixel and external portals.', lang)}
            </p>
          </div>
        </div>
        <hr className="my-3 brdText100"/>
        <div className="dis-f jc-b a-t">
          <ReduxField
            component={BrixelSwitchButton}
            form="TermsCondition"
            input={{
              name: 'termsContract',
              validate: [Validation.required],
            }}
          />
          <div className="ml-3">
            <p className="dis-f a-c jc-fs fsize-400 fweight-600 mb-1">
              <span>
                {translateTo('Accept the', lang)}
              </span>
              <a target='_blank' href={termLinks(activeSingleCompany.stub)} className="fsize-400 ml-small-4 fweight-600 txtGreen400 link" rel="noreferrer">
                {translateTo('terms of the contract', lang)}
              </a> <span className="txtRed400">*</span>
            </p>
            <p>
              {translateTo('I hereby confirm that I have read and understood the contract terms for the Brixel One service package and accept them.', lang)}
            </p>
          </div>
        </div>
        {
          activeSingleCompany.stub === 'baloise' && (
            <>
              <hr className="my-3 brdText100"/>
              <div className="dis-f jc-b a-t">
                <ReduxField
                  component={BrixelSwitchButton}
                  form="TermsCondition"
                  input={{
                    name: 'termsPage',
                    validate: [Validation.required],
                  }}
                />
                <div className="ml-3">
                  <p className="dis-f a-c jc-fs fsize-400 fweight-600 mb-1">
                    <span>
                      {translateTo('Accept the', lang)}
                    </span>
                    <button className="fsize-400 ml-small-4 fweight-600 txtGreen400 link">
                      {translateTo('waiver declaration to Baloise', lang)}
                    </button>
                    <span className="txtRed400">*</span>
                  </p>
                  <p>
                    {translateTo('I confirm and agree that Baloise can keep the remuneration received from Brixel and hereby waive the right to have this remuneration passed on to me.', lang)}
                  </p>
                </div>
              </div>
            </>
          )
        }
      </div>

      <BrixelButtonPrimary
        rounded
        className="ml-a mr-a mt-4"
        rightIcon="arrow-right"
        label="Send acceptance"
        onClick={() => onSaveData()}
        disabled={isSaveDisabled()}
      />
    </div>
  )
}


const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  formValue: get(state, 'brixelForm.TermsCondition.values', {}),
  syncErrors: get(state, 'brixelForm.TermsCondition.syncErrors', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  lang: get(state, 'common.language', 'en'),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps),
)(TermsContidionSwitch);
