import React from 'react';
import get from 'lodash/get';
import {bindActionCreators, compose} from 'redux';
import {connect} from 'react-redux';
import {FinancingCalculator} from '@brixel/brixel-components';
import translateTo from '../../../utils/translation';
import {change, reset} from '@brixel/brixel-components/dist/form';
import {setModal} from '../../../actions/CommonActions';
import type {FinancingType} from '../../../@types/Pages/Dashboard/Buyer/Financing';

const Financing = (props: FinancingType) => {
  const {
    activeSingleProperty,
    handleSetModal,
    lang,
  } = props;
  return (
    <>
      <h3 className="mb-3 hide dis-b-lg">{translateTo('Financing', lang)}</h3>
      <div className="dis-f h-perc-lg-100">
        <div className="dis-fl-col w-perc-100 h-perc-lg-100">
          <div className="dis-fl-col backPanel hide-lg">
            <h5 className="sectionTitle">{translateTo('Financing', lang)}</h5>
          </div>
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
                  className="max-w-fix-912"
                  lang={lang}
                />
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
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
