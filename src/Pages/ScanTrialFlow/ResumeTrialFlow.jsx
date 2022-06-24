/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GreenHouseImg from '../../images/scanTrial/green_house.svg';
import ScheduleImg from '../../images/scanTrial/schedule.svg';

const ResumeTrialFlow = (props) => {
  // PROPS
  const {
    formValue,
  } = props;

  return (
    <main id="rewards" className="pb-4 h-perc-100 txtDark700">

      {
        get(formValue, 'analysis', '') === 'on-site' && (
          <div className="max-w-fix-360 ml-a mr-a ta-c">
            <img width="164" src={GreenHouseImg} alt="Resume" />
            <h4 className="fweight-400 ta-c mt-3">Thanks for booking your on-site appointment.</h4>
            <p className="ta-c mt-2">You will get an e-mail with a confirmation and more details.</p>
          </div>
        )
      }

      {
        get(formValue, 'analysis', '') === 'remote' && (
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
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.scanFlow.values', {}),
});

export default compose(
  connect(mapStateToProps, null),
)(ResumeTrialFlow);
