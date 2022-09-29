import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  BrixelIcon,
  BrixelButtonPrimary,
  BrixelButtonIcon,
} from '@brixel/brixel-components';
import { translateTo } from '../../../../utils/translation';
import { DateTime } from 'luxon';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import { FinancialCalculator } from '@brixel/brixel-components/dist/utils/FinancialFormulas';
import financingMortgageImg from '../../../../images/offer-flow/financingMortgage.svg';

const Key4Registration = (props) => {
  const {
    activeSingleCompany,
    activeSingleProperty,
    activeSinglePropertyDocs,
    formValue,
    lang,
    loggedInUser,
    onClick,
    onCloseGoBack,
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
      income: grossIncome,
      fixedCost,
    };
    const price = get(formValue, 'propertyPrice', 0);
    setMaxLoanRatio(FinancialCalculator(lowCountry, price, cost).maxLoanRatio);
    setMaxAffordability(FinancialCalculator(lowCountry, price, cost).maxAffordability);
  }, []);

  const getSellerBrochure = () => activeSinglePropertyDocs.find((itm) => itm.isBrochure);

  const onRegisterKey4 = () => {
    let riskProfile;
    let subtype = 'FINANCIAL_CERTIFICATE';
    if (get(formValue, 'subtype', null)) {
      subtype = get(formValue, 'subtype', '').toUpperCase();
    } else {
      riskProfile = 'BALANCED';
    }
    const channelType = 'Brixel';
    const useCase = 'NEW_HOME_BUYER';
    let campID = `Brixel-FinancialCertificate-CH-${lang}-BrixelPage-${activeSingleProperty.id}-${loggedInUser.id}`;
    if (activeSingleCompany.stub === 'ubs') campID = 'BRIXEL-BUYER-FINCER-CH-DEU';
    const objectUsage = 'MAIN_RESIDENCE';
    // const riskProfile = 'BALANCED';
    // const startDate = '2021-02';
    const marketValue = formValue.amount;
    const postalCode = get(activeSingleProperty, 'location.zip', '');
    const city = get(activeSingleProperty, 'location.city', '');
    const streetName = get(activeSingleProperty, 'location.name', '');
    const streetNumber = get(activeSingleProperty, 'location.streetNumber', '');
    const objectType = get(activeSingleProperty, 'properties.propertyType', '') === 'House' ? 'SINGLE_FAMILY_HOME' : 'APARTMENT';
    const grossAnnualIncome = get(formValue, 'financeBuyer.income', get(formValue, 'finance.grossIncome', 0));
    const Equity = get(formValue, 'financeBuyer.equity', get(formValue, 'finance.equityCapital', 0));
    // eslint-disable-next-line max-len
    let url = `https://app.key4.ch/app/HVE/1?channelType=${channelType}&useCase=${useCase}&subtype=${subtype}&objectUsage=${objectUsage}&campID=${campID}&marketValue=${marketValue}&postalCode=${postalCode}&city=${city}&streetName=${streetName}&streetNumber=${streetNumber}&objectType=${objectType}&grossAnnualIncome=${grossAnnualIncome}&lang=${lang}&equity=${Equity}&riskProfile=${riskProfile}`;
    if (get(formValue, 'subtype', null)) {
      const startDate = DateTime.local().plus({ month: 2 }).toFormat('yyyy-MM');
      const mortgageAmount = marketValue - Equity;
      url = `https://app.key4.ch/app/HVE/1?channelType=${channelType}&useCase=${useCase}&subtype=${subtype}&objectUsage=${objectUsage}&campID=${campID}&marketValue=${marketValue}&postalCode=${postalCode}&city=${city}&streetName=${streetName}&streetNumber=${streetNumber}&objectType=${objectType}&grossAnnualIncome=${grossAnnualIncome}&lang=${lang}&equity=${Equity}&startDate=${startDate}&mortgageAmount=${mortgageAmount}`;
    }
    window.open(url, '_blank');
    setTimeout(() => onClick(), 500);
  };

  const linkInfoKey4 = () => {
    let url = 'https://key4.ch/en/privacy-statement/';
    if (lang === 'it') url = 'https://key4.ch/it/privacy-statement/';
    if (lang === 'de') url = 'https://key4.ch/de/privacy-statement/';
    return url;
  };

  return (
    <div>
      {
        get(formValue, 'subtype', null) ? (
          <div className="max-w-fix-600 ml-a mr-a ta-c">
            <img src={financingMortgageImg} alt="Mortgage" />
            <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
              {translateTo('Get your mortgage offer on key4 by UBS.', lang)}
            </h2>
            <div className="max-w-fix-600 ml-a mr-a">
              <p>
                {translateTo('By clicking the button you allow us to send the following data to key4: property type, property address, type of residence (main type of residence), your equity capital, and your gross annual income. The Privacy Statement applicable to key4 can be found on the key4 website.', lang)}
              </p>
              <div className="max-w-fix-600 ml-a mr-a pos-r">
  
                <BrixelButtonIcon
                  className="backBtn pos-a-fix x-l-0 x-t-0"
                  icon="arrow-left-small"
                  onClick={() => onCloseGoBack()}
                  theme="light"
                  secondary
                />
                
                <BrixelButtonPrimary
                  className="mx-a mt-3"
                  rounded
                  label={translateTo('Show offers on key4', lang)}
                  rightIcon="arrow-right"
                  onClick={() => onRegisterKey4()}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {
              ((affordability < maxAffordability && loanToValueRatio < maxLoanRatio) || (get(formValue, 'affordabilityCheck', false) && get(formValue, 'loanValueCheck', false))) ? (
                <>
                  <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
                    {translateTo('Learn within 48 hours if you can afford your desired home.', lang)}
                  </h2>
                  <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100">
                    <div className="p-5">
                      <p className="fsize-500 txtDark700">
                        {translateTo('Please prepare the following documents to apply for your certificate:', lang)}
                      </p>
              
                      <div className="mt-3">
                        <div className="dis-f a-c">
                          <BrixelIcon
                            className="mr-2"
                            iconWidth="w-fix-32"
                            icon="page"
                            color="blue"
                          />
                          <p className="txtDark700">
                            {translateTo('Latest tax declaration', lang)}
                          </p>
                        </div>
                        <div className="dis-f a-c mt-3">
                          <BrixelIcon
                            className="mr-2"
                            iconWidth="w-fix-32"
                            icon="page"
                            color="blue"
                          />
                          <p className="txtDark700">
                            {translateTo('Latest proof of income, incl. proof of bonus if applicable', lang)}
                          </p>
                        </div>
                        <div className="dis-f a-c mt-3">
                          <BrixelIcon
                            className="mr-2"
                            iconWidth="w-fix-32"
                            icon="page"
                            color="blue"
                          />
                          <p className="txtDark700">
                            {translateTo('Pension fund statement', lang)}
                          </p>
                        </div>
                
                        <div className="dis-f a-c mt-3">
                          <BrixelIcon
                            className="mr-2"
                            iconWidth="w-fix-32"
                            icon="page"
                            color="blue"
                          />
                          <p className="dis-f flex-wrap a-c txtDark700">
                            <span>
                              {translateTo('Property exposé', lang)}
                            </span>
                            {
                              getSellerBrochure() && (
                                <a
                                  className="ml-small-4 txtDark700 td-u"
                                  href={`${baseByData.shortPath}${getSellerBrochure().path}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {translateTo('download here', lang)}
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
                      <span>{translateTo('By clicking the button you allow us to send the following data to key4: your offer price, property type, property address, type of residence (main type of residence), your equity capital, and your gross annual income. The Privacy Statement applicable to key4 can be found on the', lang)}</span>
                      <a
                        href={linkInfoKey4()}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-small-4 txtDark400 td-u mt-small-4-neg dis-ib"
                      >
                        <p className="fsize-300 txtDark700">{translateTo('key4 website', lang)}</p>
                      </a>
                    </p>
                    <BrixelButtonPrimary
                      className="mx-a mt-3"
                      rounded
                      label={translateTo('Register on key4', lang)}
                      rightIcon="arrow-right"
                      onClick={() => onRegisterKey4()}
                    />
            
                    {
                      get(formValue, 'company', null) !== 'ubs' && (
                        <p className="mt-3 fs-i txtDark400 fsize-200">
                          {translateTo('Please note that Brixel will be compensated for your referral when you conclude a mortgage with key4.', lang)}
                        </p>
                      )
                    }
                  </div>
                </>
              ) : (
                <>
                  <h2 className="fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6">
                    {translateTo('Unfortunately, your budget is not sufficient', lang)}
                  </h2>
                  <div className="max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100">
                    <div className="p-5">
                      <h5>
                        {translateTo('Based on the details you have provided, financing your dream home is not quite possible yet.', lang)}
                      </h5>
                    </div>
                  </div>
                </>
              )
            }
          </>
        )
      }
    </div>
  );
};

Key4Registration.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  activeSinglePropertyDocs: PropTypes.arrayOf(PropTypes.object).isRequired,
  formValue: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onCloseGoBack: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  activeSinglePropertyDocs: get(state, 'property.activeSingleProperty.documents', []),
  formValue: get(state, 'brixelForm.offerFlow.values', {}),
  lang: get(state, 'common.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser.user', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(Key4Registration);
