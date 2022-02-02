/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import GreenHouseImg from '../../images/scanTrial/green_house.svg';
import ScheduleImg from '../../images/scanTrial/schedule.svg';

const ResumeTrialFlow = (props) => {
  // PROPS
  const {
    formValue,
    userLang,
  } = props;

  return (
    <main id="rewards" className="pb-4 h-perc-100 txtDark700">

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
              <span className="ml-small-4 mr-small-4">at</span>
              <span>{DateTime.fromMillis(get(formValue, 'date', 1624618800000), { locale: userLang }).toFormat('HH:mm')}</span>
            </h4>
            <p className="ta-c mt-2">This is just a request. We will contact you to confirm your appointment.</p>
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
                  <span className="ml-small-4 mr-small-4">at</span>
                  <span>{DateTime.fromMillis(get(formValue, 'date', 1624618800000), { locale: userLang }).toFormat('HH:mm')}</span>
                </h4>
              )
            }
            <p className="ta-c mt-2">You also got an e-mail with a confirmation and more details.</p>
          </div>
        )
      }

      {
        get(formValue, 'bookType', 'whereby') === 'whereby' && (
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
  userLang: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.scanFlow.values', {}),
  userLang: get(state, 'user.loggedInUser.user.language', 'en').toLowerCase(),
});

export default compose(
  connect(mapStateToProps, null),
)(ResumeTrialFlow);
