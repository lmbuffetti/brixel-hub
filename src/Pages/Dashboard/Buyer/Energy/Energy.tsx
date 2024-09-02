import React from 'react';
import {connect} from 'react-redux';
import translateTo from '../../../../utils/translation';
import {CompanyType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {BrixelButtonPrimary, BrixelButtonSecondary} from '@brixel-io/brixel-components'
import BrixelEnergyCertificate from '@brixel-io/brixel-components/dist/components/BrixelEnergyCertificate';
import get from 'lodash/get';
import SectionMobileTitle from '../../../../components/SectionMobileTitle';
import LogoNormImg from '../../../../images/EnergyCertificate/logoNorm.png'
import EnergyCertificateImgEn from '../../../../images/EnergyCertificate/energy-certificate-en.png'
import EnergyCertificateImgDe from '../../../../images/EnergyCertificate/energy-certificate-de.png'
import EnergyCertificateImgFr from '../../../../images/EnergyCertificate/energy-certificate-fr.png'
import EnergyCertificateImgIt from '../../../../images/EnergyCertificate/energy-certificate-it.png'
import EnergyCertificatePdfEn from '../../../../images/EnergyCertificate/performance-certificate-en.pdf'
import EnergyCertificatePdfDe from '../../../../images/EnergyCertificate/performance-certificate-de.pdf'
import EnergyCertificatePdfFr from '../../../../images/EnergyCertificate/performance-certificate-fr.pdf'
import EnergyCertificatePdfIt from '../../../../images/EnergyCertificate/performance-certificate-it.pdf'
import BrixelSmartBanner from '@brixel-io/brixel-components/dist/components/BrixelSmartBanner';

type EnergieCertificateProps = {
  activeSingleProperty: PropertyType
  activeSingleCompany: CompanyType
  lang: string;
  windowDimensions: {
    height: number;
    width: number;
  };
}

const EnergieCertificate = ({
  activeSingleProperty,
  activeSingleCompany,
  windowDimensions,
  lang,
}: EnergieCertificateProps) => {

  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  const propID = get(match, 'propID', null);
  if (activeSingleCompany?.stub && activeSingleCompany?.stub !== 'ubs') history.push(`/buyer/${propID}/home`)
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
  }

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
    window.open(certificateUrl, '_blank')
  }

  return (
    <div className="max-w-fix-1024 dis-fl-col pr-md-2">
      <h3 className="mb-1 hide dis-b-lg fweight-600">
        {translateTo('Energy', lang)}
      </h3>
      <p className='hide dis-b-lg fsize-600 mb-3'>
        {translateTo('Based on the indicative energy class, this property has renovation potential.', lang)}
      </p>
      <div className="dis-f h-perc-lg-100 hide-lg">
        <div className="dis-fl-col w-perc-100 h-perc-lg-100 mb-2">
          <SectionMobileTitle
            title="Energy"
          />
          <p className='fsize-400'>
            {translateTo('Based on the indicative energy class, this property has renovation potential.', lang)}
          </p>
        </div>
      </div>

      <div className="engBg brdRadius mb-3 ov-h">
        {
          EfficiencyValue && (
            <>
              <div className="p-md-3 p-0 mb-3">
                <div className="dis-f jc-b a-c mb-2 mb-sm-3 p-1">
                  <div className="dis-f fweight-600">
                    <span>
                      {translateTo('Energy class', lang)}
                    </span>
                    <span className='pl-small-4'>
                      {EfficiencyValue}
                    </span>
                  </div>
                </div>
                <BrixelEnergyCertificate
                  value={EfficiencyValue}
                  lang={lang}
                />
              </div>
              <hr className='brdText100' />
            </>
          )
        }

        <div className="dis-fl-row-md jc-fe a-c my-3 hide mr-3">
          <p className="fsize-200 txtText400 ml-1 mr-2">
            {translateTo('Powered by', lang)}
          </p>
          <div className="max-w-fix-80">
            <img src={LogoNormImg} alt="Logo Norm" />
          </div>
        </div>

        <div className="px-md-4 py-md-4 py-4">
          <p className="fSizePx20 fweight-600">
            {translateTo('The offer: verified energy performance certificate with individual renovation roadmap, digital and efficient.', lang)}
          </p>
        </div>

        <img src={EnergyImg()} alt="Energy Certificate" className="hide max-w-perc-90 dis-b-md mx-a" />

        <div className="px-md-3 pb-3">
          <div className="dis-f-md jc-b a-t">
            <div>
              <div className="dis-f a-c">
                <span className="fsize-600 fsize-sm-700 fweight-600">CHF 1&apos;190</span>
                <span className="fsize-300 pl-1">incl. VAT</span>
              </div>
              <p className="my-2 fsize-500">
                <span className="td-lt">{translateTo('CHF 1\'550', lang)}</span> <span>{translateTo('Reduced price for UBS clients', lang)}</span>
              </p>

              <div className="">
                <BrixelButtonPrimary
                  rightIcon="arrow-right"
                  className="no-wrap ws-nw mr-md-2 as-fs mb-2 mb-lg-0"
                  rounded
                  fullWidth={windowDimensions.width <= 600 }
                  label={translateTo('Order energy report', lang)}
                  onClick={() => history.push(`/buyer/${propID}/energy/energyFlow`)}
                />
                <BrixelButtonSecondary
                  rounded
                  className="no-wrap ws-nw as-fs mt-2"
                  rightIcon="document"
                  fullWidth={windowDimensions.width <= 600 }
                  label={translateTo('View example', lang)}
                  onClick={() => EnergyPdf()}
                />
              </div>
            </div>
            <img
              src={EnergyImg()}
              alt="Energy Certificate"
              className="hide-md min-w-fix-800 mt-2"
            />
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
          </div>
        </div>

        <div className="dis-f a-c hide-md pl-md-2 pb-2">
          <p className="fsize-200 txtText400 ml-1 mr-2">
            {translateTo('Powered by', lang)}
          </p>
          <img src={LogoNormImg} alt="Logo Norm" width={90} />
        </div>

      </div>


      <BrixelSmartBanner
        showDisclaimerAsterisk
        className="mt-2"
        activeSingleProperty={activeSingleProperty}
        companyStub={activeSingleCompany.stub}
        isPartner
        lang={lang}
        theme="primary"
        isPlacemenDynamicMortgage
      />

    </div>
  )
}

const mapStateToProps = (state) => ({
  activeSingleProperty: state?.property?.activeSingleProperty || {},
  activeSingleCompany: state?.companies?.activeSingleCompany || {},
  windowDimensions: get(state, 'common.windowDimensions', {}),
  lang: state?.common?.language || 'en',
});

export default connect(mapStateToProps, null)(EnergieCertificate);
