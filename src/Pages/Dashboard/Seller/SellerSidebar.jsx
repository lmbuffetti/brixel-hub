/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  BrixelIcon,
  FactsOptions,
} from '@brixel/brixel-components';

const { factsOptions } = FactsOptions;

const SellerSidebar = (props) => {
  // PROPS
  const {
    activeSingleProperty,
  } = props;
  // STATE
  const [stepProgrss, setStepProgrss] = useState({});
  const [stepIndexProgrss, setIndexProgrss] = useState(0);

  useEffect(() => {
    if (activeSingleProperty.id) {
      console.log(activeSingleProperty.progress.state, factsOptions.progressBarOptions);
      const defState = factsOptions.progressBarOptions.find((item) => item.value === activeSingleProperty.progress.state);
      const defIndexState = factsOptions.progressBarOptions.findIndex((item) => item.value === activeSingleProperty.progress.state);
      setStepProgrss(defState);
      setIndexProgrss(defIndexState);
    }
  }, [activeSingleProperty.id]);

  return (
    <div className="seller-sidebar w-perc-100 max-w-fix-368 p-3">
      <span className="txtDark700"><span>Your Progress:</span> <span className="ml-1 fweight-600">{stepProgrss.label}</span></span>
      <div className="progress-steps dis-f jc-b pos-r mb-4 mt-2">
        <span className="liner" />
        {
          factsOptions.progressBarOptions.map((progress, i) => (
            <div className={`step-item ${stepIndexProgrss >= i ? 'active' : ''}`} key={i.toString()}>
              <span>{i + 1}</span>
            </div>
          ))
        }
      </div>
      <div className="updates dis-fl-col">
        <p className="fweight-600 txtDark700 mb-2">Updates</p>
        <div className="update-item brdRadius brdSmall p-2 dis-f">
          <BrixelIcon
            background="AltColor"
            saturation="1000"
            color="AltColor"
            saturationTxt="700"
            padding="p-small-12"
            icon="tag"
            rounded
            className="as-fs"
            iconSize="large"
          />
          <div className="pl-2">
            <p className="fsize-300 txtDark600">Hi Michael, why not try our test drive service for free.</p>
            <p className="fsize-200 pt-small-4 txtLight400">8 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

SellerSidebar.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
};

SellerSidebar.defaultProps = {
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
