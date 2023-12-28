import React from 'react';
import get from 'lodash/get';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {FinancingCalculator} from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import {change, reset} from '@brixel-io/brixel-components/dist/form';
import {setModal} from '../../../actions/CommonActions';
import type {FinancingType} from '../../../@types/Pages/Dashboard/Buyer/Financing';
import SectionMobileTitle from '../../../components/SectionMobileTitle';
import BannerBox from '../../../components/CraftCMS/BannerBox';
import BrixelSmartBanner from '@brixel-io/brixel-components/dist/components/BrixelSmartBanner';

const Financing = (props: FinancingType) => {
  const {
    activeSingleCompany,
    activeSingleProperty,
    handleSetModal,
    lang,
  } = props;
  return (
    <>
      <h3 className="mb-3 hide dis-b-lg  fweight-600">{translateTo('Financing', lang)}</h3>
      <div className="dis-f h-perc-lg-100">
        <div className="dis-fl-col w-perc-100 h-perc-lg-100">
          <SectionMobileTitle
            title="Financing"
          />
          <div>
            {
              activeSingleProperty.id && (
                <FinancingCalculator
                  country={get(activeSingleProperty, 'location.countryCode', '')}
                  propertyPrice={get(activeSingleProperty, 'status', null) === 'on-sale' ? get(activeSingleProperty, 'price.total', 0) : 0}
                  currency={get(activeSingleProperty, 'price.currency', '')}
                  project="hub"
                  offerURL={`/buyer/${activeSingleProperty.id}/closing`}
                  onOpenModal={(text) => handleSetModal(text)}
                  openParentModal
                  className="w-perc-100"
                  lang={lang}
                />
              )
            }

            {
              get(activeSingleCompany, 'stub', '') === 'ubs' && (
                <span className='dis-b mt-5 fsize-600-md fweight-600 fSizePx20'>
                  {translateTo('Services and offers from our financial partner UBS', lang)}
                </span>
              )
            }

            {
              activeSingleCompany.stub && (
                <BrixelSmartBanner
                  className="mt-2"
                  activeSingleProperty={activeSingleProperty}
                  companyStub={activeSingleCompany.stub}
                  isPartner
                  lang={lang}
                  theme="primary"
                  isPlacemenDynamicMortgage
                />
              )
            }

            <div className="dis-fl-row-md dis-fl-col">

              <BannerBox
                activeSingleCompany={activeSingleCompany}
                className="mt-2 mr-md-1 dis-f"
                lang={lang}
                placementSlug="buyer-hub-financing-banner"
              />
              <BannerBox
                activeSingleCompany={activeSingleCompany}
                className="mt-2 ml-md-1 dis-f"
                lang={lang}
                placementSlug="buyer-hub-financing-banner-two"
              />
            </div>

            {
              get(activeSingleCompany, 'stub', '') === 'ubs' && (
                <p className='fsize-200 txtText400 mt-2'>{translateTo('* The products offered on the UBS website are exclusively intended for and available to persons resident in Switzerland.', lang)}</p>
              )
            }

          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  lang: get(state, 'common.language', 'en'),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(field, value) {
    dispatch(change('Property', field, value));
  },
  reset(form, data) {
    (dispatch(reset(form, data)));
  },
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Financing);
