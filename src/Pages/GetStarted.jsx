import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import {
  withRouter,
} from 'react-router-dom';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, FactsOptions } from '@brixel/brixel-components';
import Swiper from 'react-id-swiper';
import { getToken } from '../actions/UserActions';
import { errorMessage } from '../actions/CommonActions';
import Maps from '../components/Map/Maps';

function GetStarted(props) {
  const { factsOptions } = FactsOptions;

  const {
    errorMsg, formValue, handleGetToken, handleSetErrorMsg, history,
  } = props;

  const params = {
    direction: 'vertical',
    history: {
      key: '/packageFlow/getstarted/',
      replaceState: true,
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    },
    spaceBetween: 30,

  };

  return (
    <main id="getStarted">
      <Swiper {...params}>
        <div data-history="propertyType">
          <h3>What do you want to sell?</h3>
          <Field
            className="mb-2"
            name="propertyType"
            label="Property Type"
            component={BrixelRadioButton}
            options={factsOptions.propertyType}
            deactivable={false}
          />
        </div>
        <div data-history="allRooms">
          <Field
            className="mb-2"
            name="bedrooms"
            label="Number of rooms"
            component={BrixelInputStepNumber}
            step={0.5}
          />
          <Field
            className="mb-2"
            name="bathrooms"
            label="Number of bathrooms"
            component={BrixelInputStepNumber}
            step={1}
          />
          <Field
            className="mb-2"
            name="separateToilets"
            label="MNumber of separate toilets"
            component={BrixelInputStepNumber}
            step={1}
          />
        </div>
        <div data-history="livingSpace">
          <Field
            className="mb-2"
            name="properties.typology.livingArea.value"
            label="Living space"
            component={BrixelInputText}
            type="number"
          />
        </div>
        <div data-history="constructionYear">
          <Field
            className="mb-2"
            name="properties.building.built"
            label="Construction year"
            component={BrixelInputText}
            type="number"
          />
        </div>
        <div data-history="locationInput">
          <Maps
            zoom={14}
            scrollZoom
            moveMarker
            draggable
            showSearchLocation
            showMap
          />
        </div>
        <div data-history="ownerType">
          <Field
            className="mb-2"
            name="ownerType"
            label="Property Type"
            component={BrixelRadioButton}
            options={[
              {
                "label": "I would like to sell my property",
                "value": "seller"
              },
              {
                "label": "Because of an inheritance or transfer within the family",
                "value": "inheritance"
              },
              {
                "label": "I just want to know the price development of my property. I don't want to sell",
                "value": "price-development"
              },
              {
                "label": "I would like to conclude or renew my mortgage",
                "value": "mortgage"
              },
              {
                "label": "I would like to buy a property",
                "value": "buyer"
              },
              {
                "label": "Just out of curiosity",
                "value": "curiosity"
              },
              {
                "label": "Other reason",
                "value": "other"
              }
            ]}
            deactivable={false}
          />
        </div>
        <div data-history="ownerType">
          <Field
            className="mb-2"
            name="whenToSell"
            label="When to sell"
            component={BrixelRadioButton}
            options={[
              {
                "label": "As soon as possible",
                "value": "asap"
              },
              {
                "label": "In a few months",
                "value": "few-months"
              },
              {
                "label": "I don't want to sell now",
                "value": "no-sell"
              }
            ]}
            deactivable={false}
          />
        </div>
      </Swiper>
    </main>
  );
}

GetStarted.propTypes = {
  errorMsg: PropTypes.object,
  formValue: PropTypes.object,
  handleGetToken: PropTypes.func.isRequired,
  handleSetErrorMsg: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
};

GetStarted.defaultProps = {
  errorMsg: {},
  loggedUser: {},
};

const mapStateToProps = (state, props) => ({
  errorMsg: get(state, 'common.errorMsg', null),
  formValue: get(state, 'form.LoginForm.values', {}),
  loggedUser: get(state, 'user.loggedUser', {}),
});
const mapDispatchToProps = (dispatch) => ({
  handleGetToken: bindActionCreators(getToken, dispatch),
  handleSetErrorMsg: bindActionCreators(errorMessage, dispatch),
});

const GetStartedForm = reduxForm({
  form: 'GetStarted' // a unique identifier for this form
})(GetStarted);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(GetStartedForm);
