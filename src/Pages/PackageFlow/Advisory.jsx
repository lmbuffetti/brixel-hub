import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import { change, isValid, Field, reduxForm } from 'redux-form';
import { BrixelButtonPrimary, BrixelCheckbox, BrixelInputText, Validation } from '@brixel/brixel-components';
import Swiper from 'react-id-swiper';
import CompanyInfo from '@brixel/brixel-configuration-partner/src/CompanyInfo';
import { getToken, createUser } from '../../actions/UserActions';
import { getProperty, addProperty, getMarketCheck, updateProperty } from '../../actions/PropertyActions';
import { errorMessage, sendGenericMail } from '../../actions/CommonActions';
import Maps from '../../components/Map/Maps';
import * as moment from 'moment';
import ChartDonuts from '../../components/Charts/ChartDonuts';
import RangePriceChart from '../../components/Charts/RangePriceChart';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

function Advisory(props) {


  return (
    <main id="advisory">
      <div className="container">
        Advisory
      </div>
    </main>
  );
}

Advisory.propTypes = {
  handleGetMarketData: PropTypes.func.isRequired,
  handleGetPage: PropTypes.func.isRequired,
  handleSendGenericMail: PropTypes.func.isRequired,
  handleSetErrorMsg: PropTypes.func.isRequired,
  handleUpdatePage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
  match: PropTypes.object.isRequired,
  marketData: PropTypes.object,
  property: PropTypes.object,
  valid: PropTypes.bool,
};

Advisory.defaultProps = {
  errorMsg: {},
  errorValue: null,
  loggedUser: {},
  marketData: null,
  property: null,
};

const mapStateToProps = (state, props) => ({
  errorMsg: get(state, 'common.errorMsg', null),
  property: get(state, 'property.property', null),
  loggedUser: get(state, 'user.loggedUser', {}),
  marketData: get(state, 'property.marketCheck', {}),
  valid: isValid('GetStarted')(state),
});
const mapDispatchToProps = (dispatch) => ({
  handleGetPage: bindActionCreators(getProperty, dispatch),
  handleGetMarketData: bindActionCreators(getMarketCheck, dispatch),
  handleCreatePage: bindActionCreators(addProperty, dispatch),
  handleSendGenericMail: bindActionCreators(sendGenericMail, dispatch),
  handleUpdatePage: bindActionCreators(updateProperty, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Advisory);
