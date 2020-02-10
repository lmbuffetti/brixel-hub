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
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import Swiper from 'react-id-swiper';
import CompanyInfo from '@brixel/brixel-configuration-partner/src/CompanyInfo';
import { getToken, createUser } from '../../actions/UserActions';
import { getProperty, addProperty } from '../../actions/PropertyActions';
import { errorMessage } from '../../actions/CommonActions';
import Maps from '../../components/Map/Maps';


function Rewards(props) {
  // PROPS
  const {
    property
  } = props;
  // GET the current property
  useEffect(() => {
    if (props.match.params.propId) {
      const data = {
        id: props.match.params.propId,
      };
      props.handleGetPage(data)
    }
  }, []);

  useEffect(() => {
    if (property && property.id) {
      console.log('test', property);
    }
  }, [property]);

  return (
    <main id="rewards">
      <div className="container">
        <h1>Your local market check</h1>
        <p>Your local Market check shows you properties on the market with the same type (house/apartment) within a radius of 15km and a related living space.</p>
        {
          property && property.location && (
            <div>
              <div className="dis-f jc-b a-c">
                <p>{property.location.address}</p>
                <BrixelButtonPrimary
                  label="Order PDF"
                  onClick={() => ''}
                />
              </div>
              <div className="row">
                <div className="col-md-8">
                  <Maps
                    zoom={14}
                    scrollZoom
                    moveMarker
                    draggable
                    showMap
                    isShowZip={false}
                  />
                </div>
                <div className="col-md-4">
                  <h5>Similar Properties</h5>
                  <p></p>
                  <h5>Median Price</h5>
                  <p></p>
                  <h5>Median Price per m2</h5>
                  <p></p>
                  <h5>Median Living Sapce</h5>
                  <p></p>
                  <h5>Median Age</h5>
                  <p></p>
                  <h5>Median Time on MArket</h5>
                  <p></p>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </main>
  );
}

Rewards.propTypes = {
  changeFieldValue: PropTypes.func.isRequired,
  checkValid: PropTypes.func.isRequired,
  errorMsg: PropTypes.object.isRequired,
  errorValue: PropTypes.object,
  formValue: PropTypes.object,
  handleGetPage: PropTypes.func.isRequired,
  handleSetErrorMsg: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
  property: PropTypes.object,
  valid: PropTypes.bool,
};

Rewards.defaultProps = {
  errorMsg: {},
  errorValue: null,
  loggedUser: {},
  property: null,
};

const mapStateToProps = (state, props) => ({
  errorMsg: get(state, 'common.errorMsg', null),
  property: get(state, 'property.property', null),
  loggedUser: get(state, 'user.loggedUser', {}),
  valid: isValid('GetStarted')(state),
});
const mapDispatchToProps = (dispatch) => ({
  handleGetPage: bindActionCreators(getProperty, dispatch),
  handleCreatePage: bindActionCreators(addProperty, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Rewards);
