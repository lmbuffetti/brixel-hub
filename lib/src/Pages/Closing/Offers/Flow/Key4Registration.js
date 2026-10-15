import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonIcon, BrixelButtonPrimary, BrixelIcon } from '@brixel-io/brixel-components';
import translateTo from '../../../../utils/translation';
import { DateTime } from 'luxon';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { FinancialCalculator } from '@brixel-io/brixel-components/dist/utils/FinancialFormulas';
import financingMortgageImg from '../../../../images/offer-flow/financingMortgage.svg';
const Key4Registration = (props) => {
    const { activeSingleCompany, activeSingleProperty, activeSinglePropertyDocs, formValue, isTest, lang, loggedInUser, onClick, onCloseGoBack, } = props;
    // COUNTRY
    let lowCountry = get(formValue, 'propertyLocation.countryCode', '');
    lowCountry = lowCountry ? lowCountry.toLowerCase() : '';
    const [maxLoanRatio, setMaxLoanRatio] = useState(null);
    const [maxAffordability, setMaxAffordability] = useState(null);
    const affordability = get(formValue, 'affordability', 0);
    const loanToValueRatio = get(formValue, 'loanToValueRatio', 0);
    const price = get(formValue, 'amount', 0);
    useEffect(() => {
        const equityCapital = get(formValue, 'financeBuyer.equity', 0);
        const grossIncome = get(formValue, 'financeBuyer.income', 0);
        const fixedCost = 0;
        const cost = {
            equityCapital,
            income: grossIncome,
            fixedCost,
        };
        setMaxLoanRatio(FinancialCalculator(lowCountry, price, cost, '').maxLoanRatio);
        setMaxAffordability(FinancialCalculator(lowCountry, price, cost, '').maxAffordability);
    }, []);
    const getSellerBrochure = () => activeSinglePropertyDocs.find((itm) => itm.isBrochure);
    const onRegisterKey4 = () => {
        let riskProfile;
        let subtype = 'FINANCIAL_CERTIFICATE';
        if (get(formValue, 'subtype', null)) {
            subtype = get(formValue, 'subtype', '').toUpperCase();
        }
        else {
            riskProfile = 'BALANCED';
        }
        const channelType = 'Brixel';
        const useCase = 'NEW_HOME_BUYER';
        let campID = `Brixel-FinancialCertificate-CH-${lang}-BrixelPage-${activeSingleProperty.id}-${loggedInUser.id}`;
        if (activeSingleCompany.stub === 'ubs')
            campID = 'BRIXEL-BUYER-FINCER-CH-DEU';
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
        if (!isTest)
            window.open(url, '_blank');
        setTimeout(() => onClick(), 500);
    };
    const linkInfoKey4 = () => {
        let url = 'https://key4.ch/en/privacy-statement/';
        if (lang === 'it')
            url = 'https://key4.ch/it/privacy-statement/';
        if (lang === 'de')
            url = 'https://key4.ch/de/privacy-statement/';
        return url;
    };
    return (React.createElement("div", null, get(formValue, 'subtype', null) ? (React.createElement("div", { className: "max-w-fix-600 ml-a mr-a ta-c" },
        React.createElement("img", { src: financingMortgageImg, alt: "Mortgage" }),
        React.createElement("h2", { className: "fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6" }, translateTo('Get your mortgage offer on UBS key4 mortgages.', lang)),
        React.createElement("div", { className: "max-w-fix-600 ml-a mr-a" },
            React.createElement("p", null, translateTo('By clicking the button you allow us to send the following data to key4: property type, property address, type of residence (main type of residence), your equity capital, and your gross annual income. The Privacy Statement applicable to key4 can be found on the key4 website.', lang)),
            React.createElement("div", { className: "max-w-fix-600 ml-a mr-a pos-r" },
                React.createElement(BrixelButtonIcon, { className: "backBtn pos-a-fix x-l-0 x-t-0", icon: "arrow-left-small", onClick: () => onCloseGoBack(), theme: "text", themeSat: 300, ghost: true }),
                React.createElement(BrixelButtonPrimary, { className: "mx-a mt-3", rounded: true, label: translateTo('Show offers on key4', lang), rightIcon: "arrow-right", onClick: () => onRegisterKey4() }))))) : (React.createElement(React.Fragment, null, ((maxAffordability && maxLoanRatio && affordability < maxAffordability && loanToValueRatio < maxLoanRatio) || (get(formValue, 'affordabilityCheck', false) && get(formValue, 'loanValueCheck', false))) ? (React.createElement(React.Fragment, null,
        React.createElement("h2", { className: "fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6" }, translateTo('Learn within 48 hours if you can afford your desired home.', lang)),
        React.createElement("div", { className: "max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50" },
            React.createElement("div", { className: "p-5" },
                React.createElement("p", { className: "fsize-500 txtText900" }, translateTo('Please prepare the following documents to apply for your certificate:', lang)),
                React.createElement("div", { className: "mt-3" },
                    React.createElement("div", { className: "dis-f a-c" },
                        React.createElement(BrixelIcon, { className: "mr-2", iconWidth: "w-fix-32", icon: "page", color: "blue" }),
                        React.createElement("p", { className: "txtText900" }, translateTo('Latest tax declaration', lang))),
                    React.createElement("div", { className: "dis-f a-c mt-3" },
                        React.createElement(BrixelIcon, { className: "mr-2", iconWidth: "w-fix-32", icon: "page", color: "blue" }),
                        React.createElement("p", { className: "txtText900" }, translateTo('Latest proof of income, incl. proof of bonus if applicable', lang))),
                    React.createElement("div", { className: "dis-f a-c mt-3" },
                        React.createElement(BrixelIcon, { className: "mr-2", iconWidth: "w-fix-32", icon: "page", color: "blue" }),
                        React.createElement("p", { className: "txtText900" }, translateTo('Pension fund statement', lang))),
                    React.createElement("div", { className: "dis-f a-c mt-3" },
                        React.createElement(BrixelIcon, { className: "mr-2", iconWidth: "w-fix-32", icon: "page", color: "blue" }),
                        React.createElement("p", { className: "dis-f flex-wrap a-c txtText900" },
                            React.createElement("span", null, translateTo('Property exposé', lang)),
                            getSellerBrochure()?.path && (React.createElement("a", { className: "ml-small-4 txtText900 td-u", href: `${baseByData?.shortPath}${getSellerBrochure()?.path}`, target: "_blank", rel: "noreferrer" }, translateTo('download here', lang)))))))),
        React.createElement("div", { className: "max-w-fix-600 mx-a mt-3" },
            React.createElement("p", { className: "fsize-300 txtText900" },
                React.createElement("span", null, translateTo('By clicking the button you allow us to send the following data to key4: your offer price, property type, property address, type of residence (main type of residence), your equity capital, and your gross annual income. The Privacy Statement applicable to key4 can be found on the', lang)),
                React.createElement("a", { href: linkInfoKey4(), target: "_blank", rel: "noreferrer", className: "ml-small-4 txtText700 td-u mt-small-4-neg dis-ib" },
                    React.createElement("p", { className: "fsize-300 txtText900" }, translateTo('key4 website', lang)))),
            React.createElement(BrixelButtonPrimary, { className: "mx-a mt-3", rounded: true, label: translateTo('Register on key4', lang), rightIcon: "arrow-right", onClick: () => onRegisterKey4() }),
            get(formValue, 'company', null) !== 'ubs' && (React.createElement("p", { className: "mt-3 fs-i txtText700 fsize-200" }, translateTo('Please note that Brixel will be compensated for your referral when you conclude a mortgage with key4.', lang)))))) : (React.createElement(React.Fragment, null,
        React.createElement("h2", { className: "fweight-600 max-w-fix-464 ta-c m-a mb-3 fsize-600 fsize-sm-800 mb-sm-6" }, translateTo('Unfortunately, your budget is not sufficient', lang)),
        React.createElement("div", { className: "max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50" },
            React.createElement("div", { className: "p-5" },
                React.createElement("h5", null, translateTo('Based on the details you have provided, financing your dream home is not quite possible yet.', lang))))))))));
};
const mapStateToProps = (state) => ({
    activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
    activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
    activeSinglePropertyDocs: get(state, 'property.activeSingleProperty.documents', []),
    formValue: get(state, 'brixelForm.offerFlow.values', {}),
    isTest: get(state, 'common.isTest', false),
    lang: get(state, 'common.language', 'en'),
    loggedInUser: get(state, 'user.loggedInUser.user', {}),
});
export default compose(connect(mapStateToProps, null))(Key4Registration);
