import get from 'lodash/get';
import { BrixelButtonPrimary, Helpers } from '@brixel/brixel-components';
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import testdriveLarge from '../images/Market/testdrive.jpeg';
import testDrive from '../images/dashboard/testDrive.png';

const BoxTrialTestDirve = (props) => {
  const history = {
    push: useNavigate(),
    location: useLocation(),
  };
  const {
    activeSingleProperty,
    activeSingleCompany,
    className,
    windowDimensions,
    isLarge,
  } = props;

  const bookNow = () => {
    if (activeSingleProperty.id) {
      localStorage.setItem('backUrl', history.location.pathname);
      history.push(`/${activeSingleProperty.id}/trialRequest`);
    }
  };

  return (
    <div
      onClick={() => bookNow()}
      className={`testDrive cur-poi dis-f-sm a-c brdRadius bgWhite ${isLarge ? 'w-perc-100 jc-c' : 'p-2'} ${className}`}
    >
      {
        isLarge ? (
          <div className="max-w-fix-144 min-h-fix-200 min-h-fix-sm-360 max-w-fix-sm-264 w-perc-100 ml-a mr-a mr-md-0 mb-2 mb-md-0">
            <img
              src={testdriveLarge}
              alt=""
            />
          </div>
        ) : (
          <img
            className={windowDimensions.width <= 590 ? 'dis-b mx-a' : ''}
            width={windowDimensions.width <= 590 ? 300 : 300}
            src={testDrive}
            alt=""
          />
        )
      }
      <div className={`${isLarge ? 'pl-0 pl-md-3 mr-a' : ''} ta-c ta-l-md`}>
        <h3 className={`${isLarge ? 'fsize-700 pb-2' : 'fsize-500 pb-1'} txtDark700 fweight-600 `}>Test drive our service. <br /> No strings attached.</h3>
        <p className={`txtDark700 ${isLarge ? 'fSizePx18 fsize-sm-500 fweight-400 mb-3 px-2 px-sm-0' : ''}`}>
          <span>Get the full Brixel experience</span>
          <span className="dis-b">worth {activeSingleCompany && get(activeSingleCompany, 'meta.teaserPackage.currency', '')} {Helpers.formatNumberValue(get(activeSingleCompany, 'meta.teaserPackage.price', ''), get(activeSingleCompany, 'meta.teaserPackage.currency', ''))}</span>
        </p>
        <div className="dis-f jc-c jc-fs-md">
          <BrixelButtonPrimary
            onClick={() => bookNow()}
            rounded
            theme="Red"
            label="Book Now"
            className={`${isLarge ? 'mt-1' : 'mt-3'}`}
          />
        </div>
      </div>

    </div>
  );
};

BoxTrialTestDirve.propTypes = {
  activeSingleCompany: PropTypes.object.isRequired,
  activeSingleProperty: PropTypes.object.isRequired,
  className: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
  isLarge: PropTypes.bool,
};

BoxTrialTestDirve.defaultProps = {
  className: '',
  isLarge: false,
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(BoxTrialTestDirve);
