/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import GreenHouseImg from '../../images/scanTrial/green_house.svg';
import ScheduleImg from '../../images/scanTrial/schedule.svg';
import WherbyImg from '../../images/scanTrial/whereby.svg';

const ResumeTrialFlow = (props) => {
  // PROPS
  const {
    formValue,
    step,
    userLang,
  } = props;

  return (
    <main id="rewards" className="introScanFlow pb-4 h-perc-100 txtDark700">

      {
        get(formValue, 'bookType', '') === 'phone' && (
          <div className="max-w-fix-360 ml-a mr-a ta-c">
            <img width="164" src={GreenHouseImg} alt="Resume" />
            <h4 className="fweight-400 ta-c mt-3">Thanks for booking your on-site appointment.</h4>
            <p className="ta-c mt-2">You will get an e-mail with a confirmation and more details.</p>
          </div>
        )
      }

      {
        get(formValue, 'bookType', '') === 'online' && (
          <div className="max-w-fix-360 ml-a mr-a ta-c">
            <img width="164" src={GreenHouseImg} alt="Resume" />
            <h4 className="fweight-400 ta-c mt-3">Great. Your on-site appointment will be on:</h4>
            <h4 className="fweight-700 mt-2">
              <span>{DateTime.fromMillis(get(formValue, 'date', 1624618800000), { locale: userLang }).toFormat('EEE, d MMMM yyyy')}</span>
              <spam className="ml-small-4 mr-small-4">at</spam>
              <span>{DateTime.fromMillis(get(formValue, 'date', 1624618800000), { locale: userLang }).toFormat('hh:mm')}</span>
            </h4>
            <p className="ta-c mt-2">You also got an e-mail with a confirmation and more details.</p>
          </div>
        )
      }

      {
        get(formValue, 'bookType', '') === 'schedule' && (
          <div className="max-w-fix-360 ml-a mr-a ta-c">
            <img width="194" src={ScheduleImg} alt="Resume" />
            <h4 className="fweight-400 ta-c mt-3">Great. Your online appointment will be on:</h4>
            {
              get(formValue, 'date', null) && (
                <h4 className="fweight-700 mt-2">
                  <span>{DateTime.fromMillis(get(formValue, 'date', 1624618800000), { locale: userLang }).toFormat('EEE, d MMMM yyyy')}</span>
                  <spam className="ml-small-4 mr-small-4">at</spam>
                  <span>{DateTime.fromMillis(get(formValue, 'date', 1624618800000), { locale: userLang }).toFormat('hh:mm')}</span>
                </h4>
              )
            }
            <p className="ta-c mt-2">You also got an e-mail with a confirmation and more details.</p>
          </div>
        )
      }

      {
        get(formValue, 'bookType', 'whereby') === 'whereby' && !step && (
          <div className="max-w-fix-360 ml-a mr-a ta-c">
            <img width="100" src={WherbyImg} alt="Resume" />
            <h4 className="fweight-700 mt-3">Let&apos;s meet now.</h4>
            <p className="ta-c mt-2">We use Whereby – a safe and easy video call tool from Norway. No installation needed. Just click to start.</p>
          </div>
        )
      }

      {
        get(formValue, 'bookType', 'whereby') === 'whereby' && step === 'wherebyResume' && (
          <div className="max-w-fix-360 ml-a mr-a ta-c">
            <img src={ScheduleImg} alt="Resume" />
            <p className="ta-c mt-2">Thank you for completing your video call.
            </p>
          </div>
        )
      }

    </main>
  );
};

ResumeTrialFlow.propTypes = {
  formValue: PropTypes.object.isRequired,
  step: PropTypes.string,
  userLang: PropTypes.string.isRequired,
};

ResumeTrialFlow.defaultProps = {
  step: null,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.scanFlow.values', {}),
  userLang: get(state, 'user.loggedInUser.user.language', 'en').toLowerCase(),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(ResumeTrialFlow);
