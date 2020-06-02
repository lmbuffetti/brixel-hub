/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BrixelIcon } from '@brixel/brixel-components';
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom';
import BrixelModalFullScreen from './BrixelModalFullScreen';
import brixels from '../images/BrxielComingTown/brixels.svg';
import { setModal } from '../actions/CommonActions';
import get from 'lodash/get';
import { sortObject } from '../utils/helpers';
import { connect } from 'react-redux';

const BrixelModalAwards = (props) => {
  // PROPS
  const {
    awards,
    brixelPoints,
    gameGroup,
    gameHistory,
    handleSetModal,
    history,
    userTypes,
  } = props;
  // STATE
  const [toDo, setToDo] = useState(0);
  const [done, setDone] = useState(0);
  // PARAMS URL
  const propID = history.location.pathname.split('/')[1];

  const onClose = () => {
    handleSetModal({
      showAwardsInfo: false,
    })
  }

  useEffect(() => {
    if (gameGroup && gameHistory) {
      // let numDone = 0;
      let numTodo = 0;
      const usrGroups = gameGroup.sort(sortObject('stub', 'asc'))
      usrGroups.forEach((groups) => {
        if (groups.stub.includes(userTypes)) {
          groups.achievements.forEach((group) => {
            if (group.achievementType === 'award') {
              numTodo += 1;
            }
          });
        }
      });
      setDone(awards);
      setToDo(numTodo);
    }
  }, [gameGroup, gameHistory])

  return (
    <BrixelModalFullScreen
      title="Your achievements"
      state={true}
      onClose={() => onClose()}
    >
      <div>
        <div className="bgGreen100 brdRadius p-2">
          <div className="dis-f w-perc-100 a-c">
            <BrixelIcon iconSize="fsize-900" icon="cup-awards" color="green" />
            <div className="w-perc-100 ml-2">
              <p className="heading5 mb-1 dis-f jc-b">
                <span>Awards</span>
                <span className="ff-mono fweight-700">{done}/{toDo}</span>
              </p>
              {/* <BrixelProgressBar
                classProgressBar={'pos-r'}
                rounded
                barBackground="Light"
                backgroundSaturation={200}
                progressValue={done * 100 / (done + toDo)}
                color="Green"
                saturation={400}
                classBackground="ov-h brdRadius"
                large={window.innerWidth >= 1024}
                small={window.innerWidth < 1024}
              /> */}
            </div>
          </div>

          <p className="mt-3">Who does not like awards? To honor your effort and endurance we award you. Keep going to collect more and enjoy the ride.</p>

        </div>

        <div className="bgRed100 brdRadius p-2 mt-3">
          <div className="dis-f w-perc-100 a-c">
            <img className="w-fix-40" src={brixels} alt="icon awards" />
            <div className="w-perc-100 ml-2">
              <p className="heading5 dis-f jc-b a-c">
                <span>Brixels</span>
                <span className="ff-mono fweight-700">{brixelPoints.toLocaleString('de-CH')}</span>
              </p>
            </div>
          </div>

          <p className="mt-3"><span>This is our currency. You earn Brixels by completing tasks and getting awards.</span>

            <span className="txtRed700 fweight-500 dis-b mt-4">Coming soon: During your journey you can use Brixels to unlock additional features and gifts.</span></p>

        </div>
      </div>
    </BrixelModalFullScreen>
  )
};

BrixelModalAwards.propTypes = {
  awards: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  brixelPoints: get(state, 'user.brixelPoints', 0),
  formValue: get(state, 'form.Property.values', {}),
  property: get(state, 'property.activeSingleProperty', {}),
  gameHistory: get(state, 'gamification.gameHistory', {}),
  gameGroup: get(state, 'gamification.gameGroup', []),
  awards: get(state, 'user.awards', 0),
  userTypes: get(state, 'user.userTypes', null),
  windowDimensions: get(state, 'common.windowDimensions', {}),
});

const mapDispatchToProps = (dispatch) => ({
  handleSetModal: bindActionCreators(setModal, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(BrixelModalAwards);
