import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  BrixelIcon,
  BrixelButtonPrimary,
} from '@brixel/brixel-components';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { FinancialCalculator } from '@brixel/brixel-configuration-partner/dist/FinancialFormulas';

const Key4Registration = (props) => {
  const {
    activeSinglePropertyDocs,
    activeSingleProperty,
    formValue,
    onClick,
    loggedInUser,
  } = props;
  // COUNTRY
  let lowCountry = get(formValue, 'propertyLocation.countryCode', '');
  lowCountry = lowCountry ? lowCountry.toLowerCase() : '';
  const [maxLoanRatio, setMaxLoanRatio] = useState(null);
  const [maxAffordability, setMaxAffordability] = useState(null);
  const affordability = get(formValue, 'affordability', 0);
  const loanToValueRatio = get(formValue, 'loanToValueRatio', 0);

  useEffect(() => {
    const equityCapital = get(formValue, 'financeBuyer.equity', 0);
    const grossIncome = get(formValue, 'financeBuyer.income', 0);
    const fixedCost = 0;
    const cost = {
      equityCapital,
      grossIncome,
      fixedCost,
    };
    const price = get(formValue, 'propertyPrice', 0);
    setMaxLoanRatio(FinancialCalculator(lowCountry, price, cost).maxLoanRatio);
    setMaxAffordability(FinancialCalculator(lowCountry, price, cost).maxAffordability);
  }, []);

  const getSellerBrochure = () => activeSinglePropertyDocs.find((itm) => itm.isBrochure);

  const onRegisterKey4 = () => {
    const channelType = 'Brixel';
    const useCase = 'NEW_HOME_BUYER';
    const subtype = 'FINANCIAL_CERTIFICATE';
    const lang = loggedInUser.language;
    const campID = `Brixel-FinancialCertificate-CH-${lang}-BrixelPage-${activeSingleProperty.id}-${loggedInUser.id}`;
    const objectUsage = 'MAIN_RESIDENCE';
    // const riskProfile = 'BALANCED';
    // const startDate = '2021-02';
    const marketValue = formValue.amount;
    const postalCode = get(activeSingleProperty, 'location.zip', '');
    const city = get(activeSingleProperty, 'location.city', '');
    const streetName = get(activeSingleProperty, 'location.name', '');
    const streetNumber = get(activeSingleProperty, 'location.streetNumber', '');
    const objectType = get(activeSingleProperty, 'properties.propertyType', '') === 'Home' ? 'SINGLE_FAMILY_HOME' : 'APARTMENT';
    const grossAnnualIncome = get(formValue, 'financeBuyer.income', 0);
    const Equity = get(formValue, 'financeBuyer.equity', 0);
    // eslint-disable-next-line max-len
    const url = `https://app.key4.ch/app/HVE/1?channelType=${channelType}&useCase=${useCase}&subtype=${subtype}&objectUsage=${objectUsage}&campID=${campID}&marketValue=${marketValue}&postalCode=${postalCode}&city=${city}&streetName=${streetName}&streetNumber=${streetNumber}&objectType=${objectType}&grossAnnualIncome=${grossAnnualIncome}&lang=${lang}&equity=${Equity}`;
    window.location.assign(url);
    setTimeout(() => onClick(), 500);
  };

  const linkInfoKey4 = () => {
    let url = 'https://key4.ch/en/privacy-statement/';
    if (loggedInUser.language === 'it') url = 'https://key4.ch/it/privacy-statement/';
    if (loggedInUser.language === 'de') url = 'https://key4.ch/de/privacy-statement/';
    return url;
  };

  return (
    <div>
      {
        affordability < maxAffordability && loanToValueRatio < maxLoanRatio ? (
          <>
            <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
              Learn within 48 hours if you can afford your desired home.
            </h2>
            <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdLight200">
              <div className="p-5">
                <p className="fsize-500 txtDark700">Please prepare the following documents to apply for your certificate:</p>

                <div className="mt-3">
                  <div className="dis-f a-c">
                    <BrixelIcon
                      className="mr-2"
                      iconWidth="w-fix-32"
                      icon="tax-declaration"
                      color="primary"
                      saturationTxt={300}
                    />
                    <p className="txtDark700">Latest tax declaration</p>
                  </div>
                  <div className="dis-f a-c mt-2">
                    <BrixelIcon
                      className="mr-2"
                      iconWidth="w-fix-32"
                      icon="proof-income"
                      color="primary"
                      saturationTxt={300}
                    />
                    <p className="txtDark700">Latest proof of income, incl. proof of bonus if applicable</p>
                  </div>
                  <div className="dis-f a-c mt-2">
                    <BrixelIcon
                      className="mr-2"
                      iconWidth="w-fix-32"
                      icon="pension"
                      color="primary"
                      saturationTxt={300}
                    />
                    <p className="txtDark700">Pension fund statement</p>
                  </div>

                  <div className="dis-f a-c mt-2">
                    <BrixelIcon
                      className="mr-2"
                      iconWidth="w-fix-32"
                      icon="property-expose"
                      color="primary"
                      saturationTxt={300}
                    />
                    <p className="dis-f flex-wrap a-c txtDark700">
                      <span>Property exposé</span>
                      {
                        getSellerBrochure() && (
                          <a
                            className="ml-small-4 txtDark700 td-u"
                            href={`${baseByData.shortPath}${getSellerBrochure().path}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            download here
                          </a>
                        )
                      }
                    </p>
                  </div>

                </div>
              </div>
            </div>
            <div className="max-w-fix-600 mx-a mt-3">
              <p className="fsize-300 txtDark700">
                <span>By clicking the button you allow us to send the following data to key4: your offer price, property type, property address, type of residence (main type of residence), your equity capital, and your gross annual income. The Privacy Statement applicable to key4 can be found on the</span>
                <a
                  href={linkInfoKey4()}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-small-4 txtDark400 td-u mt-small-4-neg dis-ib"
                >
                  <p className="fsize-300 txtDark700">key4 website</p>
                </a>
              </p>
              <BrixelButtonPrimary
                className="mx-a mt-3"
                rounded
                label="Register on key4"
                rightIcon="arrow-right"
                onClick={() => onRegisterKey4()}
              />

              <p className="mt-3 fs-i txtDark400 fsize-200">
                Please note that Brixel will be compensated for your referral when you conclude a mortgage with key4.
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
              Unfortunately, your budget is not sufficient
            </h2>
            <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdLight200">
              <div className="p-5">
                <h5>
                  Based on the details you have provided, financing your dream home is not quite possible yet.
                </h5>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

Key4Registration.propTypes = {
  activeSinglePropertyDocs: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  formValue: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSinglePropertyDocs: get(state, 'property.activeSingleProperty.documents', []),
  formValue: get(state, 'brixelForm.offerFlow.values', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(Key4Registration);
