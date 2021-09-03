/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  change,
  reset,
  FinancingCalculator,
} from '@brixel/brixel-components';
import { updatePublishedReview } from '../../../actions/PropertyActions';
import { addGameHistory } from '../../../actions/GamificationActions';

const Financing = (props) => {
  const {
    activeSingleProperty,
  } = props;
  return (
    <>
      <h3 className="mb-3 hide dis-b-lg">Financing</h3>
      <div className="dis-f h-perc-lg-100">
        <div className="secondLevel dis-fl-col w-perc-100 h-perc-lg-100">
          <div className="dis-fl-col backPanel hide-lg">
            <h5 className="sectionTitle">Financing</h5>
          </div>
          <div>
            {
              activeSingleProperty.id && (
                <FinancingCalculator
                  country={get(activeSingleProperty, 'location.countryCode', '')}
                  propertyPrice={get(activeSingleProperty, 'price.total', 0)}
                  currency={get(activeSingleProperty, 'price.currency', 0)}
                  project="hub"
                  offerURL={`/buyer/${activeSingleProperty.id}/closing`}
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
  handleUpdatePublishedReview: bindActionCreators(updatePublishedReview, dispatch),
  handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Financing);
