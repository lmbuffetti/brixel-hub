/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
// import cloneDeep from 'lodash/cloneDeep';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import {
  BrixelIcon,
  BrixelButtonPrimary,
  ProgressRing,
} from '@brixel/brixel-components';

import { calcPercentageProEstimation } from '../../../utils/helpers';
import docIcon from '../../../images/dashboard/icon-docs.svg';

import Loading from '../../../components/Loading';
import { setModal, spinnerOff } from '../../../actions/CommonActions';
import CoverPropertyImage from '../../../components/CoverPropertyImage';
// import Support from '../../../components/Support';
// import BrixelUpgradeMessage from '../../../components/BrixelUpgradeMessage';

const DashboardHome = (props) => {
  // PROPS
  const {
    activeSingleProperty,
    // windowDimensions,
    isSmallLoading,
    userTypes,
    history,
    /* formValue,
    gameGroup,
    gameHistory,
    handleAddGameHistory,
    isLoading,
    handleSpinnerOff, */
    proEstimation,
    windowDimensions,
    match,
  } = props;

  // UNTILE NO PROPERTY OR NO USER TYPE SHOW THE LOADING
  if ((!activeSingleProperty.id && !userTypes) || isSmallLoading.getProperty) {
    return <Loading />;
  }

  // const classToHide = get(history, 'location.state.hideBackPage', false);

  return (
    <div className="rewards-container" id="rewardsDashboard">
      <h3 className="mb-3 hide dis-b-lg">Welcome back Jim 👋</h3>
      <div className="max-w-fix-768 dis-fl-col">
        <div className="shadow-2dp bgWhite brdRadius dis-fl-col dis-fl-row-sm pt-sm-3 pb-sm-3 pl-sm-4 pt-0 ov-h pb-3 mb-3">
          <div className="imgSection w-perc-100 w-fix-sm-232 h-fix-sm-152 pos-r">
            <CoverPropertyImage
              className="cover w-perc-100 h-perc-100"
              coverPhoto={get(activeSingleProperty, 'coverPhoto.galleryThumbnailPath', undefined)}
              propertyType={get(activeSingleProperty, 'properties.propertyType', undefined)}
            />
            <span className="pos-a-fix x-r-1 x-b-1 bgAltColor700 p-small-10 txtWhite opacity-08">
              Edit
            </span>
          </div>
          <div className="px-3 pl-sm-4 pt-2 pt-sm-1 dis-fl-col jc-b">
            <div className="d">
              <h4 className="txtAltColor100 fweight-600"> {get(activeSingleProperty, 'title', '')} </h4>
              <span className="fsize-400 txtDark200"> {get(activeSingleProperty.location, 'city', '')}, {get(activeSingleProperty.location, 'state', '')}  </span>

            </div>
            <div className="dis-f pt-2">
              <BrixelIcon
                background="AltColor"
                saturation="1000"
                color="AltColor"
                saturationTxt="700"
                padding="p-small-12"
                icon="chart"
                rounded
                iconSize="large"
              />
              <div className="dis-fl-col pl-2">
                <span className="txtDark200 fsize-400"> Your Bestimate</span>
                <span className="txtAltColor700 fweight-600"> CHF 1’344’849</span>
              </div>
              <div className="tagBg dis-f a-c">
                <span className="dot" /> <span className="px-2 txtAltColor700"> Set your priece </span>
              </div>
            </div>
          </div>
        </div>
        <div className="dis-f">
          <div className="shadow-2dp bgAltColor1000 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 mr-1 pb-3 w-perc-100 max-w-fix-300 w-perc-sm-50">
            <div className="dis-fl-col">
              <span className="fsize-400 txtAltColor900">Pro estimation</span>
              <span className="fsize-600 fweight-600 txtAltColor700">{calcPercentageProEstimation().realPerc}% <span> Complete</span></span>
              <BrixelButtonPrimary
                label="Next step"
                theme="AltColor"
                themeSat="700"
                className="mt-2"
                rounded
              />
            </div>
            <div className="div">
              <ProgressRing
                progress={calcPercentageProEstimation().realPerc}
                size={windowDimensions.width <= 590 ? 80 : 100}
                strokeWidth={14}
                circleOneStroke="#fff"
                circleTwoStroke={calcPercentageProEstimation().realPerc === 100 ? '#218B80' : '#1E1491'}
                showIcon={false}
                showIconComplete={calcPercentageProEstimation().realPerc === 100}
              />
            </div>
          </div>
          <div className="shadow-2dp bgAltColor300 brdRadius dis-f jc-b pt-2 px-2 px-sm-3 pb-3 ml-1 w-perc-100 max-w-fix-300 w-perc-sm-50">
            <div className="dis-fl-col">
              <span className="fsize-400 txtAltColor200">Docubox</span>
              <span className="fsize-600 fweight-600 txtAltColor200">
                2 of 4 uploaded
              </span>
              <BrixelButtonPrimary
                label="Next step"
                theme="AltColor"
                themeSat="200"
                className="mt-2"
                rounded
              />
            </div>
            <div className="div">
              <img width="92" src={docIcon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardHome.propTypes = {
  activeSingleProperty: PropTypes.object.isRequired,
  userTypes: PropTypes.string,
  windowDimensions: PropTypes.object.isRequired,
  isSmallLoading: PropTypes.object.isRequired,
  /* formValue: PropTypes.object.isRequired,
  gameGroup: PropTypes.arrayOf(PropTypes.object),
  gameHistory: PropTypes.object,
  handleAddGameHistory: PropTypes.func.isRequired,
  handleSpinnerOff: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired, */
  match: PropTypes.object.isRequired,
  proEstimation: PropTypes.object.isRequired,
};

DashboardHome.defaultProps = {
/*   gameGroup: [],
  gameHistory: {}, */
  userTypes: 'user',
};

const mapStateToProps = (state) => ({
  activeSingleProperty: get(state, 'property.activeSingleProperty', {}),
  awards: get(state, 'user.awards', []),
  brixelPoints: get(state, 'user.brixelPoints', []),
  formValue: get(state, 'brixelForm.Property.values', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  isSmallLoading: get(state, 'common.isSmallLoading', {}),
  isLoading: get(state, 'common.isLoading', 0) > 0,
  language: get(state, 'user.loggedInUser.user.language', 'en'),
  loggedInUser: get(state, 'user.loggedInUser', {}),
  userTypes: get(state, 'user.userTypes', null),
  history: PropTypes.object.isRequired,
  windowDimensions: get(state, 'common.windowDimensions', {}),
  proEstimation: get(state, 'brixelForm.Property.values.proEstimation', {}),
});

const mapDispatchToProps = (dispatch) => ({
  // handleAddGameHistory: bindActionCreators(addGameHistory, dispatch),
  handleSetModal: bindActionCreators(setModal, dispatch),
  handleSpinnerOff: bindActionCreators(spinnerOff, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardHome);
