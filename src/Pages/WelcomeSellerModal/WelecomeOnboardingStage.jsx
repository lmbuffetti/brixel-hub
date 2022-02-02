import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  BrixelButtonPrimary, BrixelRadioButton, change, FactsOptions,
} from '@brixel/brixel-components';
import ApartmentImg from '../../images/welcomeOnboarding/apartment.svg';
import HouseImg from '../../images/welcomeOnboarding/house.svg';
import BuildingLandImg from '../../images/welcomeOnboarding/buildingLand.svg';
import CommercialImg from '../../images/welcomeOnboarding/commercial.svg';
// import TestDriveImg from '../../images/welcomeOnboarding/tstDrive.png';
// import OverviewImg from '../../images/welcomeOnboarding/overview.png';
// import DiscussImg from '../../images/welcomeOnboarding/discuss.png';

const { factsOptions } = FactsOptions;

const WelecomeOnboardingStage = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const [step, setStep] = useState(1);
  const [imgProperty, setImgProperty] = useState(null);
  const {
    activeSingleProperty,
    changeFieldValue,
  } = props;

  const onChangeStep = () => {
    setStep(step + 1);
    history.push(`/packageFlow/${activeSingleProperty.id}/welcomeSeller/${factsOptions.progressBarOptions[0].value}/step${step + 1}`);
  };

  useEffect(() => {
    if (get(activeSingleProperty, 'properties.propertyType', null)) {
      let img;
      switch (activeSingleProperty.properties.propertyType) {
        case 'Apartment':
          img = ApartmentImg;
          break;
        case 'House':
          img = HouseImg;
          break;
        case 'Commercial':
          img = CommercialImg;
          break;
        case 'Building land':
          img = BuildingLandImg;
          break;
        default:
          img = null;
      }
      setImgProperty(img);
    }
  }, [activeSingleProperty]);

  const onChange = (val) => {
    switch (val) {
      case 'testDrive':
        changeFieldValue('scanFlow', 'analysis', 'on-site');
        changeFieldValue('scanFlow', 'bookType', 'online');
        history.push(`/${activeSingleProperty.id}/trialRequest/on-site?url=/sell`);
        break;
      case 'overview':
        history.push(`/${activeSingleProperty.id}/home`);
        break;
      case 'discuss':
        changeFieldValue('scanFlow', 'analysis', 'remote');
        changeFieldValue('scanFlow', 'bookType', 'whereby');
        history.push(`/${activeSingleProperty.id}/trialRequest/remote?url=/sell`);
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
            <div className="dis-f-col jc-c a-c w-perc-100 pos-r pt-2">
              {
                imgProperty && (
                  <img width={315} src={imgProperty} alt={activeSingleProperty.title} />
                )
              }

              <p className="txtDark700 mt-4 mt-sm-7 fweight-600 fsize-600 fsize-sm-700 max-w-fix-424 mx-a">
                <span>Great.</span>
                <span className="mx-small-4">&ldquo;{activeSingleProperty.title}&rdquo;</span>
                <span>is ready.</span>
              </p>

              <p className="mt-3 txtBlack max-w-fix-448 m-a fweight-400 fsize-500 fsize-sm-600">
                Are you ready too?
              </p>

              <BrixelButtonPrimary
                className="mx-a mt-5"
                rounded
                label="Yes, let's go."
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
          <div className="ta-c mb-6">
            <h3 className="fweight-600 txtDark700">Choose your next step</h3>
          </div>
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
                title: 'Test drive our service',
                label: 'Because you would not buy a car without driving it.',
                value: 'testDrive',
                img: '',
                color: 'blue',
              },
              {
                title: 'Explore the tool on your own',
                label: 'For all the explorers who like to click things.',
                value: 'overview',
                img: '',
                color: 'blue',
              },
              {
                title: 'Discuss your options',
                label: 'Yes, a real human expert who is happy to help.',
                value: 'discuss',
                img: '',
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
