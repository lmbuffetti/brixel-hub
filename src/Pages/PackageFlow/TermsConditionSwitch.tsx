/* eslint-disable max-len */
import React from 'react';
import {
  BrixelButtonPrimary,
} from '@brixel-io/brixel-components';
import get from 'lodash/get';
import {connect} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {bindActionCreators, compose} from 'redux';
import translateTo from '../../utils/translation';
import type {TermsConditionSwitchType} from '../../@types/Pages/PackageFlow/TermConditionSwitch';
import {BrixelSwitchButton, ReduxField, Validation, change} from '@brixel-io/brixel-components/dist/form';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import {setModal} from '../../actions/CommonActions';
import successCheckImg from '../../images/Marketing/successCheck.svg';

const TermsConditionSwitch = (props: TermsConditionSwitchType) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };

  const {
    activeSingleCompany,
    activeSingleProperty,
    changeFieldValue,
    formValue,
    handleSetModal,
    lang,
    onSaveData,
    syncErrors,
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

  const acceptTerm = (term) => {
    changeFieldValue(term, true);
    handleSetModal({ state: false });
  }

  const openModal = (e) => {
    e.preventDefault();
    const textMoreInfo = `
    <p>
      ${translateTo('Baloise Insurance Ltd (“Baloise”) acts as lead intermediary for its business partner Brixel AG ("Brixel") on the basis of a joint cooperation agreement. Brixel operates a real estate transaction platform and provides IT services in the real estate sector.', lang)}
    </p>
    <p class="mt-2">
      ${translateTo('Baloise receives and collects a one-time remuneration of CHF 1,000.00 incl. VAT in connection with the lead brokerage for each property that a customer of Baloise sells via Brixel within the framework of the Baloise One Pact.', lang)}
    </p>
    <p class="mt-2">
      ${translateTo('Remuneration can lead to conflicts of interest at Baloise. In particular, it can create an incentive for Baloise to give preference to certain service providers over other comparable service providers that pay no, or lower, remuneration, even though Baloise does not act as an intermediary for any comparable service providers apart from Brixel. Baloise has taken appropriate organisational measures to minimise the risks involved. To enable customers to make an informed decision, Baloise discloses the amount of the remuneration.', lang)}
    </p>
    <p class="mt-2">
      ${translateTo('The customer confirms and agrees that Baloise can keep the remuneration received from Brixel and hereby waives the right to have this remuneration passed on to them.', lang)}
    </p>
    `
    handleSetModal({
      title: translateTo('Waiver of coverage form – Brixel', lang),
      body: textMoreInfo,
      state: true,
      small: true,
      classTitle: 'fsize-600 fweight-600 px-1',
      bodyInnerClass: 'p-1',
      layout: 'xxlarge',
      multiActions: [
        {
          round: true,
          clr: 'Text',
          sat: 800,
          btnType: 'Tertiary',
          name: translateTo('Close', lang),
          className: 'ml-0 mr-a',
          func: () => handleSetModal({ state: false }),
        },
        {
          round: true,
          clr: 'text',
          className: 'mr-2',
          btnType: 'Primary',
          name: translateTo('Accept', lang),
          func: () => acceptTerm('acceptWaiverDeclaration'),
        },
      ],
    });
  }

  const linkTermsCondition = () => {
    switch (activeSingleCompany.stub) {
      case 'baloise': {
        let link: string | undefined;
        switch (lang) {
          case 'de':
            link = 'https://baloise.brixel.ch/de/allgemeine-bedingungen-brixel-one';
            break;
          case 'fr':
            link = 'https://baloise.brixel.ch/fr/allgemeine-bedingungen-brixel-one';
            break;
          case 'it':
            link = 'https://baloise.brixel.ch/it/allgemeine-bedingungen-brixel-one';
            break;
          default:
            link = 'https://baloise.brixel.ch/en/allgemeine-bedingungen-brixel-one';
        }
        return link;
      }
      case 'ubs': {
        let link: string | undefined;
        switch (lang) {
          case 'de':
            link = 'https://ubs.brixel.ch/de/allgemeine-bedingungen-brixel-one';
            break;
          case 'fr':
            link = 'https://ubs.brixel.ch/fr/allgemeine-bedingungen-brixel-one';
            break;
          case 'it':
            link = 'https://ubs.brixel.ch/it/allgemeine-bedingungen-brixel-one';
            break;
          default:
            link = 'https://ubs.brixel.ch/en/allgemeine-bedingungen-brixel-one';
        }
        return link;
      }
      default: {
        let link: string | undefined;
        switch (lang) {
          case 'de':
            link = 'https://brixel.ch/de/allgemeine-bedingungen-brixel-one';
            break;
          case 'fr':
            link = 'https://brixel.ch/fr/allgemeine-bedingungen-brixel-one';
            break;
          case 'it':
            link = 'https://brixel.ch/it/allgemeine-bedingungen-brixel-one';
            break;
          default:
            link = 'https://brixel.ch/en/allgemeine-bedingungen-brixel-one';
        }
        return link;
      }
    }
  }

  // STATE
  return (
    <div className="max-w-fix-632 ml-a mr-a">
      <div className="brdRadius bgWhite brdSmall brdText100 p-2 p-sm-4">
        <div className="dis-f jc-b a-t">
          {
            activeSingleProperty?.acceptTermsOfContract ? (
              <div className='mt-1 min-w-fix-40 min-w-fix-sm-64'>
                <img
                  src={successCheckImg}
                  className='h-fix-40 w-fix-40 h-fix-sm-64 w-fix-sm-64'
                  alt="accepted confirmContentOnBrixelPage"
                />
              </div>
            ) : (
              <ReduxField
                component={BrixelSwitchButton}
                form="TermsCondition"
                input={{
                  name: 'confirmContent',
                  validate: [Validation.required],
                }}
              />
            )
          }
          <div className="pl-3">
            <p className="dis-ib fsize-400 fweight-600 mb-1 pos-r">
              <span>
                {translateTo('Confirm the content on the', lang)}
              </span>
              <a
                href={`${baseByData.pageUrl}preview/${activeSingleProperty.stub}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fsize-400 ml-small-4 td-u fweight-600 txtGreen400"
              >
                {translateTo('Brixel Page', lang)}
              </a>
              <span className="txtRed400 pos-a-fix ml-small-4"> *</span>
            </p>
            <p>
              {translateTo('I hereby confirm that I agree with the content of the property website and the publication of the property website on Brixel and external portals.', lang)}
            </p>
          </div>
        </div>
        <hr className="my-3 brdText100"/>
        <div className="dis-f jc-b a-t">
          {
            activeSingleProperty?.confirmContentOnBrixelPage ? (
              <div className='mt-1 min-w-fix-40 min-w-fix-sm-64'>
                <img
                  src={successCheckImg}
                  className='h-fix-40 w-fix-40 h-fix-sm-64 w-fix-sm-64'
                  alt="accepted confirmContentOnBrixelPage"
                />
              </div>
            ) : (
              <ReduxField
                component={BrixelSwitchButton}
                form="TermsCondition"
                input={{
                  name: 'acceptContract',
                  validate: [Validation.required],
                }}
              />
            )
          }
          <div className="pl-3">
            <p className="dis-ib fsize-400 fweight-600 mb-1">
              <span>
                {translateTo('Accept the', lang)}
              </span>
              <a
                href={linkTermsCondition()}
                target="_blank"
                rel="noopener noreferrer"
                className="fsize-400 ml-small-4 td-u fweight-600 txtGreen400"
              >
                {translateTo('terms of the contract', lang)}
              </a> <span className="txtRed400 pos-a-fix ml-small-4"> *</span>
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
                {
                  activeSingleProperty?.acceptWaiverDeclarationToBaloise ? (
                    <div className='mt-1 min-w-fix-40 min-w-fix-sm-64'>
                      <img
                        src={successCheckImg}
                        className='h-fix-40 w-fix-40 h-fix-sm-64 w-fix-sm-64'
                        alt="accepted confirmContentOnBrixelPage"
                      />
                    </div>
                  ) : (
                    <ReduxField
                      component={BrixelSwitchButton}
                      form="TermsCondition"
                      input={{
                        name: 'acceptWaiverDeclaration',
                        validate: [Validation.required],
                      }}
                    />
                  )
                }
                <div className="pl-3">
                  <p className="dis-ib fsize-400 fweight-600 mb-1">
                    <span>
                      {translateTo('Accept the', lang)}
                    </span>
                    <span
                      onClick={(e) => openModal(e)}
                      className="fsize-400 cur-poi ml-small-4 td-u fweight-600 txtGreen400"
                    >
                      {translateTo('waiver declaration', lang)}
                    </span>
                    <span className='pl-small-4'>
                      {translateTo('to Baloise', lang)}
                    </span>
                    <span className="txtRed400 pos-a-fix ml-small-4"> *</span>
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

      {
        activeSingleProperty?.acceptTermsOfContract ? (
          <BrixelButtonPrimary
            rounded
            className="ml-a mr-a mt-4"
            label={translateTo('Close', lang)}
            onClick={() => history.push(`/${activeSingleProperty.id}/marketing`)}
          />
        ) : (
          <BrixelButtonPrimary
            rounded
            className="ml-a mr-a mt-4"
            rightIcon="arrow-right"
            label={translateTo('Send acceptance', lang)}
            onClick={() => onSaveData()}
            disabled={isSaveDisabled()}
          />
        )
      }
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

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('TermsCondition', field, value));
  },
  handleSetModal: bindActionCreators(setModal, dispatch),
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(TermsConditionSwitch);
