/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { getActiveSingleProperty } from '../../actions/PropertyActions';
import { spinnerOff } from '../../actions/CommonActions';
import WelecomeOnboardingStage from './WelecomeOnboardingStage';

const WelcomeSeller = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const match = useParams();
  // PROPS
  const {
    handleGetActiveSingleProperty,
    handleSpinnerOff,
  } = props;
  // GET URL PARAMS
  const propID = get(match, 'propID', null);

  const changeStep = (e) => {
    if (e) e.preventDefault();
  };

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(history);
    handleSpinnerOff();
    if (propID) {
      handleGetActiveSingleProperty({ id: propID });
    }
  }, []);

  return (
    <div id="bodyModalWrapper" className="withHeader getStarted buyerHub">
      <div
        className="bodyModal bgAltGreen200"
      >
        <form
          id="multiStepForm"
          autoComplete="off"
          className="interactive dis-fl-col jc-b"
          onSubmit={(e) => changeStep(e)}
        >
          <div className="multiStepSlides">
            <div className="singleStep pt-6 jc-c">
              <div className="subcontainer m-a">
                <div id="step-1" className="dis-f flex-wrap">
                  <div className="ta-c max-w-fix-456 m-a">
                    <WelecomeOnboardingStage />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

WelcomeSeller.propTypes = {
  handleSpinnerOff: PropTypes.func.isRequired,
  handleGetActiveSingleProperty: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleGetActiveSingleProperty: bindActionCreators(getActiveSingleProperty, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(WelcomeSeller);
