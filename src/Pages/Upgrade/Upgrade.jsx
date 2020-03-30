/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrixelButtonIcon } from '@brixel/brixel-components';
import MultiStepForm from '../../components/MultiStepReduxForm';
import { UpgradeQuestions } from '../../resources/Upgrade';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { BrixelButtonPrimary } from '@brixel/brixel-components';
import InfoImg from '../../images/Upgrade/info.svg';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
import { reset } from 'redux-form';

const Support = Loadable({
  loader: () => import('../../components/Support' /* webpackChunkName: "Support" */),
  loading: Loading,
});

const Upgrade = (props) => {
  // PROPS
  const {
    errorValue,
    formValue,
    history,
    reset,
  } = props;
  // STATE
  const [questions, setQuestions] = useState(UpgradeQuestions('en'));
  const [position, setPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quest, setQuest] = useState(UpgradeQuestions('en')[0]);
  const [isEnter, setIsEnter] = useState(true);

  useEffect(() => {
    return () => {
      setCurrentIndex(0);
      reset('Property');
    }
  }, []);

  useEffect(() => {
    setIsEnter(true);
  }, [currentIndex]);

  const closeWindow = () => {
    const url = localStorage.getItem('backUrl');
    localStorage.removeItem('backUrl');
    history.push(url);
  };

  const saveData = () => {
    console.log('saveData');
  };

  const changeStep = (act) => {
    setIsEnter(false);
    let newIndex = currentIndex;
    if (act === 'back') {
      newIndex -= 1;
    } else {
      newIndex += 1;
    }
    if (questions[currentIndex + 1].toSave) {
      saveData();
    }
    setCurrentIndex(newIndex);
    setPosition(newIndex);
    setQuest(questions[newIndex]);
  };

  useEffect(() => {
    if (formValue.id) {
      let newQuest = [];
      UpgradeQuestions('en').map((quest) => {
        if (quest.condition) {
          let isValid = true;
          quest.condition.map((item) => {
            if (get(formValue, item.name, null) !== item.value) {
              isValid = false
            }
            return null;
          });
          if (isValid) newQuest.push(quest);
        } else {
          newQuest.push(quest);
        }
        return null;
      });
      setQuestions(newQuest);
    }
  }, [formValue]);

  const valideConditionInput = (quest) => {
    let isVerified = true;
    if (quest.condition) {
      quest.condition.map((item) => {
        if (get(formValue, item.name, null) !== item.value) {
          isVerified = false;
        }
        return null;
      });
    }
    return isVerified;
  };

  const checkValidateField = () => {
    let isValid = true;
    if (questions[currentIndex].inputs) {
      questions[currentIndex].inputs.map((input) => {
        const err = get(errorValue, input.name, null);
        if (err !== true && isValid) isValid = false;
        return null;
      });
    }
    return isValid;
  };

  const buttonLabel = () => {
    let label;
    if (currentIndex === 0) label = 'Order now';
    else if (currentIndex === questions.length - 1) label = 'Back to Hub';
    else label = 'Next';
    return label;
  };

  return (
    <div className="bgLight200 p-1 h-perc-100" id="upgrade">
      <div className="w-perc-100 h-perc-100 bgWhite brdRadius shadow-1dp dis-fl-col ov-h">
        <div className="dis-f jc-fe p-1 p-md-2 h-fix-72">
          <BrixelButtonIcon
            icon="close-small"
            color="primary"
            saturationTxt={400}
            bgTransparent
            noBorder
            className="shadow-1dp"
            onClick={() => closeWindow()}
          />
        </div>
        <div className="slideIn-enter bodyModalFlow pos-r">
          <div
            className={`slideMultiStepForm ${isEnter ? 'slideIn-enter-active' : ''}`}
          >
            <div
              className={`sidebarSubmenuContent max-h-perc-100 dis-fl-col a-c singleStepUpgrade ${quest.background || ''} ${quest.vCentered ? 'vertCentered' : ''}`}
            >
              {
                quest.inputs ? (
                  <div className={`subcontainer ${quest.className || ''}`}>
                    <h3 className="mb-1">{quest.title}</h3>
                    {quest.subtitle && ( <p className="mb-4">{quest.subtitle}</p> )}
                    {
                      quest.inputs.map((input, f) => (
                        <>
                          {
                            valideConditionInput(input) && (
                              <MultiStepForm
                                key={f.toString()}
                                disableNextBtn={false}
                                formValue={formValue}
                                onClick={() => ''}
                                input={input}
                              />
                            )
                          }
                        </>
                      ))
                    }
                  </div>
                ) : (
                  <div className={`subcontainer ta-c ${quest.className || ''}`}>
                    <img src={quest.img} alt={quest.title} />
                    <h3
                      className="mt-5"
                      dangerouslySetInnerHTML={{ __html: quest.title }}
                    />
                    <p
                      className="mt-2"
                      dangerouslySetInnerHTML={{ __html: quest.subtitle }}
                    />
                  </div>
                )
              }
            </div>
          </div>
          {
            currentIndex === 0 && (
              <Support/>
            )
          }
        </div>
        <div className="footerActionUpgrade dis-f p-1 p-md-2 a-c jc-c container pos-r">
          <div className={`max-w-fix-544 w-perc-100 jc-b jc-c-md a-c ${currentIndex === 0 ? 'dis-fl-col dis-fl-row-md' : 'dis-fl-row'}`}>
            {
              currentIndex === 0 && (
                <div className="dis-fl-col dis-fl-row-md a-c">
                  <img src={InfoImg} alt="Info" className="mb-1 mb-md-0" />
                  <p className="body2 ml-1 mb-1 mb-md-0 ta-c ta-l-md">
                    Don't worry. You will not be charged for now. Get the result first. Pay later.
                  </p>
                </div>
              )
            }
            {
              currentIndex > 0 && questions[currentIndex].inputs && (
                <BrixelButtonIcon
                  className={`shadow-2dp backBtn`}
                  icon="arrow-simple-left"
                  onClick={() => changeStep('back')}
                  background="white"
                  saturation={0}
                  color="primary"
                  saturationTxt={400}
                  noBorder
                />
              )
            }
            <BrixelButtonPrimary
              className="noWrap w-perc-100 max-w-fix-160"
              disabled={!checkValidateField()}
              rounded
              background={questions[currentIndex -1] ? 'primary' : 'red'}
              saturation={400}
              label={buttonLabel()}
              rightIcon="arrow-right-small"
              onClick={() => questions[currentIndex +1] ? changeStep() : closeWindow()}
            />
          </div>
        </div>
      </div>
    </div>
  )
};

Upgrade.propTypes = {
  formValue: PropTypes.object.isRequired,
  errorValue: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorValue: get(state, 'form.Property.syncErrors', {}),
  formValue: get(state, 'form.Property.values', {}),
});

const mapDispatchToProps = (dispatch) => ({
  reset(form) {
    (dispatch(reset(form)))
  },
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Upgrade);
