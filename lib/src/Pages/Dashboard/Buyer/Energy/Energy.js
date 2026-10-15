import React from 'react';
import { connect } from 'react-redux';
import translateTo from '../../../../utils/translation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BrixelButtonPrimary, BrixelButtonSecondary } from '@brixel-io/brixel-components';
import BrixelEnergyCertificate from '@brixel-io/brixel-components/dist/components/BrixelEnergyCertificate';
import get from 'lodash/get';
import SectionMobileTitle from '../../../../components/SectionMobileTitle';
import LogoNormImg from '../../../../images/EnergyCertificate/logoNorm.png';
import EnergyCertificateImgEn from '../../../../images/EnergyCertificate/energy-certificate-en.png';
import EnergyCertificateImgDe from '../../../../images/EnergyCertificate/energy-certificate-de.png';
import EnergyCertificateImgFr from '../../../../images/EnergyCertificate/energy-certificate-fr.png';
import EnergyCertificateImgIt from '../../../../images/EnergyCertificate/energy-certificate-it.png';
import EnergyCertificatePdfEn from '../../../../images/EnergyCertificate/performance-certificate-en.pdf';
import EnergyCertificatePdfDe from '../../../../images/EnergyCertificate/performance-certificate-de.pdf';
import EnergyCertificatePdfFr from '../../../../images/EnergyCertificate/performance-certificate-fr.pdf';
import EnergyCertificatePdfIt from '../../../../images/EnergyCertificate/performance-certificate-it.pdf';
import BrixelSmartBanner from '@brixel-io/brixel-components/dist/components/BrixelSmartBanner';
const EnergieCertificate = ({ activeSingleProperty, activeSingleCompany, windowDimensions, lang, }) => {
    const history = {
        push: useNavigate(),
        location: useLocation(),
    };
    const match = useParams();
    const propID = get(match, 'propID', null);
    if (activeSingleCompany?.stub && activeSingleCompany?.stub !== 'ubs')
        history.push(`/buyer/${propID}/home`);
    const EfficiencyValue = activeSingleProperty?.properties?.energy?.totalEnergyEfficiency;
    const EnergyImg = () => {
        switch (lang) {
            case 'de':
                return EnergyCertificateImgDe;
            case 'fr':
                return EnergyCertificateImgFr;
            case 'it':
                return EnergyCertificateImgIt;
            default:
                return EnergyCertificateImgEn;
        }
    };
    const EnergyPdf = () => {
        let certificateUrl = EnergyCertificatePdfEn;
        switch (lang) {
            case 'de':
                certificateUrl = EnergyCertificatePdfDe;
                break;
            case 'fr':
                certificateUrl = EnergyCertificatePdfFr;
                break;
            case 'it':
                certificateUrl = EnergyCertificatePdfIt;
                break;
            default:
                certificateUrl = EnergyCertificatePdfEn;
                break;
        }
        window.open(certificateUrl, '_blank');
    };
    return (React.createElement("div", { className: "max-w-fix-1024 dis-fl-col pr-md-2" },
        React.createElement("h3", { className: "mb-1 hide dis-b-lg fweight-600" }, translateTo('Energy', lang)),
        React.createElement("p", { className: 'hide dis-b-lg fsize-600 mb-3' }, translateTo('Based on the indicative energy class, this property has renovation potential.', lang)),
        React.createElement("div", { className: "dis-f h-perc-lg-100 hide-lg" },
            React.createElement("div", { className: "dis-fl-col w-perc-100 h-perc-lg-100 mb-2" },
                React.createElement(SectionMobileTitle, { title: "Energy" }),
                React.createElement("p", { className: 'fsize-400' }, translateTo('Based on the indicative energy class, this property has renovation potential.', lang)))),
        React.createElement("div", { className: "engBg brdRadius mb-3 ov-h" },
            EfficiencyValue && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "p-md-3 p-0 mb-3" },
                    React.createElement("div", { className: "dis-f jc-b a-c mb-2 mb-sm-3 p-1" },
                        React.createElement("div", { className: "dis-f fweight-600" },
                            React.createElement("span", null, translateTo('Energy class', lang)),
                            React.createElement("span", { className: 'pl-small-4' }, EfficiencyValue))),
                    React.createElement(BrixelEnergyCertificate, { value: EfficiencyValue, lang: lang })),
                React.createElement("hr", { className: 'brdText100' }))),
            React.createElement("div", { className: "dis-fl-row-md jc-fe a-c my-3 hide mr-3" },
                React.createElement("p", { className: "fsize-200 txtText400 ml-1 mr-2" }, translateTo('Powered by', lang)),
                React.createElement("div", { className: "max-w-fix-80" },
                    React.createElement("img", { src: LogoNormImg, alt: "Logo Norm" }))),
            React.createElement("div", { className: "px-md-4 py-md-4 py-4" },
                React.createElement("p", { className: "fSizePx20 fweight-600" }, translateTo('The offer: verified energy performance certificate with individual renovation roadmap, digital and efficient.', lang))),
            React.createElement("img", { src: EnergyImg(), alt: "Energy Certificate", className: "hide max-w-perc-90 dis-b-md mx-a" }),
            React.createElement("div", { className: "px-md-3 pb-3" },
                React.createElement("div", { className: "dis-f-md jc-b a-t" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "dis-f a-c" },
                            React.createElement("span", { className: "fsize-600 fsize-sm-700 fweight-600" }, "CHF 1'190"),
                            React.createElement("span", { className: "fsize-300 pl-1" }, "incl. VAT")),
                        React.createElement("p", { className: "my-2 fsize-500" },
                            React.createElement("span", { className: "td-lt" }, translateTo('CHF 1\'550', lang)),
                            " ",
                            React.createElement("span", null, translateTo('Reduced price for UBS clients', lang))),
                        React.createElement("div", { className: "" },
                            React.createElement(BrixelButtonPrimary, { rightIcon: "arrow-right", className: "no-wrap ws-nw mr-md-2 as-fs mb-2 mb-lg-0", rounded: true, fullWidth: windowDimensions.width <= 600, label: translateTo('Order energy report', lang), onClick: () => history.push(`/buyer/${propID}/energy/energyFlow`) }),
                            React.createElement(BrixelButtonSecondary, { rounded: true, className: "no-wrap ws-nw as-fs mt-2", rightIcon: "document", fullWidth: windowDimensions.width <= 600, label: translateTo('View example', lang), onClick: () => EnergyPdf() }))),
                    React.createElement("img", { src: EnergyImg(), alt: "Energy Certificate", className: "hide-md min-w-fix-800 mt-2" }),
                    React.createElement("div", null,
                        React.createElement("p", { className: "fweight-600 mb-2" }, translateTo('Your advantages', lang)),
                        React.createElement("ul", { className: "checkList fsize-400 green" },
                            React.createElement("li", null, translateTo('Energy analysis of the property by energy experts', lang)),
                            React.createElement("li", null, translateTo('Detailed refurbishment plan', lang)),
                            React.createElement("li", null, translateTo('Construction cost estimates and subsidy calculations', lang)),
                            React.createElement("li", null, translateTo('Determining the savings potential for energy costs', lang)))))),
            React.createElement("div", { className: "dis-f a-c hide-md pl-md-2 pb-2" },
                React.createElement("p", { className: "fsize-200 txtText400 ml-1 mr-2" }, translateTo('Powered by', lang)),
                React.createElement("img", { src: LogoNormImg, alt: "Logo Norm", width: 90 }))),
        React.createElement(BrixelSmartBanner, { showDisclaimerAsterisk: true, className: "mt-2", activeSingleProperty: activeSingleProperty, companyStub: activeSingleCompany.stub, isPartner: true, lang: lang, theme: "primary", isPlacemenDynamicMortgage: true })));
};
const mapStateToProps = (state) => ({
    activeSingleProperty: state?.property?.activeSingleProperty || {},
    activeSingleCompany: state?.companies?.activeSingleCompany || {},
    windowDimensions: get(state, 'common.windowDimensions', {}),
    lang: state?.common?.language || 'en',
});
export default connect(mapStateToProps, null)(EnergieCertificate);
