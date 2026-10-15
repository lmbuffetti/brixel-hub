import React from 'react';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { FinancingCalculator } from '@brixel-io/brixel-components';
import translateTo from '../../../utils/translation';
import { change, reset } from '@brixel-io/brixel-components/dist/form';
import { setModal } from '../../../actions/CommonActions';
import SectionMobileTitle from '../../../components/SectionMobileTitle';
import BannerBox from '../../../components/CraftCMS/BannerBox';
import BrixelSmartBanner from '@brixel-io/brixel-components/dist/components/BrixelSmartBanner';
const Financing = (props) => {
    const { activeSingleCompany, activeSingleProperty, handleSetModal, lang, } = props;
    return (React.createElement(React.Fragment, null,
        React.createElement("h3", { className: "mb-3 hide dis-b-lg  fweight-600" }, translateTo('Financing', lang)),
        React.createElement("div", { className: "dis-f h-perc-lg-100" },
            React.createElement("div", { className: "dis-fl-col w-perc-100 h-perc-lg-100" },
                React.createElement(SectionMobileTitle, { title: "Financing" }),
                React.createElement("div", null,
                    activeSingleProperty.id && (React.createElement(FinancingCalculator, { country: get(activeSingleProperty, 'location.countryCode', ''), propertyPrice: get(activeSingleProperty, 'status', null) === 'on-sale' ? get(activeSingleProperty, 'price.total', 0) : 0, currency: get(activeSingleProperty, 'price.currency', ''), project: "hub", offerURL: `/buyer/${activeSingleProperty.id}/offer`, onOpenModal: (text) => handleSetModal(text), openParentModal: true, className: "w-perc-100", lang: lang })),
                    get(activeSingleCompany, 'stub', '') === 'ubs' && (React.createElement("span", { className: 'dis-b mt-5 fsize-600-md fweight-600 fSizePx20' }, translateTo('Services and offers from our financial partner UBS', lang))),
                    activeSingleCompany.stub && (React.createElement(BrixelSmartBanner, { showDisclaimerAsterisk: true, className: "mt-2", activeSingleProperty: activeSingleProperty, companyStub: activeSingleCompany.stub, isPartner: true, lang: lang, theme: "primary", isPlacemenDynamicMortgage: true })),
                    React.createElement("div", { className: "dis-fl-row-md dis-fl-col" },
                        React.createElement(BannerBox, { activeSingleCompany: activeSingleCompany, className: "mt-2 mr-md-1 dis-f", lang: lang, placementSlug: "buyer-hub-financing-banner" }),
                        React.createElement(BannerBox, { activeSingleCompany: activeSingleCompany, className: "mt-2 ml-md-1 dis-f", lang: lang, placementSlug: "buyer-hub-financing-banner-two" })),
                    get(activeSingleCompany, 'stub', '') === 'ubs' && (React.createElement("p", { className: 'fsize-200 txtText400 mt-2' }, translateTo('* The products offered on the UBS website are exclusively intended for and available to persons resident in Switzerland.', lang))))))));
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
export default compose(connect(mapStateToProps, mapDispatchToProps))(Financing);
