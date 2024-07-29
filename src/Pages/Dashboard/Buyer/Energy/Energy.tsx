import React from 'react';
import {connect} from 'react-redux';
import translateTo from '../../../../utils/translation';
import {CompanyType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {BrixelButtonPrimary, BrixelButtonSecondary} from '@brixel-io/brixel-components'
import BrixelEnergyCertificate from '@brixel-io/brixel-components/dist/components/BrixelEnergyCertificate';
import get from 'lodash/get';
import SectionMobileTitle from '../../../../components/SectionMobileTitle';
import LogoNormImg from '../../../../images/EnergyCertificate/logoNorm.jpg'
import EnergyCertificateImgEn from '../../../../images/EnergyCertificate/energy-certificate-en.jpeg'
import EnergyCertificateImgDe from '../../../../images/EnergyCertificate/energy-certificate-de.jpeg'
import EnergyCertificateImgFr from '../../../../images/EnergyCertificate/energy-certificate-fr.jpeg'
import EnergyCertificateImgIt from '../../../../images/EnergyCertificate/energy-certificate-it.jpeg'
import EnergyCertificatePdfEn from '../../../../images/EnergyCertificate/performance-certificate-en.pdf'
import EnergyCertificatePdfDe from '../../../../images/EnergyCertificate/performance-certificate-de.pdf'
import EnergyCertificatePdfFr from '../../../../images/EnergyCertificate/performance-certificate-Fr.pdf'
import EnergyCertificatePdfIt from '../../../../images/EnergyCertificate/performance-certificate-it.pdf'
import BrixelSmartBanner from '@brixel-io/brixel-components/dist/components/BrixelSmartBanner';

type EnergieCertificateProps = {
  activeSingleProperty: PropertyType
  activeSingleCompany: CompanyType
  lang: string;
}

const EnergieCertificate = ({
  activeSingleProperty,
  activeSingleCompany,
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
    <div className="max-w-fix-1024">
      <h3 className="mb-3 hide dis-b-lg fweight-600">
        {translateTo('Energy', lang)}
      </h3>
      <div className="dis-f h-perc-lg-100">
        <div className="dis-fl-col w-perc-100 h-perc-lg-100">
          <SectionMobileTitle
            title="Energy"
          />
        </div>
      </div>

      <div className="bgWhite">
        {
          EfficiencyValue && (
            <>
              <div className="p-3">
                <div className="dis-f jc-b a-c mb-3">
                  <h6 className="fweight-600">
                    {translateTo('Energy class', lang)}
                  </h6>
                  <div className="dis-f a-c">
                    <p className="fsize-200 txtText400 ml-1">
                      {translateTo('Powered by', lang)}
                    </p>
                    <img src={LogoNormImg} alt="Logo Norm" width={90} />
                  </div>
                </div>
                <BrixelEnergyCertificate
                  value={EfficiencyValue}
                  lang={lang}
                />
              </div>
              <hr />
            </>
          )
        }

        <div className="p-3">
          <h5 className="fweight-600">
            {translateTo('The offer: verified energy performance certificate with individual renovation roadmap, digital and efficient.', lang)}
          </h5>

          <img src={EnergyImg()} alt="Energy Certificate" />
        </div>

        <div className="p-3">
          <div className="dis-f jc-b a-t">
            <div>
              <div className="dis-f a-c mt-2">
                <span className='fsize-500 fsize-sm-600 fweight-600'>CHF 1&apos;550</span>
                <span className='fsize-300 pl-1'>incl. VAT</span>
              </div>
              <p className='my-2'>
                {translateTo('CHF 1\'190 Reduced price for UBS clients', lang)}
              </p>

              <div className="">
                <BrixelButtonPrimary
                  rightIcon="arrow-right"
                  className="no-wrap ws-nw mr-2 as-fs mb-2 mb-lg-0"
                  rounded
                  label={translateTo('Order energy report', lang)}
                  onClick={() => history.push(`/buyer/${propID}/energy/energyFlow`)}
                />
                <BrixelButtonSecondary
                  rounded
                  className="no-wrap ws-nw as-fs mt-2"
                  rightIcon="document"
                  label={translateTo('View exmple', lang)}
                  onClick={() => EnergyPdf()}
                />
              </div>
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
          </div>
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
  lang: state?.common?.language || 'en',
});

export default connect(mapStateToProps, null)(EnergieCertificate);
