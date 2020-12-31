/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useState,
} from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  withRouter,
} from 'react-router-dom';
import {
  BrixelButtonPrimary,
  BrixelButtonIcon,
} from '@brixel/brixel-components';
import last from 'lodash/last';
import { MediaQuestions } from '../../../resources/MediaExplanation';
import PageHeaderAchievement from '../../../components/PageHeaderAchievement';

function MediaExplanation(props) {
  // PROPS
  const {
    gameGroup,
    history,
    lang,
    match,
  } = props;
  // STATE
  const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selGameGroup, setSelGameGroup] = useState({});
  const [Questions] = useState(MediaQuestions(lang));

  // GET URL PARAMS
  const getAchievement = () => last(history.location.pathname.split('/'));
  const propID = get(match, 'params.propId', null);

  // GET CURRENT GAME GROUP
  useEffect(() => {
    if (gameGroup.length > 0) {
      const group = gameGroup.find((game) => game.achievements.some((item) => item.stub === getAchievement()));
      const defGroup = group.achievements.find((item) => item.stub === getAchievement());
      setSelGameGroup(defGroup);
    }
  }, [gameGroup]);

  // Function to move next/prev question
  const changeStep = (act) => {
    let newPosition = position;
    if (act === 'back') {
      newPosition = position - 1;
    } else {
      newPosition = position + 1;
    }
    setPosition(newPosition);
    setCurrentIndex(newPosition);
  };

  // FUNCTION TO CHANGE STEP
  const onClickNextBtn = () => {
    if (currentIndex === Questions.length - 1) {
      localStorage.setItem('donMediaExplanation', propID);
      history.push(`/${propID}/rewards/media`);
    } else {
      changeStep();
    }
  };

  return (
    <main id="bodyModalWrapper" className="achievementFlow">
      <div className="bodyModal">
        <PageHeaderAchievement
          icon={selGameGroup.icon}
          title={selGameGroup.description}
          isFree
          subtitle={selGameGroup.name}
        />
        <form
          id="multiStepForm"
          onSubmit={(e) => e.preventDefault()}
          autoComplete="off"
        >
          <div className="multiStepSlides" style={{ transform: `translate(-${position * 100}%, 0)` }}>
            {
              Questions.map((quest, i) => (
                <div
                  id={`step-${i}`}
                  className={`singleStep ${quest.background || ''} ${quest.vCentered ? 'vertCentered' : ''}`}
                  key={i.toString()}
                  style={{
                    visibility: i !== currentIndex ? 'hidden' : 'visible',
                    maxWidth: i !== currentIndex ? '' : '100%',
                    opacity: i !== currentIndex ? '0' : '1',
                  }}
                >
                  <div className={`subcontainer w-perc-100 m-a ${quest.className || ''}`}>
                    <h3 className="ta-c mb-5">{quest.title}</h3>
                    <img src={quest.img} alt={quest.title} />
                    <p className="mt-3 max-w-fix-304 m-a ta-c">{quest.description}</p>
                  </div>
                </div>
              ))
            }
          </div>
          <div
            className="footerAction p-1 p-md-2 shadow-1dp-top"
          >
            <div className="container pos-r">
              <div className="subcontainer">
                <div
                  className="dis-f a-c jc-b"
                >
                  <BrixelButtonIcon
                    className="backBtn"
                    icon="arrow-simple-left"
                    onClick={() => changeStep('back')}
                    ghost
                    disabled={currentIndex === 0}
                  />
                  <BrixelButtonPrimary
                    rounded
                    label={currentIndex === Questions.length - 1 ? 'Finish' : 'Ok, next'}
                    background="primary"
                    className=""
                    onClick={() => onClickNextBtn()}
                    rightIcon="arrow-right-small"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

MediaExplanation.propTypes = {
  gameGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
  lang: PropTypes.string,
  match: PropTypes.object.isRequired,
};

MediaExplanation.defaultProps = {
  lang: 'en',
};

const mapStateToProps = (state) => ({
  gameGroup: get(state, 'gamification.gameGroup', []),
});

export default compose(
  withRouter,
  connect(mapStateToProps, null),
)(MediaExplanation);
