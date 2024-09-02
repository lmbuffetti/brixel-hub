import React, {useEffect} from 'react';
import {
  change, ReduxField,
  BrixelInputPhone,
  BrixelInputText,
  BrixelRadioButton,
  Validation,
} from '@brixel-io/brixel-components/dist/form';
import {BrixelButtonSecondary} from '@brixel-io/brixel-components';
import get from 'lodash/get';
import translateTo from '../../../../utils/translation';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {UserType} from '@brixel-io/brixel-components/dist/@types/Models/User';
import BrixelButtonPrimary from '@brixel-io/brixel-components/dist/components/BrixelButtonPrimary';

type EnergyRequestProps = {
  lang: string;
  loggedInUser: UserType;
  changeFieldValue: (field: string, value: any) => void;
  onClick: () => void;
  syncErrors: object
}

const EnergyRequest = (props: EnergyRequestProps) => {
  // PROPS
  const {
    changeFieldValue,
    loggedInUser,
    onClick,
    lang,
    syncErrors,
  } = props;

  const validateField = () => {
    let isValid = true
    Object.keys(syncErrors).forEach((key) => {
      if (isValid &&syncErrors[key] !== true) isValid = false
    })
    return isValid;
  }

  useEffect(() => {
    if (loggedInUser?.id) {
      changeFieldValue('name', loggedInUser.name)
      changeFieldValue('email', loggedInUser.email)
      changeFieldValue('phone', loggedInUser.phone)
    }
  }, [loggedInUser]);

  const EnergyPdf = () => {
    let certificateUrl = '';
    switch (lang) {
      case 'de':
        certificateUrl = '/pdf/performance-certificate-de.pdf';
        break;
      case 'fr':
        certificateUrl = '/pdf/performance-certificate-fr.pdf';
        break;
      case 'it':
        certificateUrl = '/pdf/performance-certificate-it.pdf';
        break;
      default:
        certificateUrl = '/pdf/performance-certificate-en.pdf';
        break;
    }
    window.open(certificateUrl, '_blank')
  }

  return (
    <main className="introScanFlow pt-2 pt-md-4 pb-2 pb-md-4 h-perc-100 txtText900">
      <div className="engBg dis-f-md jc-b brdRadius max-w-fix-1280 mx-a">
        <div className="p-md-8 w-perc-md-45">
          <h5 className='fweight-600 fsize-600 fsize-sm-700'>
            {translateTo('Order your verified energy certificate with an individual renovation plan', lang)}
          </h5>

          <div>
            <div className="dis-f a-c my-3">
              <span className="fsize-600 fsize-sm-700 fweight-600">CHF 1&apos;190</span>
              <span className="fsize-300 pl-1">incl. VAT</span>
            </div>
            <p className="mb-3 fsize-500">
              <span className="td-lt">{translateTo('CHF 1\'550', lang)}</span> <span>{translateTo('Reduced price for UBS clients', lang)}</span>
            </p>
          </div>
          <div>
            <p className="fweight-600 mb-2">{translateTo('Your advantages', lang)}</p>
            <ul className="checkList fsize-400 green">
              <li>
                {translateTo('Energy analysis of the property by energy experts', lang)}
              </li>
              <li>
                {translateTo('Detailed refurbishment plan', lang)}
              </li>
              <li>
                {translateTo('Construction cost estimates and subsidy calculations', lang)}
              </li>
              <li>
                {translateTo('Determining the savings potential for energy costs', lang)}
              </li>
            </ul>
          </div>

          <div className="my-5">
            <BrixelButtonSecondary
              rounded
              className="no-wrap ws-nw as-fs mt-2"
              rightIcon="document"
              label={translateTo('View example', lang)}
              onClick={() => EnergyPdf()}
            />
          </div>

        </div>
        <hr className="vertical lighter" />
        <div className="p-md-8 w-perc-md-55">
          <ReduxField
            form="energyRequest"
            component={BrixelInputText}
            labels={{
              label: translateTo('Full name', lang),
            }}
            design={{
              large: true,
            }}
            input={{
              name: 'name',
              validate: [Validation.required],
            }}
          />

          <ReduxField
            form="energyRequest"
            component={BrixelInputText}
            design={{
              className: 'mt-2',
              large: true,
            }}
            labels={{
              label: translateTo('E-mail address', lang),
            }}
            input={{
              name: 'email',
              type: 'email',
              validate: [Validation.required],
            }}
          />

          <ReduxField
            form="energyRequest"
            component={BrixelInputPhone}
            design={{
              className: 'mt-2',
              large: true,
            }}
            labels={{
              label: translateTo('Phone number', lang),
            }}
            input={{
              name: 'phone',
              validate: [Validation.required],
            }}
          />

          <ReduxField
            form="energyRequest"
            component={BrixelRadioButton}
            design={{
              className: 'mt-4',
            }}
            input={{
              deactivable: false,
              disableDelay: false,
              name: 'isCustomerOfUBS',
              options: [
                {
                  label: translateTo('I am a UBS customer and would like to benefit from the preferential price and order a verified energy performance certificate with an individual renovation plan from NORM.', lang),
                  value: true,
                },
                {
                  label: translateTo('I am not a UBS customer and would like to order a verified energy performance certificate with an individual refurbishment plan from NORM.', lang),
                  value: false,
                },
              ],
              validate: [Validation.required],
            }}
          />

          <p className="txtText700 fsize-300 mt-4">
            {/* eslint-disable-next-line max-len */}
            {translateTo('I agree that my data (surname, first name, telephone number, e-mail) may be transmitted to NORM Technologies AG (“NORM”) for the provision of the service. NORM collects and processes further personal data as part of the services offered by NORM, in particular for the purpose of preparing detailed energy performance certificates for the property. Details are contained in NORM\'s General Terms and Conditions and the data protection document, which will be made available to you. If you have accepted UBS\'s terms and conditions when registering on Brixel, NORM will forward the report produced for you as part of Norm\'s service to UBS so that UBS can discuss with you options for financing the upcoming renovation costs. By clicking on “Order now for a fee”, I agree to the processing of my personal data as described above.', lang)}
          </p>

          <BrixelButtonPrimary
            rounded
            className="mx-a mt-4"
            label="Order now for a fee"
            onClick={() => onClick()}
            disabled={!validateField()}
          />

        </div>
      </div>
    </main>
  );
};

const mapStateToProps = (state) => ({
  syncErrors: state?.brixelForm?.energyRequest?.syncErrors || {},
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
  lang: get(state, 'common.language', 'en'),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('energyRequest', field, value));
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(EnergyRequest);
