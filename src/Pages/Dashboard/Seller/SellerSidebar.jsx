/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  BrixelIcon,
  BrixelButtonPrimary,
  ProgressRing,
  BrixelProgressBar,
} from '@brixel/brixel-components';
// import Support from '../../../components/Support';
// import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';

const SellerSidebar = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    userTypes,
    windowDimensions,
  } = props;

  return (
    <div className="seller-sidebar w-perc-100 max-w-fix-368 p-3">
      <span className="txtDark700">Your Progress: <span className="fweight-600">Onboarding</span></span>
      <div className="progress-steps dis-f">
        <span className="liner" />
        <div className="step-item active">
          <span>1</span>
        </div>
        <div className="step-item">
          <span>2</span>
        </div>
        <div className="step-item">
          <span>3</span>
        </div>
        <div className="step-item">
          <span>4</span>
        </div>
        <div className="step-item">
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

SellerSidebar.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  userTypes: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
};

SellerSidebar.defaultProps = {
  userTypes: 'user',
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  formValue: get(state, 'brixelForm.Property.values', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  language: get(state, 'user.loggedInUser.user.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  userTypes: get(state, 'user.userTypes', null),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps),
)(SellerSidebar);
