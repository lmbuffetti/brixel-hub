/* eslint-disable react-hooks/exhaustive-deps */
import translateTo from '../../../utils/translation';
import React from 'react';
import { compose } from 'redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GreenHouseImg from '../../../images/scanTrial/green_house.svg';
import ScheduleImg from '../../../images/scanTrial/schedule.svg';

const ResumeTrialFlow = (props) => {
  // PROPS
  const {
    formValue,
    lang,
  } = props;

  return (
    <main id="rewards" className="pb-4 h-perc-100 txtDark700">

      {
        get(formValue, 'analysis', '') === 'on-site' && (
          <div className="max-w-fix-360 ml-a mr-a ta-c">
            <img loading="lazy" width="164" src={GreenHouseImg} alt="Resume" />
            <h4 className="fweight-400 ta-c mt-3">{translateTo('Thanks for booking your on-site appointment.', lang)}</h4>
            <p className="ta-c mt-2">{translateTo('You will get an e-mail with a confirmation and more details.', lang)}</p>
          </div>
        )
      }

      {
        get(formValue, 'analysis', '') === 'remote' && (
          <div className="max-w-fix-360 ml-a mr-a ta-c">
            <img loading="lazy" src={ScheduleImg} alt="Resume" />
            <p className="ta-c mt-2">
              {translateTo('Thank you for completing your video call.', lang)}
            </p>
          </div>
        )
      }

    </main>
  );
};

ResumeTrialFlow.propTypes = {
  formValue: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  formValue: get(state, 'brixelForm.scanFlow.values', {}),
  lang: get(state, 'common.language', 'en'),
});

export default compose(
  connect(mapStateToProps, null),
)(ResumeTrialFlow);
