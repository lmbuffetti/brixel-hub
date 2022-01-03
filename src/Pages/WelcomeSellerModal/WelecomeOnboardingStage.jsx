import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import MarketCardSmall from '../../components/MarketCardSmall';

const WelecomeOnboardingStage = (props) => {
  const [step, setStep] = useState(0);
  const {
    activeSingleProperty,
  } = props;

  const onChangeStep = () => {
    setStep(step + 1);
  };

  switch (step) {
    case 0:
      return (
        <div className="multiFieldWrap w-perc-100">

          <div className="dis-f jc-b h-perc-100 a-c">
            <div
              className="dis-f-col jc-c a-c w-perc-100 pos-r"
            >
              <MarketCardSmall
                className="bgWhite"
                type="fav"
                showAddess
                item={activeSingleProperty}
              />

              <h3 className="mt-5">
                Congratulations 🎉
              </h3>

              <h4 className="mt-3">
                Your property was successfully created. Let’s move on.
              </h4>

              <BrixelButtonPrimary
                className="mx-a mt-5"
                rounded
                theme="altGreen"
                themeSat={300}
                label="Progress sale"
                rightIcon="arrow-right-small"
                onClick={() => onChangeStep()}
              />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

WelecomeOnboardingStage.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
});

export default connect(mapStateToProps, null)(WelecomeOnboardingStage);
