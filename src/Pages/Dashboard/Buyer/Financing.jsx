/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  change,
  reset,
  FinancingCalculator,
} from '@brixel/brixel-components';
import { setModal } from '../../../actions/CommonActions';

const Financing = (props) => {
  const {
    activeSingleProperty,
    handleSetModal,
  } = props;
  return (
    <>
      <h3 className="mb-3 hide dis-b-lg">Financing</h3>
      <div className="dis-f h-perc-lg-100">
        <div className="dis-fl-col w-perc-100 h-perc-lg-100">
          <div className="dis-fl-col backPanel hide-lg">
            <h5 className="sectionTitle">Financing</h5>
          </div>
          <div>
            {
              activeSingleProperty.id && (
                <FinancingCalculator
                  country={get(activeSingleProperty, 'location.countryCode', '')}
                  propertyPrice={get(activeSingleProperty, 'status', null) === 'on-sale' ? get(activeSingleProperty, 'price.total', 0) : null}
                  currency={get(activeSingleProperty, 'price.currency', 0)}
                  project="hub"
                  offerURL={`/buyer/${activeSingleProperty.id}/closing`}
                  onOpenModal={(text) => handleSetModal(text)}
                  openParentModal
                  className="max-w-fix-912"
                />
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

Financing.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  handleSetModal: PropTypes.func.isRequired,
};

Financing.defaultProps = {
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
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
