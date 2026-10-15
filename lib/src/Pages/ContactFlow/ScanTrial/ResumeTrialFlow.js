import translateTo from '../../../utils/translation';
import React from 'react';
import { compose } from 'redux';
import get from 'lodash/get';
import { connect } from 'react-redux';
import GreenHouseImg from '../../../images/scanTrial/green_house.svg';
import ScheduleImg from '../../../images/scanTrial/schedule.svg';
const ResumeTrialFlow = (props) => {
    // PROPS
    const { formValue, lang, } = props;
    return (React.createElement("main", { id: "rewards", className: "pb-4 h-perc-100 txtText900" },
        get(formValue, 'analysis', '') === 'on-site' && (React.createElement("div", { className: "max-w-fix-360 ml-a mr-a ta-c" },
            React.createElement("img", { loading: "lazy", width: "164", src: GreenHouseImg, alt: "Resume" }),
            React.createElement("h4", { className: "fweight-400 ta-c mt-3" }, translateTo('Thanks for booking your on-site appointment.', lang)),
            React.createElement("p", { className: "ta-c mt-2" }, translateTo('You will get an e-mail with a confirmation and more details.', lang)))),
        get(formValue, 'analysis', '') === 'remote' && (React.createElement("div", { className: "max-w-fix-360 ml-a mr-a ta-c" },
            React.createElement("img", { loading: "lazy", src: ScheduleImg, alt: "Resume" }),
            React.createElement("p", { className: "ta-c mt-2" }, translateTo('Thank you for completing your video call.', lang))))));
};
const mapStateToProps = (state) => ({
    formValue: get(state, 'brixelForm.scanFlow.values', {}),
    lang: get(state, 'common.language', 'en'),
});
export default compose(connect(mapStateToProps, null))(ResumeTrialFlow);
