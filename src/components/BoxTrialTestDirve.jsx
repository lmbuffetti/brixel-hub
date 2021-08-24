import get from 'lodash/get';
import { BrixelButtonPrimary, Helpers } from '@brixel/brixel-components';
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import testDrive from '../images/dashboard/testDrive.png';

const BoxTrialTestDirve = (props) => {
  const {
    activeSingleProperty,
    activeSingleCompany,
    className,
    history,
    windowDimensions,
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
      className={`testDrive cur-poi dis-f-md a-c brdRadius bgWhite  p-2 ${className}`}
    >
      <img
        className={windowDimensions.width <= 590 ? 'dis-b mx-a' : ''}
        width={windowDimensions.width <= 590 ? 300 : 300}
        src={testDrive}
        alt=""
      />
      <div className="div ta-c ta-l-md">
        <h3 className="txtDark700 fweight-600 fsize-500">Test drive our service. <br /> No strings attached.</h3>
        <p className="txtDark700">
          <span>Get the full Brixel experience worth</span>
          <span className="ml-small-4">{get(activeSingleCompany, 'meta.teaserPackage.currency', '')} {Helpers.formatNumberValue(get(activeSingleCompany, 'meta.teaserPackage.price', ''), get(activeSingleCompany, 'meta.teaserPackage.currency', ''))}</span>
        </p>
        <div className="dis-f jc-c jc-fs-md">
          <BrixelButtonPrimary
            onClick={() => bookNow()}
            rounded
            theme="AltColor"
            themeSat={400}
            label="Book Now"
            className="mt-3"
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
  history: PropTypes.object.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

BoxTrialTestDirve.defaultProps = {
  className: '',
};

const mapStateToProps = (state) => ({
  activeSingleCompany: get(state, 'companies.activeSingleCompany', {}),
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(BoxTrialTestDirve);
