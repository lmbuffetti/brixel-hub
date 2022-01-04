import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  BrixelButtonPrimary, BrixelRadioButton, change, FactsOptions,
} from '@brixel/brixel-components';
import MarketCardSmall from '../../components/MarketCardSmall';
import TestDriveImg from '../../images/welcomeOnboarding/tstDrive.png';
import OverviewImg from '../../images/welcomeOnboarding/overview.png';
import DiscussImg from '../../images/welcomeOnboarding/discuss.png';

const { factsOptions } = FactsOptions;

const WelecomeOnboardingStage = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const [step, setStep] = useState(1);
  const {
    activeSingleProperty,
    changeFieldValue,
  } = props;

  const onChangeStep = () => {
    setStep(step + 1);
    history.push(`/packageFlow/${activeSingleProperty.id}/welcomeSeller/${factsOptions.progressBarOptions[0].value}/step${step + 1}`);
  };

  const onChange = (val) => {
    switch (val) {
      case 'testDrive':
        history.push(`/${activeSingleProperty.id}/trialRequest/introScanFlow?action=on-site`);
        changeFieldValue('scanFlow', 'analysis', 'remote');
        changeFieldValue('scanFlow', 'bookType', 'whereby');
        break;
      case 'overview':
        history.push(`/${activeSingleProperty.id}/home`);
        break;
      case 'discuss':
        changeFieldValue('scanFlow', 'analysis', 'on-site');
        changeFieldValue('scanFlow', 'bookType', 'online');
        history.push(`/${activeSingleProperty.id}/trialRequest/introScanFlow?action=remote`);
        break;
      default:
        return null;
    }
    return null;
  };

  switch (step) {
    case 1:
      return (
        <div className="multiFieldWrap w-perc-100">
          <div className="dis-f jc-b h-perc-100 a-c">
            <div
              className="dis-f-col jc-c a-c w-perc-100 pos-r"
            >
              <MarketCardSmall
                disableClick
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
    case 2:
      return (
        <div>
          <BrixelRadioButton
            design={{
              className: 'radioBtnImg',
            }}
            label=""
            icons
            cardLayout
            pdClass="py-1 pb-sm-5 pt-sm-4"
            isHorizontal
            disableDelay
            options={[
              {
                label: 'Test drive our service',
                value: 'testDrive',
                img: TestDriveImg,
                color: 'blue',
              },
              {
                label: 'Explore the tool on your own',
                value: 'overview',
                img: OverviewImg,
                color: 'blue',
              },
              {
                label: 'Discuss your options',
                value: 'discuss',
                img: DiscussImg,
                color: 'blue',
              },
            ]}
            input={{
              name: 'userType',
              onChange: (val) => onChange(val),
            }}
          />
        </div>
      );
    default:
      return null;
  }
};

WelecomeOnboardingStage.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
});

const mapDispatchToProps = (dispatch) => ({
  changeFieldValue(form, field, value) {
    dispatch(change(form, field, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WelecomeOnboardingStage);
